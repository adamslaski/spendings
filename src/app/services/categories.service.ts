import { Injectable } from '@angular/core';
import { DataModelService, Category } from './data-model.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  public readonly categories = this.dmService.dataModel.categories;

  constructor(private dmService: DataModelService) { }

  public findTagById(id: number) {
    return this.categories.find(t => t.id === id);
  }

  public create(label: string): number {
    let newId = 0;
    newId = this.categories.reduce((a, v) => Math.max(a, v.id + 1), 0);
    this.categories.push({ label: label, id: newId });
    return newId;
  }

  public setLabel(id: number, label: string) {
    this.transformById(id, tag => tag.label = label);
  }

  private transformById(id: number, f: (tag: Category) => void) {
    const tag = this.categories.find(t => t.id === id);
    if (tag) {
      f(tag);
    }
  }

  public delete(id: number) {
    if (id === 0) {
      return;
    }
    this.categories.splice(0, this.categories.length, ...this.categories.filter(t => t.id !== id));
    this.dmService.dataModel.transactions.filter(tr => tr.category == id).forEach(tr => { tr.category = 0 });
    this.dmService.dataModel.rules.splice(0, this.dmService.dataModel.rules.length,
      ...this.dmService.dataModel.rules.filter(rule => rule.category !== id));
  }

}
