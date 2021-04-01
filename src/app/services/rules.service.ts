import { Injectable } from '@angular/core';
import { compileAndFilter, DataModelService, Rule, Transaction } from './data-model.service';

@Injectable({
  providedIn: 'root'
})
export class RulesService  {
  public readonly rules = this.dmService.dataModel.rules;

  constructor(private dmService: DataModelService) { }

  public create(name: string, predicate: string, tags: number[]) {
    const rule = { name: name, predicate: predicate, tags: tags };
    this.rules.push(rule);
    this.apply(this.dmService.dataModel.transactions, rule);
  }

  public apply(trs: Transaction[], ...rules: Rule[]) {
    rules.forEach(rule =>
      compileAndFilter<Transaction>(rule.predicate)(trs)
    .forEach(tr => {
      tr.tags.push(...rule.tags);
      tr.comment = tr.comment + ' ' + name + ' applied';
    }));
  }

  public delete(name: string) {
    this.rules.splice(0, this.rules.length, ...this.rules.filter(t => t.name !== name));
  }

}

