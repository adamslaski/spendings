import { EMPTY, Observable } from 'rxjs';
import { Sequence } from '../services/data-model.service';
import { EntityView } from './entity-view';
import { EntityWithId } from './entity-with-id';

export class EntityViewThatNeverEmitsAnything<T extends EntityWithId> extends EntityView<T> {
  constructor(internalValues: T[], sequence: Sequence, name: string) {
    super(internalValues, sequence, name);
  }

  observableValues(): Observable<T[]> {
    return EMPTY;
  }
}
