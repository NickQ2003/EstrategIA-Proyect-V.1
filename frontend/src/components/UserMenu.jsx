import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../styles/modules/UserMenu.module.css';

const UserMenu = ({ user, onLogout, dropdownPosition = 'bottom', fullWidth = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Safe extraction of initial from email
    const initial = user?.email ? user.email[0].toUpperCase() : 'U';

    return (
        <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`} ref={menuRef}>
            <button
                className={`${styles.userBtn} ${fullWidth ? styles.btnFullWidth : ''}`}
                onClick={toggleMenu}
                title={user?.email}
            >
                <div className={styles.avatar}>
                    {initial}
                </div>
                <span>{user?.email || 'Usuario'}</span>
                {dropdownPosition === 'top' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <div className={`${styles.dropdown} ${dropdownPosition === 'top' ? styles.dropdownUp : ''} ${isOpen ? styles.active : ''}`}>
                <button className={styles.menuItem}>
                    <User size={18} />
                    Perfil
                </button>
                <button className={styles.menuItem}>
                    <Settings size={18} />
                    Configuración
                </button>
                <div className={styles.menuDivider}></div>
                <button className={`${styles.menuItem} ${styles.textDanger}`} onClick={onLogout}>
                    <LogOut size={18} />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default UserMenu;
