import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link, Navigate} from 'react-router-dom';
import {login} from "../../actions/auth";
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

const Login = ({login, isAuthenticated}) => {
    const {t} = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const {email, password} = formData;

    const onChange = (el) =>
        setFormData({...formData, [el.target.name]: el.target.value});

    if (isAuthenticated) {
        return <Navigate to='/dashboard'/>;
    }

    const onSubmit = async (el) => {
        el.preventDefault();
        await login(formData)
    };
    return (
        <section className='container'>

            <form className='form' onSubmit={(el) => onSubmit(el)}>
                <h1 className='large text-primary'>{t('login')}</h1>
                <p className='lead'>
                    <i></i> {t('loginMessage')}
                </p>
                <div className='form-group'>
                    <input
                        type='email'
                        placeholder={t('emailPlaceholder')}
                        name='email'
                        value={email}
                        onChange={(el) => onChange(el)}
                        required
                        className='form-input'
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder={t('passwordPlaceholder')}
                        name='password'
                        value={password}
                        onChange={(el) => onChange(el)}
                        required
                        className='form-input'
                    />
                </div>
                <input
                    type='submit'
                    className='btn btn-primary'
                    value={t('login')}
                />
                <p className='my-1'>
                    {t('registerSuggestion')} <Link to='/register'>{t('register')}</Link>
                </p>
            </form>
        </section>

    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login);

