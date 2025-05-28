import {
    DASHBOARD_SUCCESS,
    ORG_CREATED,
    ORG_SUCCESS,
    ORG_FAIL,
    POLL_FAIL
} from '../actions/types';

const initialState = {
    orgs: [],
    org: null,
    error: null,
    loading: true,
};

export default function dashboardReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case DASHBOARD_SUCCESS:
            return {
                ...state,
                orgs: payload,
                loading: false,
            };

        case ORG_SUCCESS:
            return {
                ...state,
                org: payload,
            }

        case ORG_CREATED:
            return {
                ...state,
                orgs: [...state.orgs, payload],
            };

        case ORG_FAIL:
        case POLL_FAIL:
            return {
                ...state,
                error: payload,
                loading: false,
            };

        default:
            return state;
    }
}
