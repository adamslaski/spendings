import { Injectable } from '@angular/core';
import { DataModelService } from './data-model.service';
import * as moment from 'moment';
import { MessageService } from './message.service';
import { RulesService } from './rules.service';
@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private parser = new DOMParser();

  constructor(private dmService: DataModelService, private rulesService: RulesService) {}

  readXML(text: string) {
    const doc = this.parser.parseFromString(text, 'application/xml');
    const transactions = [];
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
    this.rulesService.apply(transactions, ...this.dmService.rulesView.values());
    transactions.sort((tr1, tr2) => tr1.date.getTime() - tr2.date.getTime());
    this.dmService.transactionsView.push(...transactions);
  }
}
