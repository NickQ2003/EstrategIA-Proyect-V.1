import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import styles from '../styles/modules/Attendance.module.css';

const Attendance = () => {
    const [docId, setDocId] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [lastScan, setLastScan] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!docId) return;

        setStatus('loading');

        try {
            const response = await fetch(`http://localhost:8000/api/invitados/verify/?doc_id=${docId}`);
            const data = await response.json();

            if (response.ok && data.status === 'found') {
                setStatus('success');
                setLastScan({
                    name: data.data.nombre_completo,
                    role: data.data.tipo_cedula, // Using type as role placeholder for now
                    time: new Date().toLocaleTimeString(),
                    registrado_en: data.data.registrado_en
                });
            } else {
                setStatus('error');
                setLastScan(null);
            }
        } catch (error) {
            console.error('Error verification:', error);
            setStatus('error');
        }

        // Optional: Reset field after delay
        // setTimeout(() => { ... }, 3000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Control de Asistencia</h2>
                <p className={styles.subtitle}>Ingrese o escanee el documento de identidad</p>
            </div>

            <div className={`card ${styles.card}`}>
                <form onSubmit={handleVerify} className={styles.form}>
                    <div className={styles.inputWrapper}>
                        <Search size={32} className={styles.scanIcon} />
                        <input
                            autoFocus
                            type="text"
                            className={`input ${styles.scanInput}`}
                            placeholder="Documento..."
                            value={docId}
                            onChange={(e) => {
                                setDocId(e.target.value);
                                if (status !== 'idle') setStatus('idle');
                            }}
                            disabled={status === 'loading'}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.verifyBtn}`}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? <Clock className={styles.animateSpin} /> : 'Verificar Asistencia'}
                    </button>
                </form>

                {/* Feedback Area */}
                {status === 'success' && lastScan && (
                    <div className={styles.feedbackSuccess}>
                        <div className={styles.iconCircleSuccess}>
                            <CheckCircle size={32} />
                        </div>
                        <h3 className={styles.successTitle}>Asistencia Registrada</h3>
                        <p className={styles.personName}>{lastScan.name}</p>
                        <p className={styles.personDetail}>
                            {lastScan.role} • {lastScan.time}
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className={styles.feedbackError}>
                        <div className={styles.iconCircleError}>
                            <XCircle size={32} />
                        </div>
                        <h3 className={styles.errorTitle}>No Encontrado</h3>
                        <p>El documento <b>{docId}</b> no aparece en la lista de participantes registrados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
