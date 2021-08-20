
import * as Sentry from '@sentry/browser';

import sendJson from '../tmp_fetch_send_json';
import { ACCOUNT_HELPER_URL } from './wallet';
import { wallet } from './wallet';

export const getLikelyTokenContracts = ({ accountId }) => (
    sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyTokens`).catch(logError)
);

export const getMetadata = ({ contractName, accountId }) => {
    const account = wallet.getAccountBasic(accountId);
    
    // FungibleTokenMetadata interface
    // https://github.com/near/NEPs/blob/master/specs/Standards/FungibleToken/Metadata.md
    return account.viewFunction(contractName, 'ft_metadata').catch(logError);
};

export const getBalanceOf = ({ contractName, accountId }) => {
    const account = wallet.getAccountBasic(accountId);
    return account.viewFunction(contractName, 'ft_balance_of', { account_id: accountId }).catch(logError);
};

const logError = (error) => {
    console.warn(error);
    Sentry.captureException(error);
};
