import { Bank } from 'src/app/store/entities';

export const environment: {
  production: boolean;
  exampleData: {
    rules: { name: string; category: string }[];
    categories: string[];
    accounts: { name: string; bank: Bank }[];
  };
  exampleStatement: string;
} = {
  production: true,
  exampleData: {
    rules: [],
    categories: [],
    accounts: [],
  },
  exampleStatement: `<?xml version="1.0" encoding="UTF-8"?>
  <Transactions></Transactions>`,
};
