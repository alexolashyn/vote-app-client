import {
    WALLET_STATUS_SUCCESS,
    WALLET_ADDRESS_SUCCESS,
    CONTRACT_SUCCESS
} from './types';

export const setWalletAddress = (address) => ({
    type: WALLET_ADDRESS_SUCCESS,
    payload: address,
});

export const setContractInstance = (contract) => ({
    type: CONTRACT_SUCCESS,
    payload: contract,
});

export const setWalletRegistered = (isRegistered) => ({
    type: WALLET_STATUS_SUCCESS,
    payload: isRegistered,
});