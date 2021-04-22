// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  exampleData: {
    rules: [
      {
        name: 'biedronka',
        category: 'jedzenie',
      },
      {
        name: 'lidl',
        category: 'jedzenie',
      },
      {
        name: 'piekarnia',
        category: 'jedzenie',
      },
      {
        name: 'BP',
        category: 'benzyna',
      },
      {
        name: 'Rossman',
        category: 'chemia i kosmetyki',
      },
      {
        name: 'przedszkole',
        category: 'przedszkole',
      },
    ],
    categories: [
      'przedszkole',
      'jedzenie',
      'restauracje',
      'benzyna',
      'naprawy samochodu',
      'czynsz',
      'kredyt',
      'chemia i kosmetyki',
    ],
  },
  /* eslint-disable */
  exampleStatement: `<?xml version="1.0" encoding="UTF-8"?>
  <Transactions>
    <Transaction>
      <date>01/04/2021</date>
      <description>sklep monopolowy</description>
      <amount>-50,09</amount>
      <account_number>0123456789</account_number>
      <account_name/>
      <running_balance>200</running_balance>
      <transaction_type>TRANSAKCJA ZAKUPU</transaction_type>
    </Transaction>
  </Transactions>`,
  /* eslint-enable */
};
