import { Injectable } from '@angular/core';
import { compile } from '../utils/functions';
import { DataModelService, Rule, Transaction } from './data-model.service';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  constructor(private dmService: DataModelService) {
    this.dmService.rulesView.observableValues().subscribe((rules) =>
      this.dmService.transactionsView.runInTransaction((view) =>
        applyWithFunction(
          (tr, rule) => {
            tr.category = rule.category;
            tr.comment = tr.comment + ' ' + rule.name + ' applied';
            view.modify(tr);
          },
          view.values(),
          ...rules,
        ),
      ),
    );
  }

  public create(ruleName: string, predicate: string, category: number) {
    const rule = { id: 0, name: ruleName, predicate, category };
    this.dmService.rulesView.push(rule);
  }

  public delete(id: number) {
    this.dmService.rulesView.delete(id);
  }
}

export function apply(trs: Transaction[], ...rules: Rule[]) {
  applyWithFunction(
    (tr, rule) => {
      tr.category = rule.category;
      tr.comment = tr.comment + ' ' + rule.name + ' applied';
    },
    trs,
    ...rules,
  );
}

function applyWithFunction(fn: (tr: Transaction, rule: Rule) => void, trs: Transaction[], ...rules: Rule[]) {
  const compiledRules = rules.map((rule) =>
    Object.assign(rule, { compiledPredicate: compile<Transaction>(rule.predicate) }),
  );

  trs.forEach((tr) => {
    const rule = compiledRules.find((r) => r.compiledPredicate(tr));
    if (rule) {
      fn(tr, rule);
    }
  });
}
