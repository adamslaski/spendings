import { Component } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Category, DataModelService } from 'src/app/services/data-model.service';
import { RulesService } from 'src/app/services/rules.service';

@Component({
  selector: 'app-rules-table',
  templateUrl: './rules-table.component.html',
  styleUrls: ['./rules-table.component.css'],
})
export class RulesTableComponent {
  readonly rules;
  readonly isOverlayOpen: boolean[] = [];
  category = 0;
  predicate = '';
  name = '';
  selected = 0;
  categories;

  constructor(private rulesService: RulesService, private route: ActivatedRoute, private dmService: DataModelService) {
    this.rules = this.dmService.rulesView.observableValues();
    this.dmService.rulesView
      .observableValues()
      .subscribe((rules) => rules.forEach((rule) => (this.isOverlayOpen[rule.id] = false)));
    this.categories = this.dmService.categoriesView.observableValues();
    this.route.paramMap.forEach((params: ParamMap) => {
      if (params.has('predicate')) {
        this.predicate = atob(params.get('predicate') || '');
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

  public delete(id: number) {
    this.rulesService.delete(id);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    this.dmService.rulesView.moveItemInArray(event.previousIndex, event.currentIndex);
  }
}
