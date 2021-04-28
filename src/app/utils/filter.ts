import { Predicate } from '../store/entities';
export interface Filter {
  clear(): void;
  makeQuery(): Predicate;
}
