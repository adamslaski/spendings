import { BehaviorSubject, Observable } from 'rxjs';
import { Sequence } from '../services/data-model.service';
import { EntityWithId } from './entity-with-id';

export class EntityView<T extends EntityWithId> {
  private readonly subject;

  constructor(private readonly internalValues: T[], private sequence: Sequence) {
    this.subject = new BehaviorSubject<T[]>(internalValues);
  }

  observableValues(): Observable<T[]> {
    return this.subject;
  }

  values(): T[] {
    return this.internalValues.map((x) => Object.assign({}, x));
  }

  emitNext() {
    this.subject.next(this.values());
  }

  push(...values: T[]) {
    values.forEach((tr) => this.internalValues.push(Object.assign(tr, { id: this.sequence.n++ })));
    this.emitNext();
  }

  modify(v: T) {
    this.internalValues.filter((x) => x.id === v.id).forEach((x) => Object.assign(x, v));
    this.emitNext();
  }

  delete(id: number) {
    if (id === 0) {
      throw new Error(`can't delete entity with id = 0`);
    }
    const index = this.internalValues.findIndex((x) => x.id === id);
    if (index !== -1) {
      this.internalValues.splice(index, 1);
    }
    this.emitNext();
  }

  moveItemInArray(prevIndex: number, newIndex: number) {
    const tmp = this.internalValues[prevIndex];
    this.internalValues.splice(prevIndex, 1);
    this.internalValues.splice(newIndex, 0, tmp);
    this.emitNext();
  }
}
