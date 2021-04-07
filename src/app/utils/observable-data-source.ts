import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";

export class ObservableDataSource<T> extends DataSource<T> {
    constructor(private obs: Observable<T[]>) { super(); }
    connect(): Observable<T[]> {
        return this.obs;
    }
    disconnect() { }
}
