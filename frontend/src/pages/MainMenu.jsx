import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, UserPlus, Briefcase } from 'lucide-react';
import Cards from '../components/Cards';
import ThemeToggle from '../components/ThemeToggle';
import UserMenu from '../components/UserMenu';
import styles from '../styles/modules/MainMenu.module.css';

const MainMenu = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const handleLogin = () => navigate('/login');

    // Only show services if logged in (implied requirement, or just let them see it?)
    // User asked for "iniciar sesion si ya estas registrado", implying guest view exists.
    // For now we show services always but maybe cards redirect to login if guest?
    // Let's keep services visible.

    const services = [
        {
            icon: LayoutDashboard,
            title: 'EventFlow',
            description: 'Gestión de participantes, asistencia y reportes.',
            path: '/dashboard',
            color: 'blue'
        },
        {
            icon: Briefcase,
            title: 'TalentScout',
            description: 'Reclutamiento y evaluación de perfiles.',
            path: '/talent-scout',
            color: 'purple'
        }
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>
                        Bienvenido a <span className={styles.brandName}>EstrategIA</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Selecciona el servicio al que deseas acceder
                    </p>
                </div>
                <div className={styles.headerActions} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <ThemeToggle />

                    {user ? (
                        <UserMenu user={user} onLogout={handleLogout} />
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary" onClick={handleLogin} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <LogIn size={18} /> Iniciar Sesión
                            </button>
                            <button className="btn btn-secondary" onClick={handleLogin} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <UserPlus size={18} /> Registrarse
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.servicesGrid}>
                    {services.map((service, index) => (
                        <Cards
                            key={index}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            path={user ? service.path : '/login'} // Redirect guest to login
                            color={service.color}
                        />
                    ))}
                </div>
            </main>

            <footer className={styles.footer}>
                <p className={styles.footerText}>
                    Sistema Integral de Participantes y Registro en Línea
                </p>
            </footer>
        </div>
    );
};

export default MainMenu;
