import './i18n';
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Provider} from 'react-redux';

import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing.jsx";
import Alerts from './components/layouts/Alerts';
import Dashboard from "./components/dashboard/Dashboard";
import Organization from "./components/dashboard/Organization";
import Vote from "./components/dashboard/Vote";
import Result from "./components/dashboard/Result";
import PrivateRoute from "./components/routing/PrivateRoute";
import store from './store';
import {auth} from './actions/auth';
import setToken from "./utils/setToken";

if (localStorage.token) {
    setToken(localStorage.token);
}

const App = () => {
    useEffect(() => {

        store.dispatch(auth());
    }, []);
    return (
        <Provider store={store}>
            <Router>
                <Navbar/>
                <Alerts/>
                <Routes>
                    <Route path='/' element={<Landing/>}/>
                    <Route path='register' element={<Register/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route
                        path='dashboard'
                        element={<PrivateRoute component={Dashboard}/>}
                    />
                    <Route
                        path='organizations/:id'
                        element={<PrivateRoute component={Organization}/>}
                    />
                    <Route
                        path='polls/:id/vote'
                        element={<PrivateRoute component={Vote}/>}
                    />
                    <Route
                        path='polls/:id/result'
                        element={<PrivateRoute component={Result}/>}
                    />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;