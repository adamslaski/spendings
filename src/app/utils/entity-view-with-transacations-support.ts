import { Subject } from 'rxjs';
import { Sequence } from '../services/data-model.service';
import { EntityView } from './entity-view';
import { EntityViewThatNeverEmitsAnything } from './entity-view-that-never-emits-anything';
import { EntityWithId } from './entity-with-id';

export class EntityViewWithTransactionsSupport<T extends EntityWithId> extends EntityView<T> {
  constructor(private readonly valuesRef: T[], private sequenceRef: Sequence, name: string, subject?: Subject<T[]>) {
    super(valuesRef, sequenceRef, name, subject);
  }

  runInTransaction(fn: (view: EntityView<T>) => void): void {
    const trSequence = { n: this.sequenceRef.n };
    const trValues = this.values();
    fn(new EntityViewThatNeverEmitsAnything<T>(trValues, trSequence, 'transaction for ' + this.name));
    this.sequenceRef = trSequence;
    this.valuesRef.splice(0, this.valuesRef.length, ...trValues);
    this.emitNext();
  }
}
