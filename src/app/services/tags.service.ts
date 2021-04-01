import { Injectable } from '@angular/core';
import { DataModelService, Tag } from './data-model.service';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  public readonly tags = this.dmService.dataModel.tags;

  constructor(private dmService: DataModelService) { }

  public findTagById(id: number) {
    return this.tags.find(t => t.id === id);
  }

  public create(label: string): number {
    let newId = 0;
    newId = this.tags.reduce((a, v) => Math.max(a, v.id + 1), 0);
    this.tags.push({ label: label, color: 'grey', id: newId });
    return newId;
  }

  public setLabel(id: number, label: string) {
    this.transformById(id, tag => tag.label = label);
  }

  public setColor(id: number, color: string) {
    this.transformById(id, tag => tag.color = color);
  }

  private transformById(id: number, f: (tag:Tag) => void) {
    const tag = this.tags.find(t => t.id === id);
    if (tag) {
      f(tag);
    }
  }

  public delete(id: number) {
    this.tags.splice(0, this.tags.length, ...this.tags.filter(t => t.id !== id));
    this.dmService.dataModel.transactions.forEach(tr => tr.tags.splice(0, tr.tags.length, ...tr.tags.filter(v => v !== id)));
    this.dmService.dataModel.rules.forEach(rule => rule.tags.splice(0, rule.tags.length, ...rule.tags.filter(v => v !== id)));
  }

}
