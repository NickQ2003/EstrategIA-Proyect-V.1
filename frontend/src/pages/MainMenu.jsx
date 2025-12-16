import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import Cards from '../components/Cards';
import ThemeToggle from '../components/ThemeToggle';
import styles from '../styles/modules/MainMenu.module.css';

const MainMenu = () => {
    const services = [
        {
            icon: LayoutDashboard,
            title: 'EventFlow',
            description: 'Gestión de participantes, asistencia y reportes.',
            path: '/dashboard',
            color: 'blue'
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>
                        Bienvenido a <span className={styles.brandName}>EstrategIA</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Selecciona el servicio al que deseas acceder
                    </p>
                </div>
                <div className={styles.themeToggleWrapper}>
                    <ThemeToggle />
                </div>
            </div>

            <div className={styles.servicesGrid}>
                {services.map((service, index) => (
                    <Cards
                        key={index}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                        path={service.path}
                        color={service.color}
                    />
                ))}
            </div>

            <div className={styles.footer}>
                <p className={styles.footerText}>
                    Sistema Integral de Participantes y Registro en Línea
                </p>
            </div>
        </div>
    );
};

export default MainMenu;
