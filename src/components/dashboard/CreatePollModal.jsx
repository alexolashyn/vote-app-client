import React, {useState} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createPoll} from "../../actions/polls";
import {getOrganization} from "../../actions/dashboard";
import {useTranslation} from 'react-i18next';

const CreatePollModal = ({isOpen, onClose, org, createPoll, getOrganization}) => {
    const {t} = useTranslation();
    const [pollData, setPollData] = useState({
        title: "",
        description: "",
        options: [],
    });

    const {title, description, options} = pollData;

    const onChange = (e) => {
        setPollData({...pollData, [e.target.name]: e.target.value});
    };

    const [optionsInput, setOptionsInput] = useState("");
    const handleAddOption = () => {
        if (optionsInput.trim() && !options.includes(optionsInput.trim())) {
            setPollData({
                ...pollData,
                options: [...options, optionsInput.trim()],
            });
            setOptionsInput("");
        }
    };

    const handleRemoveOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setPollData({...pollData, options: newOptions});
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        const orgId = org.id;
        await createPoll({title, options, description}, orgId);
        await getOrganization(orgId);
        setPollData({title: "", description: "", options: []});
        setOptionsInput("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{t('createPoll')}</h2>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        value={title}
                        name="title"
                        placeholder={t('titlePlaceholder')}
                        onChange={onChange} required/>

                    <input
                        value={description}
                        name="description"
                        placeholder={t('description')}
                        onChange={onChange} required/>

                    <div className="option-list">
                        {options.map((option, index) => (
                            <div key={index} className="option-item">
                                {option}
                                <button type="button" className='btn-remove'
                                        onClick={() => handleRemoveOption(index)}>×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="option-input">
                        <input
                            type="text"
                            placeholder={t('optionPlaceholder')}
                            value={optionsInput}
                            onChange={(e) => setOptionsInput(e.target.value)}
                        />
                        <button type="button" onClick={handleAddOption} className="btn-add">+</button>
                    </div>

                    <div>
                        <button type="button" className="btn btn-dark btn-cancel" onClick={onClose}>{t('cancel')}</button>
                        <button type="submit" className="btn btn-dark">{t('create')}</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

CreatePollModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    org: state.dashboard.org
})

export default connect(mapStateToProps, {createPoll, getOrganization})(CreatePollModal);