import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/modules/Cards.module.css';

const Cards = ({ icon: Icon, title, description, path, color = 'blue' }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <div
            className={`${styles.card} ${styles[`card-${color}`]}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                }
            }}
        >
            <div className={styles.cardGlow}></div>
            <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>
                    {Icon && <Icon size={48} className={styles.icon} />}
                </div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.cardFooter}>
                <span className={styles.accessText}>Acceder</span>
                <svg
                    className={styles.arrow}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Cards;
