import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated }) => {
    if (isAuthenticated) {
        return <Component />;
    }
    return <Navigate to='/login' />;
};

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(PrivateRoute);