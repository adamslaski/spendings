import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Rule } from 'src/app/services/data-model.service';
import { RulesService } from 'src/app/services/rules.service';

@Component({
  selector: 'app-rules-table',
  templateUrl: './rules-table.component.html'
})
export class RulesTableComponent {
  readonly rules: Rule[];
  category: number = 0;
  predicate: string = '';
  name: string = '';

  constructor(private rulesService: RulesService, private route: ActivatedRoute) {
    this.rules = rulesService.rules;
    this.route.paramMap.forEach((params: ParamMap) => {
      if (params.has('predicate')) {
        this.predicate = params.get('predicate') || '';
      }
    });
  }

  public create() {
    if (this.name !== '' && this.predicate !== '') {
      this.rulesService.create(this.name, this.predicate, this.category);
      this.category = 0;
      this.predicate = '';
      this.name = '';
    }
  }

  public delete(name: string) {
    this.rulesService.delete(name);
  }

}
