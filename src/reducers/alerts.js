import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function alertHandler(state = initialState, action) {
    const { type, payload } = action;
    if (type === SET_ALERT) {
        return [...state, payload];
    }
    if (type === REMOVE_ALERT) {
        return state.filter((alert) => alert.id !== payload);
    }
    return state;
}