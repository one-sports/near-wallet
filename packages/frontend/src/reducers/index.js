import { connectRouter } from 'connected-react-router';
import { localizeReducer } from 'react-localize-redux';
import { combineReducers } from 'redux';

import allAccounts from '../reducers/allAccounts';
import recoveryMethods from '../reducers/recoveryMethods';
import tokensSlice from '../redux/slices/tokens';
import linkdropSlice from '../slices/linkdrop';
import tokenFiatValuesSlice from '../slices/tokenFiatValues';
import account from './account';
import availableAccounts from './available-accounts';
import flowLimitation from './flowLimitation';
import ledger from './ledger';
import nftSlice from './nft';
import sign from './sign';
import staking from './staking';
import status from './status';
import transactions from './transactions';

export default (history) => combineReducers({
    localize: localizeReducer,
    allAccounts,
    availableAccounts,
    account,
    transactions,
    sign,
    recoveryMethods,
    ledger,
    staking,
    status,
    flowLimitation,
    [nftSlice.name]: nftSlice.reducer,
    [tokenFiatValuesSlice.name]: tokenFiatValuesSlice.reducer,
    [linkdropSlice.name]: linkdropSlice.reducer,
    [tokensSlice.name]: tokensSlice.reducer,
    router: connectRouter(history)
});
