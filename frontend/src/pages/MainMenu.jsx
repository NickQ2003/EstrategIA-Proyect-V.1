import React from 'react';
import { LayoutDashboard, Users, ClipboardCheck, Settings, FileText, BarChart3 } from 'lucide-react';
import Cards from '../components/Cards';
import styles from '../styles/modules/MainMenu.module.css';

const MainMenu = () => {
    const services = [
        {
            icon: LayoutDashboard,
            title: 'Dashboard',
            description: 'Panel principal con estadísticas y métricas del sistema',
            path: '/dashboard',
            color: 'blue'
        },
        {
            icon: Users,
            title: 'Participantes',
            description: 'Gestión completa de participantes y sus datos',
            path: '/participants',
            color: 'green'
        },
        {
            icon: ClipboardCheck,
            title: 'Asistencia',
            description: 'Control y registro de asistencia de participantes',
            path: '/attendance',
            color: 'purple'
        },
        {
            icon: FileText,
            title: 'Reportes',
            description: 'Generación de reportes y documentos del sistema',
            path: '/reports',
            color: 'orange'
        },
        {
            icon: BarChart3,
            title: 'Analíticas',
            description: 'Análisis avanzado de datos y tendencias',
            path: '/analytics',
            color: 'cyan'
        },
        {
            icon: Settings,
            title: 'Configuración',
            description: 'Ajustes y configuración del sistema',
            path: '/settings',
            color: 'pink'
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>
                        Bienvenido a <span className={styles.highlight}>SIPREL</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Selecciona el servicio al que deseas acceder
                    </p>
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
