import {combineReducers} from 'redux';
import alert from './alerts.js';
import auth from './auth.js';
import dashboard from './dashboard.js';
import wallet from './wallet.js';

export default combineReducers({
    alert,
    auth,
    dashboard,
    wallet
});