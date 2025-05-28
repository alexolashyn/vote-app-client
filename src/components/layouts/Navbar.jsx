import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';
import {useTranslation} from 'react-i18next';

const Navbar = ({isAuthenticated, logout}) => {
    const {i18n, t} = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const authLinks = (
        <ul>
            <li>
                <Link to='/dashboard'>{t('dashboard')}</Link>
            </li>
            <li>
                <a onClick={logout} href='/'>
                    {t('logout')}
                </a>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li>
                <Link to='/register'>{t('register')}</Link>
            </li>
            <li>
                <Link to='/login'>{t('login')}</Link>
            </li>
        </ul>
    );

    return (
        <nav className='navbar'>

            <div>
                <h1>
                    <Link to='/'>{t('appName')}</Link>
                </h1>
                <div className='lang-container'>
                    <button onClick={() => changeLanguage('en')}>en</button>
                    <button onClick={() => changeLanguage('uk')} style={{marginLeft: '5px'}}>uk</button>
                </div>


            </div>
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {logout})(Navbar);
