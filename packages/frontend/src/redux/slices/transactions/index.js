import { createSelector } from 'reselect';

import createParameterSelector from '../../createParameterSelector';

const SLICE_NAME = 'transactions';

const getAccountIdParam = createParameterSelector((params) => params.accountId);

const getHashParam = createParameterSelector((params) => params.hash);

// Top level selectors
const selectTransactionsSlice = (state) => state[SLICE_NAME] || {};

export const selectTransactionsByAccountId = createSelector(
    [selectTransactionsSlice, getAccountIdParam],
    (transactions, accountId) => transactions[accountId] || []
);

export const selectOneTransactionByHash = createSelector(
    [selectTransactionsByAccountId, getHashParam],
    (transactionsByAccountId, hash) => transactionsByAccountId.find((transaction) => `${transaction.hash}-${transaction.kind}` === hash)
);
