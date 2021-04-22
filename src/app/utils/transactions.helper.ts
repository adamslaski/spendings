import { MessageType, Transaction, Message } from '../store/entities';

export function removeDuplicates(
  newTransactions: Transaction[],
  existingTransactions: Transaction[],
): { withoutDuplicates: Transaction[]; message?: Message } {
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
  return {
    withoutDuplicates,
    message:
      numberOfDuplicates > 0
        ? { type: 'warn' as MessageType, message: `Pominięto ${numberOfDuplicates} zduplikowane transakcje.` }
        : undefined,
  };
}
