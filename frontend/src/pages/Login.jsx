import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Loader2, ArrowRight } from 'lucide-react';
import styles from '../styles/modules/Login.module.css';
import isologo from '../assets/isologo_estrategIA.png';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('admin@estrategia.com');
    const role = 'admin'; // Fixed: Define role constant since selector was removed

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            // Mock Auth Persistence
            const user = { email: email, role: role };
            localStorage.setItem('user', JSON.stringify(user));

            setLoading(false);
            navigate('/');
        }, 1200);
    };

    return (
        <div className={styles.container}>
            <div className={`card ${styles.loginCard}`}>
                <div className={styles.header}>
                    <img src={isologo} alt="EstrategIA Logo" className={styles.logoImage} style={{ height: '120px', marginBottom: '1rem' }} />
                    <h1 className={styles.title}>Bienvenido a EstrategIA</h1>
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
                                placeholder="admin@estrategia.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
