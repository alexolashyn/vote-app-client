import {useState} from "react";
import {connect} from "react-redux";
import {createOrganization} from "../../actions/dashboard";
import PropTypes from "prop-types";
import MembersModal from "./MembersModal";
import {useTranslation} from 'react-i18next';

const CreateOrgModal = ({isOpen, onClose, createOrganization}) => {
    const {t} = useTranslation();
    const [orgData, setOrgData] = useState({
        name: "",
        members: [],
    });
    const {name, members} = orgData;

    const onChange = (e) => {
        setOrgData({...orgData, [e.target.name]: e.target.value});
    };

    const [emailInput, setEmailInput] = useState("");
    const handleAddEmail = () => {
        if (emailInput.trim() && !members.includes(emailInput.trim())) {
            setOrgData({
                ...orgData,
                members: [...members, emailInput.trim()],
            });
            setEmailInput("");
        }
    };

    const handleRemoveEmail = (index) => {
        const newEmails = members.filter((_, i) => i !== index);
        setOrgData({...orgData, members: newEmails});
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        await createOrganization({name, members});
        setOrgData({name: "", members: []});
        setEmailInput("");
        onClose();

    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{t('createOrg')}</h2>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder={t('orgNamePlaceholder')}
                        value={name}
                        onChange={onChange}
                        required
                    />
                    <div className="email-list">
                        {members.map((email, index) => (
                            <div key={index} className="email-item">
                                {email}
                                <button type="button" className='btn-remove'
                                        onClick={() => handleRemoveEmail(index)}>×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="email-input">
                        <input
                            type="email"
                            placeholder={t('orgEmailPlaceholder')}
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                        <button type="button" onClick={handleAddEmail} className="btn-add">+</button>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-dark btn-cancel">{t('cancel')}</button>
                        <button type="submit" className="btn btn-dark">{t('create')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CreateOrgModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    createOrganization: PropTypes.func.isRequired,
};

export default connect(null, {createOrganization})(CreateOrgModal);
