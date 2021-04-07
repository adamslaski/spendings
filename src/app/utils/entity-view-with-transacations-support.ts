import { EntityView } from "./entity-view";
import { EntityWithId } from "./entity-with-id";

export class EntityViewWithTransactionsSupport<T extends EntityWithId> extends EntityView<T> {
    constructor(private readonly __values: T[], private _sequence: number) {
        super(__values, _sequence);
    }

    runInTransaction(fn: (view: EntityView<T>) => void): void {
        const trSequence = this._sequence;
        const trValues = this.values();
        fn(new EntityView<T>(trValues, trSequence));
        this._sequence = trSequence;
        this.__values.splice(0, this.__values.length, ...trValues);
        this.emitNext();
    }
}