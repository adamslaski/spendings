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
        const date = transaction.getElementsByTagName("date")[0].innerHTML;
        this.transactions.push({
          date: moment(date, "DD/MM/YYYY").toDate(),
          id: 1,
          amount: Number(transaction.getElementsByTagName("amount")[0].innerHTML.replace('.', '').replace(',', '.')),
          balanceAfter: Number(transaction.getElementsByTagName("running_balance")[0].innerHTML.replace('.', '').replace(',', '.')),
          type: transaction.getElementsByTagName("transaction_type")[0].innerHTML,
          comment: '',
          description: transaction.getElementsByTagName("description")[0].innerHTML,
          category: 0
        });
      }
    }
    this.transactions.sort((tr1, tr2) => tr1.date.getTime() - tr2.date.getTime());
  }
}
