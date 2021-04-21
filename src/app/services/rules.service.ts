import { Injectable } from '@angular/core';
import { DataModelService, Rule, Transaction } from './data-model.service';
import { MessageService } from './message.service';
import { PredicateService } from './predicate.service';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  constructor(
    private dmService: DataModelService,
    private predicateService: PredicateService,
    private messageService: MessageService,
  ) {
    this.dmService.rulesView.observableValues().subscribe((rules) =>
      this.dmService.transactionsView.runInTransaction((view) =>
        this.applyWithFunction(
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

  create(ruleName: string, predicate: string, category: number) {
    const rule = { id: 0, name: ruleName, predicate, category };
    this.dmService.rulesView.push(rule);
  }

  delete(id: number) {
    try {
      this.dmService.rulesView.delete(id);
    } catch (error) {
      //this.messageService.error((error as Error).message);
    }
  }

  apply(trs: Transaction[], ...rules: Rule[]) {
    this.applyWithFunction(
      (tr, rule) => {
        tr.category = rule.category;
        tr.comment = tr.comment + ' ' + rule.name + ' applied';
      },
      trs,
      ...rules,
    );
  }

  applyWithFunction(fn: (tr: Transaction, rule: Rule) => void, trs: Transaction[], ...rules: Rule[]) {
    const compiledRules = rules.map((rule) =>
      Object.assign(rule, { compiledPredicate: this.predicateService.compile(rule.predicate) }),
    );

    trs.forEach((tr) => {
      const rule = compiledRules.find((r) => r.compiledPredicate(tr));
      if (rule) {
        fn(tr, rule);
      }
    });
  }
}
