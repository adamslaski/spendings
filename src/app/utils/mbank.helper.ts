import * as moment from 'moment';
import * as Papa from 'papaparse';
import { MESSAGE_SUBJECT } from '../services/message.service';
import { Transaction } from 'src/app/store/entities';

const win1250decoder = new TextDecoder('windows-1250');
const header = '#Data operacji;#Opis operacji;#Rachunek;#Kategoria;#Kwota;#Saldo po operacji;';
const types = `BLIK KOR. ZAKUPU E-COMMERCE
BLIK P2P-WYCHODZĄCY
BLIK WYPŁATA ATM
BLIK ZAKUP
BLIK ZAKUP E-COMMERCE
EURO-NET  ZWROT ZAKUPU W KRAJU
MOKAZJE UZNANIE
OPŁATA ZA KARTĘ
OPLATA ZA SMS NAD.
PROWIZJA OD WYPŁATY GOTÓWKI W BANKOMACIE WSKAZANEJ SIECI
PRZELEW EXPRESS ELIXIR WYCH.
PRZELEW EXPRESSOWY PRZELEW PRZYCH.
PRZELEW MTRANSFER WYCHODZACY
PRZELEW WALUTOWY PRZYCHODZĄCY
PRZELEW WEWNĘTRZNY PRZYCHODZĄCY
PRZELEW WEWNĘTRZNY WYCHODZĄCY
PRZELEW ZEWNĘTRZNY DO ZUS
PRZELEW ZEWNĘTRZNY PRZYCHODZĄCY
PRZELEW ZEWNĘTRZNY WYCHODZĄCY
PRZEL. EXPRESS ELIXIR WYCH.PROW.
STORNO OBCIĄŻENIA
TESCO  ZWROT ZAKUPU W KRAJU
WYPŁATA GOTÓWKI W BANKOMACIE WSKAZANEJ SIECI
ZAKUP PRZY UŻYCIU CASH BACK
ZAKUP PRZY UŻYCIU KARTY - INTERNET
ZAKUP PRZY UŻYCIU KARTY W KRAJU
ZAKUP PRZY UŻYCIU KARTY ZA GRANICĄ
ZWROT ZAKUPU W KRAJU
`
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

export const parseMBankCSV = async (file: File, accountId: number) => {
  const buffer = await file.arrayBuffer();
  const text = win1250decoder.decode(buffer);
  const idx = text.indexOf(header) + header.length;
  const result = Papa.parse<string[]>(text.substring(idx), {
    delimiter: ';',
    skipEmptyLines: 'greedy',
  });
  if (result.errors.length > 0) {
    MESSAGE_SUBJECT.next({
      message: `W czasie importowania wystąpiły następujące błędy: ${result.errors.join(', ')}`,
      type: 'error',
    });
    return [];
  }
  const trs: Transaction[] = result.data.map((item: string[]) => {
    const [type, description] = parseDescription(item[1]);
    return {
      id: 0,
      date: moment(item[0], 'YYYY-MM-DD').toDate(),
      description,
      comment: item[3],
      category: 0,
      type,
      amount: Number(item[4].replace(',', '.').replace(' PLN', '').replace(' ', '')),
      balanceAfter: Number(item[5].replace(',', '.').replace(' PLN', '').replace(' ', '')),
      account: accountId,
    };
  });
  console.log(result);
  console.log(trs);
  return trs;
};

const parseDescription = (s: string) => {
  const x = types.find((t) => s.indexOf(t) !== -1);
  const idx = x !== undefined ? s.indexOf(x) : s.length;
  const desc = s.substring(0, idx).trim().replace(/\s\s+/g, ' ');
  return [x ? x : '', desc];
};
