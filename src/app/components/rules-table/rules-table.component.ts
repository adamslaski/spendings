import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Rule } from 'src/app/services/data-model.service';
import { RulesService } from 'src/app/services/rules.service';

@Component({
  selector: 'app-rules-table',
  templateUrl: './rules-table.component.html'
})
export class RulesTableComponent {
  readonly rules: Rule[];
  tags: number[] = [];
  predicate: string = '';

  constructor(private rulesService: RulesService, private route: ActivatedRoute) {
    this.rules = rulesService.rules;
    this.route.paramMap.forEach((params: ParamMap) => {
      if (params.has('predicate')) {
        this.predicate = params.get('predicate') || '';
      }
    });
  }

  public create(name: string, predicate: string, tags: number[]) {
    this.rulesService.create(name, predicate, tags);
  }

  public delete(name: string) {
    this.rulesService.delete(name);
  }

}
