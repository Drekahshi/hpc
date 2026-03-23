// This is a mock database to simulate storing and retrieving data.
// In a real application, you would use a proper database like Firestore.

interface MockDatabase {
  balances: { [key: string]: number };
}

const db: MockDatabase = {
  balances: {},
};

export const getBalance = (accountId: string): number => {
  // If a balance exists for the account, return it. Otherwise, default to 500.
  return db.balances[accountId] ?? 500;
};

export const incrementBalance = (accountId: string): number => {
  // If the account has no balance, initialize it from the default. Otherwise, use the existing balance.
  db.balances[accountId] = getBalance(accountId);
  db.balances[accountId] += 1;
  return db.balances[accountId];
};

export const setBalance = (accountId: string, amount: number): number => {
    db.balances[accountId] = amount;
    return db.balances[accountId];
}
