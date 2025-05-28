import {
    WALLET_STATUS_SUCCESS,
    WALLET_ADDRESS_SUCCESS,
    CONTRACT_SUCCESS
} from '../actions/types';

const initialState = {
    address: null,
    contract: null,
    isRegistered: false,
};

export default function walletReducer(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case WALLET_ADDRESS_SUCCESS:
            return {
                ...state,
                address: payload,
            };
        case CONTRACT_SUCCESS:
            return {
                ...state,
                contract: payload,
            };
        case WALLET_STATUS_SUCCESS:
            return {
                ...state,
                isRegistered: payload,
            };
        default:
            return state;
    }
}