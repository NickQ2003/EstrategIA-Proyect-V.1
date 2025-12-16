import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, CalendarDays, ArrowUpRight, Loader2, ChevronLeft, ChevronRight, Search, Filter, FileDown } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import * as XLSX from 'xlsx';
// import commonStyles from '../index.css';  <-- Removed to prevent build/runtime errors if not a module
import styles from '../styles/modules/Dashboard.module.css';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_historical: 0,
        users_month: 0,
        users_prev_month: 0,
        recent_activity: [], // Ensure array is always present
        chart_data: []
    });

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    // Origin date (hardcoded for now as per requirement: "start of this instance existence")
    const ORIGIN_DATE = '2025-11';

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('ALL');

    useEffect(() => {
        fetchStats();
    }, [selectedDate]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/dashboard/stats/?month=${selectedDate}`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate percentage change
    const calculateChange = () => {
        if (stats.users_prev_month === 0) return '+100%';
        const diff = stats.users_month - stats.users_prev_month;
        const percent = (diff / stats.users_prev_month) * 100;
        return `${diff >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
    };

    // Auto-refresh every 30 seconds to keep data "live"
    useEffect(() => {
        const interval = setInterval(fetchStats, 30000); // 30s polling
        return () => clearInterval(interval);
    }, [selectedDate]); // Re-set interval if date changes

    const metricCards = [
        {
            title: 'Total Histórico',
            value: stats.total_historical,
            change: 'Interacciones totales',
            description: 'Conteo acumulado de todos los registros y acciones desde el inicio.',
            icon: Users,
            color: 'brand'
        },
        {
            title: 'Registros del Mes',
            value: stats.users_month,
            change: calculateChange(),
            description: 'Nuevos participantes creados durante el mes seleccionado.',
            icon: UserPlus,
            color: 'success'
        },
        {
            title: 'Mes Anterior',
            value: stats.users_prev_month,
            change: 'vs Seleccionado',
            description: 'Comparativa de registros con el mes inmediatamente anterior.',
            icon: UserCheck,
            color: 'accent'
        },
        {
            title: 'Tasa de Asistencia',
            value: stats.users_month > 0 ? '98.5%' : '0%', // Mock
            change: '+2.4%',
            description: 'Porcentaje de participantes confirmados vs invitados esperados.',
            icon: ArrowUpRight,
            color: 'warning'
        }
    ];

    // Navigation Logic
    const navigateMonth = (direction) => {
        const currentDate = new Date(selectedDate + '-02'); // Avoid timezone day shift issues
        if (direction === 'prev') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        setSelectedDate(currentDate.toISOString().slice(0, 7));
    };

    const isCurrentMonth = selectedDate >= new Date().toISOString().slice(0, 7);
    const isPastOrigin = selectedDate <= ORIGIN_DATE;

    const formattedDateLabel = new Date(selectedDate + '-02').toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

    // Filter Logic
    const filteredActivity = (stats.recent_activity || []).filter(item => {
        const matchesSearch = item.target.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = filterAction === 'ALL' || item.action === filterAction;
        return matchesSearch && matchesAction;
    });

    const handleExport = () => {
        const dataToExport = filteredActivity.map(item => ({
            Usuario: item.target,
            Accion: getActionLabel(item.action),
            Fecha: new Date(item.timestamp).toLocaleString(),
            Estado: item.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Actividad");
        XLSX.writeFile(workbook, `Reporte_Actividad_${selectedDate}.xlsx`);
    };

    const getActionLabel = (action) => {
        switch (action) {
            case 'CREATE': return 'Nuevo Registro';
            case 'UPDATE': return 'Edición de datos';
            case 'DELETE': return 'Eliminación (Baja)';
            case 'HIDE': return 'Ocultamiento';
            default: return action;
        }
    };

    const getActionClass = (action) => {
        switch (action) {
            case 'CREATE': return styles.actionCreate;
            case 'UPDATE': return styles.actionUpdate;
            case 'DELETE': return styles.actionDelete;
            case 'HIDE': return styles.actionHide;
            default: return '';
        }
    };

    return (
        <div>
            <div className={`flex-between ${styles.header}`}>
                <div>
                    <h2 className={styles.title}>Panel General</h2>
                    <p className={styles.subtitle}>Resumen de actividad y asistencias</p>
                </div>
                <div className={styles.actions}>
                    {/* Dynamic Date Navigation */}
                    <div className={styles.dateNav}>
                        <button
                            className={styles.navBtn}
                            onClick={() => navigateMonth('prev')}
                            disabled={isPastOrigin} // Stop at origin? User said "until last record", origin is safe proxy.
                            title="Mes Anterior"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className={styles.currentMonth}>
                            {formattedDateLabel}
                        </div>

                        {!isCurrentMonth && (
                            <button
                                className={styles.navBtn}
                                onClick={() => navigateMonth('next')}
                                title="Mes Siguiente"
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-center" style={{ height: '300px' }}>
                    <Loader2 className="animate-spin" size={48} color="var(--color-brand)" />
                </div>
            ) : (
                <>
                    {/* SECTION 1: General Statistics */}
                    <div className={styles.sectionContainer}>
                        <div className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Indicadores Generales</h3>
                        </div>
                        <div className={styles.grid}>
                            {metricCards.map((stat, index) => (
                                <div key={index} className="card" style={{ border: '1px solid var(--color-border)' }}>
                                    <div className={styles.cardHeader}>
                                        <div
                                            className={styles.iconWrapper}
                                            style={{
                                                background: `var(--color-${stat.color}-light)`,
                                                color: `var(--color-${stat.color})`
                                            }}
                                        >
                                            <stat.icon size={22} color={`var(--color-${stat.color})`} />
                                        </div>
                                    </div>
                                    <div className={styles.value}>{stat.value}</div>
                                    <div className={styles.change}>
                                        <span className={stat.change.includes('+') ? styles.positiveChange : ''}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className={styles.cardDescription}>{stat.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 2: Recent Activity */}
                    <div className={styles.sectionContainer}>
                        <h3 className={styles.sectionTitle} style={{ fontSize: '1.25rem', fontWeight: 600 }}>Actividad Reciente</h3>
                        <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>Registro de movimientos del mes seleccionado</p>

                        <div className={`card ${styles.filterCard}`} style={{ border: '1px solid var(--color-border)', boxShadow: 'none' }}>
                            <div className="flex-between" style={{ gap: '1rem' }}>
                                <div className={styles.filterControls}>
                                    <CustomSelect
                                        value={filterAction}
                                        onChange={(val) => setFilterAction(val)}
                                        icon={Filter}
                                        width="200px"
                                        options={[
                                            { value: 'ALL', label: 'Todas las acciones' },
                                            { value: 'CREATE', label: 'Nuevo Registro' },
                                            { value: 'UPDATE', label: 'Edición' },
                                            { value: 'DELETE', label: 'Eliminación' }
                                        ]}
                                    />
                                    <div className={styles.searchWrapper}>
                                        <Search size={18} className={styles.searchIcon} />
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre..."
                                            className={`input ${styles.searchInput}`}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button className="btn btn-secondary" onClick={handleExport}>
                                    <FileDown size={18} /> Exportar Excel
                                </button>
                            </div>
                        </div>

                        <div className={`card ${styles.tableCard}`} style={{ border: 'none', boxShadow: 'none' }}>
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th className={styles.th}>Usuario Objetivo</th>
                                        <th className={styles.th}>Acción</th>
                                        <th className={styles.th}>Fecha</th>
                                        <th className={styles.th}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!filteredActivity || filteredActivity.length === 0 ? (
                                        <tr><td colSpan="4" className={styles.td} style={{ textAlign: 'center' }}>No se encontraron registros para este periodo</td></tr>
                                    ) : (
                                        filteredActivity.map((item) => (
                                            <tr key={item.id} className={styles.tr}>
                                                <td className={`${styles.td} ${styles.tdName}`}>{item.target}</td>
                                                <td className={`${styles.td} ${getActionClass(item.action)}`}>
                                                    {getActionLabel(item.action)}
                                                </td>
                                                <td className={`${styles.td} ${styles.tdDate}`}>
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </td>
                                                <td className={styles.td}>
                                                    <span className={`badge ${item.status === 'SUCCESS' ? 'badge-success' : 'badge-danger'}`}>
                                                        {item.status === 'SUCCESS' ? 'Completado' : 'Fallido'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
