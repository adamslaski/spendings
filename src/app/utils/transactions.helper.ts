import { MessageType, Transaction, Message } from '../store/entities';
import { MESSAGE_SUBJECT } from '../services/message.service';

export function removeDuplicates(newTransactions: Transaction[], existingTransactions: Transaction[]): Transaction[] {
  const eq = (tr1: Transaction, tr2: Transaction) =>
    tr1.amount === tr2.amount &&
    tr1.balanceAfter === tr2.balanceAfter &&
    tr1.date.getTime() === tr2.date.getTime() &&
    tr1.description === tr2.description &&
    tr1.type === tr2.type;

  const withoutDuplicates = newTransactions.filter((ntr) => {
    const result = existingTransactions.find((tr) => eq(ntr, tr));
    return result === undefined;
  });
  const numberOfDuplicates = newTransactions.length - withoutDuplicates.length;
  if (numberOfDuplicates > 0) {
    MESSAGE_SUBJECT.next({
      type: 'warn' as MessageType,
      message: `Pominięto ${numberOfDuplicates} zduplikowane transakcje.`,
    });
  }
  return withoutDuplicates;
}
