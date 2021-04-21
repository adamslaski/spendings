import * as moment from 'moment';
const parser = new DOMParser();

export const parseCitibankXML = (text: string) => {
  const transactions = [];
  const doc = parser.parseFromString(text, 'application/xml');
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < doc.documentElement.children.length; ++i) {
    const transaction = doc.documentElement.children[i];
    if (transaction.nodeName === 'Transaction') {
      const date = transaction.getElementsByTagName('date')[0].innerHTML;
      transactions.push({
        date: moment(date, 'DD/MM/YYYY').toDate(),
        id: 0,
        amount: Number(transaction.getElementsByTagName('amount')[0].innerHTML.replace('.', '').replace(',', '.')),
        balanceAfter: Number(
          transaction.getElementsByTagName('running_balance')[0].innerHTML.replace('.', '').replace(',', '.'),
        ),
        type: transaction.getElementsByTagName('transaction_type')[0].innerHTML,
        comment: '',
        description: transaction.getElementsByTagName('description')[0].innerHTML,
        category: 0,
      });
    }
  }
  return transactions.reverse();
};
