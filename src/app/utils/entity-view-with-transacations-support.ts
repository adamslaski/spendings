import { EntityView } from './entity-view';
import { EntityWithId } from './entity-with-id';

export class EntityViewWithTransactionsSupport<T extends EntityWithId> extends EntityView<T> {
    constructor(private readonly valuesRef: T[], private sequenceRef: number) {
        super(valuesRef, sequenceRef);
    }

    runInTransaction(fn: (view: EntityView<T>) => void): void {
        const trSequence = this.sequenceRef;
        const trValues = this.values();
        fn(new EntityView<T>(trValues, trSequence));
        this.sequenceRef = trSequence;
        this.valuesRef.splice(0, this.valuesRef.length, ...trValues);
        this.emitNext();
    }
}
