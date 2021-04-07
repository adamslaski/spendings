import { BehaviorSubject, Observable } from "rxjs";
import { EntityWithId } from "./entity-with-id";

export class EntityView<T extends EntityWithId> {
    private readonly subject;

    constructor(private readonly _values: T[], private sequence: number) {
        this.subject = new BehaviorSubject<T[]>(_values);
    }

    observableValues(): Observable<T[]> {
        return this.subject;
    }

    values(): T[] {
        return this._values.map(x => Object.assign({}, x));
    }

    protected emitNext() {
        this.subject.next(this.values());
    }

    push(...values: T[]) {
        values.forEach(tr =>
            this._values.push(Object.assign(tr, { id: this.sequence++ })));
        this.emitNext()
    }

    modify(v: T) {
        this._values
            .filter(x => x.id === v.id)
            .forEach(x => Object.assign(x, v));
        this.emitNext()
    }

    delete(id: number) {
        if (id === 0) {
            throw new Error("can't delete entity with id = 0");
        }
        let index = this._values.findIndex(x => x.id === id);
        if (index != -1) {
            this._values.splice(index, 1);
        }
        this.emitNext()
    }

    moveItemInArray(prevIndex: number, newIndex: number) {
        const tmp = this._values[prevIndex];
        this._values.splice(prevIndex, 1);
        this._values.splice(newIndex, 0, tmp);
        this.emitNext();
    }
}
