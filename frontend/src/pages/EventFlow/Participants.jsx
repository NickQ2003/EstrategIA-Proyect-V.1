import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Filter, MoreVertical, FileDown, Edit, Trash2, EyeOff, Loader2, X, AlertTriangle, ScanBarcode, ArrowRight } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import CustomSelect from '../../components/CustomSelect';
import * as XLSX from 'xlsx';
import styles from '../../styles/modules/Participants.module.css';

const Participants = () => {
    // ... existing list management code ...
    const [showModal, setShowModal] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters State
    const [filterType, setFilterType] = useState('nombre');
    const [filterValue, setFilterValue] = useState('');

    // Actions State
    const [activeActionId, setActiveActionId] = useState(null);
    const [editMode, setEditMode] = useState(null);
    const [deleteMode, setDeleteMode] = useState(null);
    const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

    // Scanner / Wizard State
    const [step, setStep] = useState(1);
    const [isManualMode, setIsManualMode] = useState(false);
    const scanInputRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        nombre_completo: '',
        numero_cedula: '',
        tipo_cedula: 'CC',
        email: '',
        rol: 'Participante'
    });

    const API_URL = 'http://localhost:8000/api/invitados/';

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchParticipants();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [filterValue, filterType]);

    // Auto-focus scanner input when modal opens in Step 1
    useEffect(() => {
        if (showModal && step === 1 && !isManualMode) {
            // Slight delay to ensure render
            setTimeout(() => {
                scanInputRef.current?.focus();
            }, 100);
        }
    }, [showModal, step, isManualMode]);

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            let url = API_URL;
            if (filterValue) {
                url += `?${filterType}=${encodeURIComponent(filterValue)}`;
            }
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setParticipants(data);
            }
        } catch (error) {
            console.error('Error fetching participants:', error);
        } finally {
            setLoading(false);
        }
    };

    // Validation State
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let error = '';
        if (name === 'numero_cedula') {
            if (/[^0-9]/.test(value)) {
                error = 'Solo se aceptan números';
            } else if (!value.trim()) {
                error = 'El campo está vacío';
            }
        }
        if (name === 'nombre_completo') {
            if (!value.trim()) {
                error = 'El campo está vacío';
            }
        }
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                error = 'Formato de email inválido (ejemplo@dominio.com)';
            }
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Validate immediately on change for strict rules (like numbers only)
        // But for "empty", we usually wait for blur or save. 
        // However, if there's already an error, we want to clear it if fixed.
        const error = validateField(name, value);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        setFormData({ ...formData, [name]: value });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // ... existing ...

    {
        step === 2 && (
            <div className={`${styles.slideIn} ${styles.compactForm}`}>
                {/* Row 1: ID Info */}
                <div className={styles.formRow}>
                    <div style={{ flex: '0 0 35%' }}>
                        <label className={styles.label}>Tipo Documento</label>
                        <CustomSelect
                            value={formData.tipo_cedula}
                            onChange={(val) => setFormData({ ...formData, tipo_cedula: val })}
                            options={[
                                { value: 'CC', label: 'C. Ciudadanía' },
                                { value: 'TI', label: 'T. Identidad' },
                                { value: 'CE', label: 'C. Extranjería' }
                            ]}
                            width="100%"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className={styles.label}>Número de Documento</label>
                        <input
                            name="numero_cedula"
                            value={formData.numero_cedula}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`input w-full ${errors.numero_cedula ? styles.inputError : ''}`}
                            placeholder="Ej: 123456789"
                            autoFocus={isManualMode}
                        />
                        {errors.numero_cedula && (
                            <span className={styles.errorText}>
                                {errors.numero_cedula}
                            </span>
                        )}
                    </div>
                </div>

                {/* Row 2: Name */}
                <div>
                    <label className={styles.label}>Nombre Completo</label>
                    <input
                        name="nombre_completo"
                        value={formData.nombre_completo}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`input w-full ${errors.nombre_completo ? styles.inputError : ''}`}
                        placeholder="Nombres y Apellidos"
                    />
                    {errors.nombre_completo && (
                        <span className={styles.errorText}>
                            {errors.nombre_completo}
                        </span>
                    )}
                </div>

                {/* Row 3: Email + Role */}
                <div className={styles.formRow}>
                    <div>
                        <label className={styles.label}>Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`input w-full ${errors.email ? styles.inputError : ''}`}
                            placeholder="opcional@email.com"
                        />
                        {errors.email && (
                            <span className={styles.errorText}>
                                {errors.email}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className={styles.label}>Rol</label>
                        <CustomSelect
                            value={formData.rol}
                            onChange={(val) => setFormData({ ...formData, rol: val })}
                            options={[
                                { value: 'Participante', label: 'Participante' },
                                { value: 'Jurado', label: 'Jurado' },
                                { value: 'Testigo', label: 'Testigo' },
                                { value: 'Logistica', label: 'Logística' }
                            ]}
                            width="100%"
                        />
                    </div>
                </div>
            </div>
        )
    }

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(participants);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes");
        XLSX.writeFile(workbook, "Participantes_EstrategIA.xlsx");
    };

    const resetForm = () => {
        setFormData({ nombre_completo: '', numero_cedula: '', tipo_cedula: 'CC', email: '', rol: 'Participante' });
        setEditMode(null);
        setShowModal(false);
        setStep(1);
        setIsManualMode(false);
        setErrors({}); // Clear errors on reset
    };

    // Scanner Handling
    const handleScanInput = (e) => {
        const val = e.target.value;
        // Basic heuristic: specific length or format usually implies barcode
        // For this demo, we treat any long input not manually typed as "scan"
        // But since we use a hidden input, we just take the value.
        // real Colombian ID parsing (PDF417) is complex, often pipe delimited.

        // Example Mock Parser for PDF417 (if it contains data separators)
        // This is a VERY simplified placeholder logic
        if (val.length > 20 && val.includes('0000')) {
            // Mock extraction
            setFormData(prev => ({
                ...prev,
                numero_cedula: val.slice(0, 10), // simplified
                nombre_completo: "CIUDADANO DETECTADO" // simplified
            }));
            // Auto advance
            setStep(2);
        }
    };

    const handleNextStep = () => {
        // Validate fields for step 1 before proceeding
        const newErrors = {};
        if (!formData.numero_cedula) newErrors.numero_cedula = 'El campo está vacío';
        else if (/[^0-9]/.test(formData.numero_cedula)) newErrors.numero_cedula = 'Solo se aceptan números';

        if (!formData.nombre_completo) newErrors.nombre_completo = 'El campo está vacío';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setStep(2);
    };

    const handleSave = async () => {
        // Validate all fields before saving
        const newErrors = {};
        if (!formData.numero_cedula) newErrors.numero_cedula = 'El campo está vacío';
        else if (/[^0-9]/.test(formData.numero_cedula)) newErrors.numero_cedula = 'Solo se aceptan números';

        if (!formData.nombre_completo) newErrors.nombre_completo = 'El campo está vacío';

        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) newErrors.email = 'Formato de email inválido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const method = editMode ? 'PUT' : 'POST';
            const url = editMode ? `${API_URL}${editMode}/` : API_URL;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchParticipants();
                resetForm();
            } else {
                alert('Error al guardar registro');
            }
        } catch (error) {
            console.error('Error saving participant:', error);
        }
    };

    const handleDelete = async () => {
        if (!deleteMode) return;
        if (deleteConfirmInput !== deleteMode.numero_cedula) {
            alert('El número de cédula no coincide');
            return;
        }

        try {
            const response = await fetch(`${API_URL}${deleteMode.id}/`, { method: 'DELETE' });
            if (response.ok) {
                await fetchParticipants();
                setDeleteMode(null);
                setDeleteConfirmInput('');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleHide = async (id) => {
        if (!confirm('¿Seguro que desea ocultar este registro por inasistencia?')) return;
        try {
            const response = await fetch(`${API_URL}${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: false })
            });
            if (response.ok) await fetchParticipants();
        } catch (error) {
            console.error('Error hiding:', error);
        }
    };

    const openEdit = (participant) => {
        setFormData({
            nombre_completo: participant.nombre_completo,
            numero_cedula: participant.numero_cedula,
            tipo_cedula: participant.tipo_cedula,
            email: participant.email || '',
            rol: participant.rol || 'Participante'
        });
        setEditMode(participant.id);
        setShowModal(true);
        setActiveActionId(null);
        setStep(1);
        setIsManualMode(true); // Edit is always manual
    };

    return (
        <div>
            {/* Header */}
            <div className={`flex-between ${styles.header}`}>
                <div>
                    <h2 className={styles.title}>Gestión de Participantes</h2>
                    <p className={styles.subtitle}>Administre el registro y roles</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { resetForm(); setShowModal(true); }}
                >
                    <Plus size={18} />
                    Nuevo Registro
                </button>
            </div>

            {/* Filters Bar */}
            <div className={`card ${styles.filterCard}`}>
                <div className="flex-between" style={{ gap: '1rem' }}>
                    <div className={styles.filterControls}>
                        <CustomSelect
                            value={filterType}
                            onChange={(val) => setFilterType(val)}
                            width="180px"
                            options={[
                                { value: 'nombre', label: 'Nombre' },
                                { value: 'cedula', label: 'Cédula' },
                                { value: 'fecha', label: 'Fecha' }
                            ]}
                        />
                        <div className={styles.searchWrapper}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                className={`input ${styles.searchInput}`}
                                placeholder={`Filtrar por ${filterType}...`}
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn btn-secondary" onClick={handleExport}>
                        <FileDown size={18} /> Exportar Excel
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={`card ${styles.tableCard}`}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            {['Nombre Completo', 'Rol', 'Documento', 'Email', 'Registrado', 'Acciones'].map(head => (
                                <th key={head} className={styles.th}>
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {participants.length === 0 && !loading ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No hay resultados</td></tr>
                        ) : participants.map((p) => (
                            <tr key={p.id} className={styles.tr}>
                                <td className={`${styles.td} ${styles.tdName}`}>{p.nombre_completo}</td>
                                <td className={styles.td}><span className="badge badge-neutral">{p.rol}</span></td>
                                <td className={`${styles.td} ${styles.tdCode}`}>{p.tipo_cedula} {p.numero_cedula}</td>
                                <td className={styles.td}>{p.email || '-'}</td>
                                <td className={`${styles.td} ${styles.tdDate}`}>{new Date(p.registrado_en).toLocaleDateString()}</td>
                                <td className={`${styles.td} ${styles.actionCell}`}>
                                    <div
                                        className={styles.actionBtnWrapper}
                                        onMouseEnter={() => setActiveActionId(p.id)}
                                        onMouseLeave={() => setActiveActionId(null)}
                                    >
                                        <button className={styles.actionIconBtn}>
                                            <MoreVertical size={18} />
                                        </button>

                                        {/* Hover Menu */}
                                        {activeActionId === p.id && (
                                            <div className={styles.dropdownMenu}>
                                                <button
                                                    className={styles.menuItem}
                                                    onClick={() => openEdit(p)}
                                                >
                                                    <Edit size={16} /> Editar
                                                </button>
                                                <button
                                                    className={`${styles.menuItem} ${styles.textDanger}`}
                                                    onClick={() => { setDeleteMode(p); setActiveActionId(null); }}
                                                >
                                                    <Trash2 size={16} /> Borrar
                                                </button>
                                                <button
                                                    className={styles.menuItem}
                                                    onClick={() => handleHide(p.id)}
                                                >
                                                    <EyeOff size={16} /> Ocultar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div className={styles.loaderWrapper}><Loader2 className="animate-spin" /></div>}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={`card ${styles.modalContent}`}>
                        <div className={`flex-between ${styles.modalHeader}`}>
                            <h3>{editMode ? 'Editar Registro' : 'Nuevo Registro'}</h3>
                            <button onClick={resetForm}><X size={20} /></button>
                        </div>

                        {/* Step Indicator */}
                        {!editMode && (
                            <div className={styles.stepIndicator}>
                                <div className={`${styles.stepDot} ${step === 1 ? styles.stepDotActive : ''}`}></div>
                                <div className={`${styles.stepDot} ${step === 2 ? styles.stepDotActive : ''}`}></div>
                            </div>
                        )}

                        <div className="flex-col gap-4">
                            {/* Hidden Input for global scan in Step 1 */}
                            {step === 1 && !isManualMode && !editMode && (
                                <input
                                    ref={scanInputRef}
                                    className={styles.hiddenInput}
                                    autoFocus
                                    onBlur={() => {
                                        // Optional: Keep focus unless user explicitly clicked away
                                        // scanInputRef.current?.focus(); 
                                    }}
                                    onChange={handleScanInput}
                                />
                            )}

                            {step === 1 && (
                                <div className={styles.slideIn}>
                                    {!editMode && (
                                        <>
                                            <div
                                                className={`${styles.scannerContainer} ${styles.scannerContainerActive}`}
                                                onClick={() => {
                                                    // Focus hidden input
                                                    scanInputRef.current?.focus();
                                                }}
                                            >
                                                <ScanBarcode size={48} className={styles.scannerIcon} />
                                                <p className={styles.scannerText}>Escanee el código de barras de la cédula...</p>
                                            </div>

                                            <button
                                                className={styles.manualEntryBtn}
                                                onClick={() => { setIsManualMode(true); setStep(2); }}
                                            >
                                                <Edit size={16} style={{ marginBottom: '-3px', marginRight: '8px' }} />
                                                Ingreso Manual
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {step === 2 && (
                                <div className={`${styles.slideIn} ${styles.compactForm}`}>
                                    {/* Row 1: ID Info */}
                                    <div className={styles.formRow}>
                                        <div style={{ flex: '0 0 35%' }}>
                                            <label className={styles.label}>Tipo Documento</label>
                                            <CustomSelect
                                                value={formData.tipo_cedula}
                                                onChange={(val) => setFormData({ ...formData, tipo_cedula: val })}
                                                options={[
                                                    { value: 'CC', label: 'C. Ciudadanía' },
                                                    { value: 'TI', label: 'T. Identidad' },
                                                    { value: 'CE', label: 'C. Extranjería' }
                                                ]}
                                                width="100%"
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className={styles.label}>Número de Documento</label>
                                            <input
                                                name="numero_cedula"
                                                value={formData.numero_cedula}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`input w-full ${errors.numero_cedula ? styles.inputError : ''}`}
                                                placeholder="Ej: 123456789"
                                                autoFocus={isManualMode}
                                            />
                                            {errors.numero_cedula && (
                                                <span className={styles.errorText}>
                                                    {errors.numero_cedula}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 2: Name */}
                                    <div>
                                        <label className={styles.label}>Nombre Completo</label>
                                        <input
                                            name="nombre_completo"
                                            value={formData.nombre_completo}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`input w-full ${errors.nombre_completo ? styles.inputError : ''}`}
                                            placeholder="Nombres y Apellidos"
                                        />
                                        {errors.nombre_completo && (
                                            <span className={styles.errorText}>
                                                {errors.nombre_completo}
                                            </span>
                                        )}
                                    </div>

                                    {/* Row 3: Email + Role */}
                                    <div className={styles.formRow}>
                                        <div>
                                            <label className={styles.label}>Email</label>
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`input w-full ${errors.email ? styles.inputError : ''}`}
                                                placeholder="opcional@email.com"
                                            />
                                            {errors.email && (
                                                <span className={styles.errorText}>
                                                    {errors.email}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label className={styles.label}>Rol</label>
                                            <CustomSelect
                                                value={formData.rol}
                                                onChange={(val) => setFormData({ ...formData, rol: val })}
                                                options={[
                                                    { value: 'Participante', label: 'Participante' },
                                                    { value: 'Jurado', label: 'Jurado' },
                                                    { value: 'Testigo', label: 'Testigo' },
                                                    { value: 'Logistica', label: 'Logística' }
                                                ]}
                                                width="100%"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.modalActions}>
                            {step === 1 ? (
                                <button className="btn btn-secondary" onClick={resetForm} style={{ width: '100%' }}>Cancelar</button>
                            ) : (
                                <>
                                    <button className="btn btn-secondary" onClick={() => { setStep(1); setIsManualMode(false); }}>Atrás</button>
                                    <button className={styles.btnFinish} onClick={handleSave}>Finalizar Registro</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteMode && (
                <div className={styles.modalOverlay}>
                    <div className={`card ${styles.modalContent}`} style={{ maxWidth: '400px' }}>
                        <div className={styles.deleteIconWrapper}>
                            <AlertTriangle size={48} className={styles.deleteIcon} />
                        </div>
                        <h3 className={`${styles.centerText} ${styles.mb1}`}>Confirmar Eliminación</h3>
                        <p className={`${styles.centerText} ${styles.mb1}`} style={{ color: 'var(--color-text-muted)' }}>
                            Para eliminar a <b>{deleteMode.nombre_completo}</b>, por favor escriba el número de documento:
                            <br /><code>{deleteMode.numero_cedula}</code>
                        </p>
                        <input
                            className={`input ${styles.centeredInput} ${styles.mb15}`}
                            placeholder="Ingrese documento..."
                            value={deleteConfirmInput}
                            onChange={(e) => setDeleteConfirmInput(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setDeleteMode(null); setDeleteConfirmInput(''); }}>Cancelar</button>
                            <button
                                className={`btn btn-primary ${styles.dangerBtn}`}
                                style={{ flex: 1 }}
                                disabled={deleteConfirmInput !== deleteMode.numero_cedula}
                                onClick={handleDelete}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Participants;
