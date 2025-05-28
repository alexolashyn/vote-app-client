import React, {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {register} from "../../actions/auth";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

const Register = ({isAuthenticated, register}) => {
    const {t} = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password2: '',
    });

    const {email, password, passwordConfirmation} = formData;

    const onChange = (el) =>
        setFormData({...formData, [el.target.name]: el.target.value});

    if(isAuthenticated) {
        return <Navigate to='/dashboard'/>;
    }

    const onSubmit = async (el) => {
        el.preventDefault();
        await register(formData);
    };
    return (
        <section className='container'>

            <form className='form' onSubmit={(el) => onSubmit(el)}>
                <h1 className='large text-primary'>{t('register')}</h1>
                <p className='lead'>
                    <i></i> {t('registerMessage')}
                </p>
                <div className='form-group'>
                    <input
                        type='email'
                        placeholder={t('emailPlaceholder')}
                        name='email'
                        value={email}
                        onChange={(el) => onChange(el)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder={t('passwordPlaceholder')}
                        name='password'
                        minLength='8'
                        value={password}
                        onChange={(el) => onChange(el)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder={t('passwordConfirmationPlaceholder')}
                        name='password2'
                        minLength='8'
                        value={passwordConfirmation}
                        onChange={(el) => onChange(el)}
                        required
                    />
                </div>
                <input type='submit' className='btn btn-primary' value={t('register')}/>
                <p className='my-1'>
                    {t('loginSuggestion')} <Link to='/login'>{t('login')}</Link>
                </p>
            </form>

        </section>
    );
};

Register.propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { register })(Register);