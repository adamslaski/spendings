import { Injectable } from '@angular/core';
import { DataModelService, Transaction } from './data-model.service';
import * as moment from 'moment';
import { MessageService } from './message.service';
import { RulesService } from './rules.service';
@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private parser = new DOMParser();

  constructor(
    private dmService: DataModelService,
    private rulesService: RulesService,
    private messageService: MessageService,
  ) {}

  parseCitibankXML(text: string) {
    const transactions = [];
    try {
      const doc = this.parser.parseFromString(text, 'application/xml');
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < doc.documentElement.children.length; ++i) {
        const transaction = doc.documentElement.children[i];
        if (transaction.nodeName === 'Transaction') {
          const date = transaction.getElementsByTagName('date')[0].innerHTML;
          transactions.push({
            date: moment(date, 'DD/MM/YYYY').toDate(),
            id: 1,
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
    } catch (e) {
      // this.messageService.error((e as Error).message);
    }
    return transactions;
  }

  importTransactions(transactions: Transaction[]) {
    transactions = this.removeDuplicates(transactions, this.dmService.transactionsView.values());
    this.rulesService.apply(transactions, ...this.dmService.rulesView.values());
    transactions.sort((tr1, tr2) => tr1.date.getTime() - tr2.date.getTime());
    this.dmService.transactionsView.push(...transactions);
  }

  removeDuplicates(newTransactions: Transaction[], existingTransactions: Transaction[]) {
    const eq = (tr1: Transaction, tr2: Transaction) =>
      tr1.amount === tr2.amount &&
      tr1.balanceAfter === tr2.balanceAfter &&
      tr1.date.getTime() === tr2.date.getTime() &&
      tr1.description === tr2.description &&
      tr1.type === tr2.type;

    const withoutDuplicates = newTransactions.filter((ntr) => {
      const result = existingTransactions.find((tr) => eq(ntr, tr));
      return result === undefined;
    });
    const numberOfDuplicates = newTransactions.length - withoutDuplicates.length;
    if (numberOfDuplicates > 0) {
      // this.messageService.warn(`Pominięto ${numberOfDuplicates} zduplikowane transakcje.`);
    }
    return withoutDuplicates;
  }
}
