import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check for saved theme preference or default to system preference
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // Update document root and localStorage when theme changes
    useEffect(() => {
        const root = document.documentElement;

        // Remove both classes first
        root.classList.remove('light-theme', 'dark-theme');

        // Add the current theme class
        root.classList.add(`${theme}-theme`);

        // Save to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
