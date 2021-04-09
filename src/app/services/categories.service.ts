import { Injectable } from '@angular/core';
import { DataModelService } from './data-model.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private dmService: DataModelService) {}

  public findCategoryById(id: number) {
    return this.dmService.categoriesView.values().find((t) => t.id === id);
  }

  public findCategoryByLabel(label: string) {
    return this.dmService.categoriesView.values().find((t) => t.label === label);
  }

  public create(label: string) {
    this.dmService.categoriesView.push({ id: 0, label });
  }

  public setLabel(id: number, label: string) {
    const cat = this.findCategoryById(id);
    if (cat) {
      cat.label = label;
      this.dmService.categoriesView.modify(cat);
    }
  }

  public delete(id: number) {
    this.dmService.categoriesView.delete(id);
    this.dmService.transactionsView.runInTransaction((view) =>
      view
        .values()
        .filter((tr) => tr.category === id)
        .forEach((tr) => {
          tr.category = 0;
          view.modify(tr);
        }),
    );
    this.dmService.rulesView.runInTransaction((view) =>
      view
        .values()
        .filter((rule) => rule.category === id)
        .forEach((rule) => view.delete(rule.id)),
    );
  }
}
