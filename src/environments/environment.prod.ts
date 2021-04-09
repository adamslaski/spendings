export const environment: {
  production: boolean;
  exampleData: { rules: { name: string; category: string }[]; categories: string[] };
  exampleStatement: string;
} = {
  production: true,
  exampleData: {
    rules: [],
    categories: [],
  },
  exampleStatement: `<?xml version="1.0" encoding="UTF-8"?>
  <Transactions></Transactions>`,
};
