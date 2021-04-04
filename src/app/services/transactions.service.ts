import { Injectable } from '@angular/core';
import { DataModelService } from './data-model.service';
import { RulesService } from './rules.service';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  public readonly transactions = this.dmService.dataModel.transactions;
  private parser = new DOMParser();

  constructor(private dmService: DataModelService, private rulesService: RulesService) { }

  readXML(text: string) {
    const doc = this.parser.parseFromString(text, "application/xml");
    for (let i = 0; i < doc.documentElement.children.length; ++i) {
      const transaction = doc.documentElement.children[i];
      if (transaction.nodeName === "Transaction") {
        console.log(transaction);
        const date = transaction.getElementsByTagName("date")[0].innerHTML;
        this.transactions.push({
          date: moment(date, "DD/MM/YYYY").toDate(), 
          id: 1,
          tags: [],
          amount: Number(transaction.getElementsByTagName("amount")[0].innerHTML.replace('.', '').replace(',','.')),
          balanceAfter: Number(transaction.getElementsByTagName("running_balance")[0].innerHTML.replace('.', '').replace(',','.')),
          type: transaction.getElementsByTagName("transaction_type")[0].innerHTML,
          comment: '',
          description: transaction.getElementsByTagName("description")[0].innerHTML,
     });
      }
    }
  }


  readWorkbook(path: any) {
    // const workbook = XLSX.read(fs.readFileSync(path[0]), { type: 'buffer' });
    // const first_sheet_name = workbook.SheetNames[0];
    // const ids = this.getIds();
    // const newTrs = this.readSheet(workbook.Sheets[first_sheet_name]).filter(tr => !ids.contains(tr.id));
    // this.rulesService.apply(newTrs, ...this.rulesService.rules);
    // this.transactions.push(...newTrs);
  }

  // private getIds(): Collections.Set<number> {
  //   const acc = new Collections.Set<number>();
  //   this.transactions.forEach(tr => acc.add(tr.id));
  //   return acc;
  // }

  // private readSheet(sheet): Transaction[] {
  //   const data: Transaction[] = [];
  //   const range = XLSX.utils.decode_range(sheet['!ref']);
  //   for (let rowNum = 2; rowNum <= range.e.r; rowNum++) {
  //     const get = function (c: string): string {
  //       const x = sheet[c + rowNum];
  //       return x === undefined ? '' : x.v;
  //     }

  //     const getRange = function (r: string[]): string[] {
  //       const result = [];
  //       r.forEach(element => {
  //         const s = get(element);
  //         if (s !== '') {
  //           result.push(s);
  //         }
  //       });
  //       return result;
  //     }

  //     const getJsDateFromExcel = (excelDate: number) => {

  //       // JavaScript dates can be constructed by passing milliseconds
  //       // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

  //       // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")
  //       // 2. Convert to milliseconds.
  //       const offset = new Date().getTimezoneOffset() * 60;
  //       const timeInSeconds = (excelDate - (25567 + 2)) * 86400;
  //       return new Date((timeInSeconds + offset) * 1000);
  //     }

  //     data.push({
  //       id: Number(get('A')),
  //       date: getJsDateFromExcel(Number(get('B'))),
  //       type: get('D'),
  //       amount: Number(get('E')),
  //       balanceAfter: Number(get('G')),
  //       currency: get('F'),
  //       accountNumber: get('H'),
  //       name: get('I'),
  //       description: getRange(['J', 'K', 'L', 'M', 'N', 'O', 'P']),
  //       comment: '',
  //       tags: []
  //     });
  //   }
  //   return data;
  // };

}
