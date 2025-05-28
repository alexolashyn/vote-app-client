import React from 'react';
import {useTranslation} from 'react-i18next';
import GradientBox from "./GradientBox";

const Landing = () => {
    const {t} = useTranslation();
    return (
        <section className='landing'>
            <div className='landing-inner'>
                <h1 className='x-large'>{t('appDescription')}</h1>
                <p className='lead'>
                    {t('appCatchphrase')}
                </p>
                <div className="box-container">
                    <GradientBox text={t('landingSecure')} colorClass="red"/>
                    <GradientBox text={t('landingTransparent')}  colorClass="blue"/>
                    <GradientBox text={t('landingDecentralized')}   colorClass="green"/>
                </div>
            </div>
        </section>
    );
};

export default Landing;