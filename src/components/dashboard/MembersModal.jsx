import {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {getMembers, getKey, handleRequest} from "../../actions/dashboard";
import {connect} from "react-redux";
import {useTranslation} from 'react-i18next';

const MembersModal = ({isOpen, onClose, getMembers, getKey, handleRequest, orgId}) => {
        const {t} = useTranslation();
        const [data, setData] = useState({members: [], requests: []});
        const {members, requests} = data;

        const [key, setKey] = useState('');
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(key).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        };

        useEffect(() => {
            if (isOpen) {
                getMembers(orgId)
                    .then((response) => setData(response))
                    .catch((error) => console.error('Error fetching members and requests:', error));
            }
        }, [isOpen, orgId, getMembers]);

        const handleRequestKey = () => {
            getKey(orgId)
                .then((response) => setKey(response.key))
                .catch((error) => console.error('Error fetching members and requests:', error));
        };

        const refreshMembersAndRequests = () => {
            getMembers(orgId)
                .then((response) => setData(response))
                .catch((error) => console.error('Error refreshing members and requests:', error));
        };

        if (!isOpen) return null;

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{t('orgsMembers')}</h2>
                    <button onClick={handleRequestKey} className='btn btn-dark'>{t('getKey')}</button>
                    {key && (
                        <div className="join-key-display"
                             style={{marginTop: '1rem'}}
                        >
                            <p>
                                {key.slice(0, 6)} . . . {key.slice(-6)}
                                <button
                                    className="btn-copy"
                                    style={{marginLeft: '1rem'}}
                                    onClick={handleCopy}
                                >
                                    {copied ? t('copied') : t('copyKey')}
                                </button>
                            </p>
                        </div>
                    )}
                    <div className="members-list">
                        <h3>{t('members')}</h3>
                        {members && members.length > 0 ? (
                            <ul>
                                {members.map((member) => (
                                    <li key={member.id}>{member.email}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{t('noneMembers')}</p>
                        )}
                    </div>

                    {requests && requests.length > 0 && (
                        <div className="requests-list">
                            <h3>{t('requests')}</h3>
                            <ul>
                                {requests.map((request) => (
                                    <li key={request.id}>
                                        {request.user.email}
                                        <div>

                                            <button className="approve-btn"
                                                    onClick={
                                                        () => handleRequest(orgId, request.id, true)
                                                            .then(() => refreshMembersAndRequests())
                                                            .catch(err => console.error('Approval failed:', err))
                                                    }>{t('approve')}
                                            </button>
                                            <button className="reject-btn"
                                                    onClick={
                                                        () => handleRequest(orgId, request.id, false)
                                                            .then(() => refreshMembersAndRequests())
                                                            .catch(err => console.error('Rejection failed:', err))
                                                    }>{t('reject')}
                                            </button>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button onClick={() => {
                        onClose();
                        setKey('')
                    }} className="btn btn-dark btn-cancel">{t('cancel')}
                    </button>
                </div>
            </div>
        );
    }
;

MembersModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    getMembers: PropTypes.func.isRequired,
    getKey: PropTypes.func.isRequired,
    handleRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    orgId: state.dashboard.org.id
})

export default connect(mapStateToProps, {getMembers, getKey, handleRequest})(MembersModal);
