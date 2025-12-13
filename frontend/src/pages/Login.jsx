import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Loader2, ArrowRight } from 'lucide-react';
import styles from '../styles/modules/Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('admin');

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1200);
    };

    return (
        <div className={styles.container}>
            <div className={`card ${styles.loginCard}`}>
                <div className={styles.header}>
                    <div className={styles.logo}>S</div>
                    <h1 className={styles.title}>Bienvenido a SIPREL</h1>
                    <p className={styles.subtitle}>Ingrese sus credenciales para continuar</p>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    <div>
                        <label className={styles.label}>Correo Electrónico</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input
                                type="email"
                                className={`input ${styles.inputField}`}
                                placeholder="admin@siprel.com"
                                defaultValue="admin@siprel.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={styles.label}>Contraseña</label>
                        <div className={styles.inputWrapper}>
                            <KeyRound size={18} className={styles.inputIcon} />
                            <input
                                type="password"
                                className={`input ${styles.inputField}`}
                                placeholder="••••••••"
                                defaultValue="password"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={styles.label}>Rol</label>
                        <select
                            className="input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Administrador</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="digitador">Digitador</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitBtn}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className={styles.spinAnimation} size={20} />
                        ) : (
                            <>
                                Ingresar al Sistema
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div >
        </div >
    );
};

export default Login;
