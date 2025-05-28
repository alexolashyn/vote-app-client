import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getPoll, vote} from "../../actions/polls";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {useTranslation} from 'react-i18next';
import {setAlert} from "../../actions/alerts";
import TransactionModal from "./TransactionModal";

const Vote = ({
                  getPoll,
                  vote,
                  auth: {user},
                  wallet: {address, contract},
                  setAlert
              }) => {
    const {t} = useTranslation();
    const {id} = useParams();
    const [poll, setPoll] = useState(null);
    const [option, setOption] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getPoll(id)
            .then(response => setPoll(response))
            .catch(error => console.log("Error fetching poll:", error));

    }, [id, getPoll]);

    const onClick = async () => {
        if (!option || !contract || !user?.email) {
            console.log("Missing data: option, wallet, or user email.");
            return;
        }

        try {
            setProcessing(true);
            const tx = await contract.vote(user.email, id, option);
            await tx.wait();

            await vote(id, option);
            setProcessing(false);
            setAlert('voteSuccess', 'success');
            setOption('')
        } catch (error) {
            console.log("Voting error:", error.message);
            setAlert('voteFail', 'danger');
            setOption('')
        }
    };


    if (!poll) {
        return <p>{t('loadingPoll')}</p>;
    }

    return (
        <div className="vote-page">
            <h1>{poll.title}</h1>
            <h2>{poll.description}</h2>
            <div className="poll-options">
                {poll.options.map((opt, index) => (
                    <label
                        key={index}
                        className={`poll-option ${option === opt ? 'selected' : ''}`}
                    >
                        <input
                            type="radio"
                            name="poll-option"
                            value={opt}
                            onChange={(e) => setOption(e.target.value)}
                            checked={option === opt}
                        />
                        {opt}
                    </label>
                ))}
            </div>
            <button className="btn btn-dark" onClick={onClick} disabled={!option}>
                {t('submitVote')}
            </button>
            <p>
                {t('submitVoteMessage')}
            </p>
            <TransactionModal visible={processing} message={t('tx-confirmation')} />
        </div>
    );
};


Vote.propTypes = {
    getPoll: PropTypes.func.isRequired,
    vote: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    wallet: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    wallet: state.wallet,
});

export default connect(mapStateToProps, {getPoll, vote, setAlert})(Vote);
