import React, {useEffect, useState} from "react";
import {getOrganization} from "../../actions/dashboard";
import {useNavigate, useParams} from "react-router-dom";
import {connect} from "react-redux";
import MembersModal from "./MembersModal";
import CreatePollModal from "./CreatePollModal";
import ConfirmModal from "./ConfirmModal";
import {closePoll} from "../../actions/polls";
import {useTranslation} from 'react-i18next';

const Organization = ({getOrganization, closePoll, org}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {id} = useParams();
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pollId, setPollId] = useState(null);


    useEffect(() => {
        getOrganization(id)
    }, [id, getOrganization]);

    const confirmClosePoll = async () => {
        await closePoll(pollId);
        await getOrganization(org.id);
        setIsConfirmModalOpen(false);
        setPollId(null);
    };


    if (!org) {
        return <p>{t('loadingOrgs')}</p>;
    }

    return (
        <div className="organization-page">

            <h1>{org.name}</h1>
            <div className="btn-container">
                <button
                    className="btn btn-dark"
                    onClick={() => setIsCreateModalOpen(true)}
                >{t('createPoll')}
                </button>
                <button
                    className="btn btn-dark"
                    onClick={() => setIsMembersModalOpen(true)}
                >{t('members')}
                </button>
            </div>


            <ul className="polls-list">
                {org.polls.map((poll) => (
                    <li
                        key={poll.id}
                        className="poll-item"
                        onClick={() =>
                            poll.isActive
                                ? navigate(`/polls/${poll.id}/vote`)
                                : navigate(`/polls/${poll.id}/result`)
                        }
                    >
                        <div className="poll-header">
                            <h3>{poll.title}</h3>
                            <span
                                className={`poll-status ${poll.isActive ? "active" : "inactive"} ${poll.isActive ? "clickable" : ""}`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (poll.isActive) {
                                        setPollId(poll.id);
                                        setIsConfirmModalOpen(true);
                                    }
                                }}
                                style={{cursor: poll.isActive ? "pointer" : "default"}}
                            >
                            {poll.isActive ? t('active') : t('inactive')}
                          </span>
                        </div>
                        <p>{poll.description}</p>

                    </li>
                ))}
            </ul>

            <MembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
            />

            <CreatePollModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setPollId(null);
                }}
                onConfirm={confirmClosePoll}
                title={t('closePollTitle')}
                message={t('closePollMessage')}
            />
        </div>
    );
};

const mapStateToProps = (state) => ({
    org: state.dashboard.org,
})

export default connect(mapStateToProps, {getOrganization, closePoll})(Organization);
