import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import styles from '../styles/modules/ThemeToggle.module.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className={styles.toggleButton}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className={`${styles.iconWrapper} ${isDark ? styles.dark : styles.light}`}>
                <Sun className={`${styles.icon} ${styles.sunIcon}`} size={18} />
                <Moon className={`${styles.icon} ${styles.moonIcon}`} size={18} />
            </div>
        </button>
    );
};

export default ThemeToggle;
