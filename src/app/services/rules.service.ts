import { Injectable } from '@angular/core';
import { compile, DataModelService, Rule, Transaction } from './data-model.service';

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  public readonly rules = this.dmService.dataModel.rules;

  constructor(private dmService: DataModelService) { }

  public create(ruleName: string, predicate: string, category: number) {
    const rule = { name: ruleName, predicate: predicate, category: category };
    this.rules.push(rule);
    this.apply(this.dmService.dataModel.transactions, rule);
  }

  public apply(trs: Transaction[], ...rules: Rule[]) {
    rules.forEach(rule => {
      let predicate = compile<Transaction>(rule.predicate);
      trs.filter(predicate).forEach(tr => {
        tr.category = rule.category;
        tr.comment = tr.comment + ' ' + rule.name + ' applied';
      });
    });
  }

  public delete(name: string) {
    this.rules.splice(0, this.rules.length, ...this.rules.filter(t => t.name !== name));
  }

}

