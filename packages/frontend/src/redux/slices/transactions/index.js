import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import createParameterSelector from '../../createParameterSelector';

const SLICE_NAME = 'transactions';

const initialState = {
    transactions: {
        byAccountId: {}
    },
    status: {
        
    }
};

const fetchTransactions = createAsyncThunk(
    `${SLICE_NAME}/fetchTransactions`,
    async ({ accountId }, { dispatch, getState }) => {
        const transactions = await getTransactions({ accountId });

        const { actions: { addTransactions, updateTransactions } } = transactionsSlice;

        !selectTransactionsByAccountId(getState(), { accountId }).length
            ? dispatch(addTransactions({ transactions, accountId }))
            : dispatch(updateTransactions({ transactions, accountId }));
    }
);

const fetchTransactionStatus = createAsyncThunk(
    `${SLICE_NAME}/fetchTransactionStatus`,
    async ({ hash, signer_id, accountId }, { dispatch, getState }) => {
    }
);

const transactionsSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        addTransactions(state, { payload }) {
            const { transactions, accountId } = payload;
            set(state, ['transactions', 'byAccountId', accountId], transactions);
        },
        updateTransactions(state, { payload }) {
            const { transactions, accountId } = payload;

            const transactionsState = state.transactions.byAccountId[accountId];
            const hash = transactionsState.map((t) => t.hash_with_index);

            transactions.forEach((t) => {
                if (!hash.includes(t.hash_with_index)) {
                    transactionsState.unshift(t);
                    if (transactionsState.length > 10) {
                        transactionsState.pop();
                    }
                }
            });
        },
        updateTransactionStatus(state, { payload }) {
            const { status, checkStatus, accountId, hash } = payload;

            const transactionsState = state.transactions.byAccountId[accountId];
            const index = transactionsState.findIndex((t) => t.hash === hash);
            if (index !== -1) {
                transactionsState[index].status = status;
                transactionsState[index].checkStatus = checkStatus;
            }
        }
    },
    extraReducers: ((builder) => {
        
    })
});

export default transactionsSlice;

export const actions = {
    ...transactionsSlice.actions
};

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
    (transactions, hash) => transactions.find((transaction) => `${transaction.hash}-${transaction.kind}` === hash)
);
