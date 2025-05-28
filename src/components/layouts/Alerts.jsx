import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

const Alerts = ({alerts}) => {
    const {t} = useTranslation();
    return (
        alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert) => (
            <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                {t(alert.message) || alert.message}
            </div>
        ))
    );
}
Alerts.propTypes = {
    alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    alerts: state.alert,
});

export default connect(mapStateToProps)(Alerts);