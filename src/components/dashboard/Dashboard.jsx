import React, {useEffect, useState, useCallback} from 'react';
import {getOrganizations, sendRequest} from '../../actions/dashboard';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import CreateOrgModal from './CreateOrgModal';
import {ethers} from 'ethers';
import VotingContractABI from '../../abi/Voting.json';
import {useTranslation} from 'react-i18next';
import {setAlert} from "../../actions/alerts";
import {
    setWalletAddress,
    setContractInstance,
    setWalletRegistered
} from '../../actions/wallet';
import TransactionModal from './TransactionModal';

const VOTING_CONTRACT_ADDRESS = import.meta.env.VITE_VOTING_CONTRACT_ADDRESS;

const Dashboard = ({
                       getOrganizations,
                       sendRequest,
                       dashboard: {orgs, loading},
                       auth: {user},
                       wallet: {address, contract, isRegistered},
                       setWalletAddress,
                       setContractInstance,
                       setWalletRegistered,
                       setAlert
                   }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [key, setKey] = useState('');
    const [hasMetaMask, setHasMetaMask] = useState(true);
    const [processing, setProcessing] = useState(false);

    const checkRegistration = useCallback(async (contractInstance, walletAddress) => {
        if (!contractInstance || !walletAddress || !user?.email) return;

        try {
            const registeredAddress = await contractInstance.getAddressByEmail(user.email);
            if (registeredAddress.toLowerCase() === walletAddress.toLowerCase()) {
                setWalletRegistered(true);
                getOrganizations();
            }
        } catch (error) {
            console.log('Error checking registration:', error);
        }
    }, [setWalletRegistered, getOrganizations, user?.email]);


    const setupWallet = useCallback(async (requestAccounts = false) => {
        try {
            const accounts = await window.ethereum.request({
                method: requestAccounts ? 'eth_requestAccounts' : 'eth_accounts',
            });

            if (accounts.length === 0) return;

            const [currentAddress] = accounts;
            setWalletAddress(currentAddress);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const instance = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VotingContractABI.abi, signer);

            setContractInstance(instance)
            await checkRegistration(instance, currentAddress);
        } catch (error) {
            if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
                setAlert(t('metamask-cancel'), 'danger');
            }
            console.log('Setup wallet failed:', error);
        }
    }, [setWalletAddress, setContractInstance, checkRegistration, setAlert, t]);

    useEffect(() => {
        const init = async () => {
            if (!window.ethereum) {
                setHasMetaMask(false);
                return;
            }

            await setupWallet(false);
        }

        init();
    }, [setupWallet]);

    const connectWallet = async () => {
        await setupWallet(true);
    };

    const handleRegister = async () => {
        if (!contract || !user?.email) return;

        try {
            setProcessing(true);
            const tx = await contract.register(user.email);
            await tx.wait();
            await checkRegistration(contract, address);
            setProcessing(false);
            setAlert(t('metamask-registration-success'), 'success');
        } catch (error) {
            if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
                setAlert(t('metamask-cancel'), 'danger');
            }

            if (error.code === 'CALL_EXCEPTION') {
                setAlert(t('metamask-error'), 'danger');
            }

            console.log('Registration failed:', error);
        }
    };

    const sendRequestHandler = async () => {
        if (!key.trim()) {
            setAlert(t('emptyKey'), 'danger');
            return;
        }
        sendRequest(key)
            .then(() => setKey(''))
            .catch((error) => console.log('Error sending request:', error));
    };

    if (!hasMetaMask) {
        return (
            <div className="meta-warning">
                <h2>{t('welcomeMessage')}</h2>
                <p>
                    {t('metaWarningMessage1')}{' '}
                    <a href="https://metamask.io/download/" target="_blank" rel="noreferrer">
                        {t('metaWarningMessage2')}
                    </a>{' '}
                    {t('metaWarningMessage3')}
                </p>
            </div>
        );
    }

    if (!address) {
        return (
            <div className="wallet-connect">
                <h2>{t('welcomeMessage')}</h2>
                <p>
                    {t('walletConnectMessage1')}
                </p>
                <button className="btn btn-dark" onClick={connectWallet}>
                    {t('walletConnectMessage2')}
                </button>
            </div>
        );
    }

    if (!isRegistered) {
        return (
            <div className="registration-warning">
                <h2>{t('accountRegistrationMessage1')}</h2>
                <p>
                    {t('accountRegistrationMessage2')}{' '}
                    <a
                        href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Sepolia Faucet
                    </a>{' '}
                    {t('accountRegistrationMessage3')}
                </p>
                <p>{t('accountRegistrationMessage4')}</p>
                <button className="btn btn-dark" onClick={handleRegister}>
                    {t('accountRegistration')}
                </button>
            </div>
        );
    }

    if (loading) {
        return <p>{t('loadingOrgs')}</p>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>{t('dashboard')}</h1>
                <div>
                    <button className="btn btn-dark" onClick={() => setIsCreateModalOpen(true)}>
                        {t('create')}
                    </button>
                    <div>
                        <input
                            type="text"
                            placeholder={t('keyPlaceholder')}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                        />
                        <button className="btn btn-dark" onClick={sendRequestHandler}>
                            {t('sendRequest')}
                        </button>
                    </div>
                </div>
            </div>

            {orgs.length > 0 ? (
                <div className="orgs-list">
                    {orgs.map((org) => (
                        <div
                            key={org.id}
                            className="org-card"
                            onClick={() => navigate(`/organizations/${org.id}`)}
                        >
                            <h2 className="org-name">{org.name}</h2>
                        </div>
                    ))}
                </div>
            ) : (
                <p>{t('noneOrgs')}</p>
            )}

            <CreateOrgModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <TransactionModal visible={processing} message={t('tx-confirmation')} />
        </div>
    );
};

Dashboard.propTypes = {
    getOrganizations: PropTypes.func.isRequired,
    sendRequest: PropTypes.func.isRequired,
    dashboard: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    wallet: PropTypes.object.isRequired,
    setWalletAddress: PropTypes.func.isRequired,
    setContractInstance: PropTypes.func.isRequired,
    setWalletRegistered: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    dashboard: state.dashboard,
    auth: state.auth,
    wallet: state.wallet,
});

export default connect(mapStateToProps, {
    getOrganizations,
    sendRequest,
    setWalletAddress,
    setContractInstance,
    setWalletRegistered,
    setAlert
})(Dashboard);
