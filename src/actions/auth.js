import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    AUTH_SUCCESS,
    AUTH_FAIL, LOGOUT

} from "./types";
import setToken from "../utils/setToken";
import {setAlert} from "./alerts";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const auth = () => async (dispatch) => {
    if (localStorage.token) {
        setToken(localStorage.token);
    }
    try {
        const response = await axios.get(`${baseUrl}/auth/profile`);
        dispatch({
            type: AUTH_SUCCESS,
            payload: response.data,
        })
    } catch (_error) {
        dispatch({
            type: AUTH_FAIL,
        });
    }
}

export const register = ({email, password}) => async (dispatch) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/register`, {email, password});
        localStorage.setItem('token', response.data.token);
        dispatch({
            type: REGISTER_SUCCESS,
        });
        dispatch(auth());
    } catch (error) {
        const {message} = error.response.data;
        if (message) {
            dispatch(setAlert(message, 'danger'));
        }
        dispatch({
            type: REGISTER_FAIL,
        });
    }
};

export const login = ({email, password}) => async (dispatch) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/login`, {email, password});
        localStorage.setItem('token', response.data.token);
        dispatch({
            type: LOGIN_SUCCESS,
        })
        dispatch(auth());
    } catch (error) {
        const {message} = error.response.data;
        if (message) {
            dispatch(setAlert(message, 'danger'));
        }
        dispatch({
            type: LOGIN_FAIL,
        });
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({type: LOGOUT});
}
