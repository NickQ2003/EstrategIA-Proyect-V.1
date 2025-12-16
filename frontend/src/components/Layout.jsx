import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import styles from '../styles/modules/Layout.module.css';
import logo from '../assets/imajilogo_estrategIA.png';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Participantes', path: '/participants' },
        { icon: UserCheck, label: 'Asistencia', path: '/attendance' },
    ];

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <img src={logo} alt="EstrategIA" style={{ height: '40px', maxWidth: '100%', objectFit: 'contain' }} />
                    <ThemeToggle />
                </div>

                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                                    }
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.logoutContainer}>
                    <button
                        onClick={handleLogout}
                        className={`${styles.btnLogout} btn`}
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside >

            {/* Main Content */}
            < main className={styles.main} >
                <div className={styles.contentWrapper}>
                    <Outlet />
                </div>
            </main >
        </div >
    );
};

export default Layout;
