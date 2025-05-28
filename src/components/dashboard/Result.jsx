import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {getPollResult, getPoll} from "../../actions/polls";
import {useTranslation} from "react-i18next";

const Result = ({getPollResult, getPoll}) => {
    const {id} = useParams();
    const {t} = useTranslation();
    const [poll, setPoll] = useState(null);
    const [result, setResult] = useState([]);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const pollData = await getPoll(id);
                setPoll(pollData);

                const resultData = await getPollResult(id);
                setResult(resultData);
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };

        fetchResult();
    }, [id, getPollResult, getPoll]);

    if (!poll || !result) return <p>{t('loadingResults')}</p>;

    return (
        <div className="vote-page">
            <h1>{poll.title}</h1>
            <h2>{poll.description}</h2>
            <div className="poll-options">
                {result.map((res, index) => (
                    <div key={index} className="poll-option">
                        <strong>{res.option}</strong>
                        <div style={{marginTop: "0.5rem"}}>
                            {res.votes} {t('votes') || 'votes'} ({res.percentage})
                        </div>
                        <div style={{
                            height: "10px",
                            width: "100%",
                            backgroundColor: "#ddd",
                            borderRadius: "6px",
                            overflow: "hidden",
                            marginTop: "0.4rem"
                        }}>
                            <div style={{
                                height: "100%",
                                width: res.percentage,
                                backgroundColor: "#589f8b",
                                transition: "width 0.5s ease"
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default connect(null, {getPollResult, getPoll})(Result);
