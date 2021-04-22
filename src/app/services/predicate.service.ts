import { Injectable } from '@angular/core';
import { Transaction } from '../store/entities';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class PredicateService {
  constructor(private messageService: MessageService) {}

  compile(exp: string): (a: Transaction) => boolean {
    return (a: Transaction) => {
      try {
        // eslint-disable-next-line no-eval
        const f = eval('(function(tr) { return ' + exp + ';})');
        return f(a);
      } catch (error) {
        // this.messageService.error(`Error while processing ${a} with predicate ${exp}`);
      }
    };
  }
}
