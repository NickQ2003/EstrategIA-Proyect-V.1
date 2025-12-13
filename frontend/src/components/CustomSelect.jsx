import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from '../styles/modules/CustomSelect.module.css';

const CustomSelect = ({ value, onChange, options, placeholder = "Seleccionar...", width = "150px", icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div
            className={styles.container}
            ref={containerRef}
            style={{ width }}
        >
            <div
                className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {Icon && <Icon size={16} className={styles.triggerIcon} />}
                <span className={styles.valueText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
            </div>

            {isOpen && (
                <div className={styles.optionsList}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`${styles.option} ${option.value === value ? styles.optionSelected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                            {option.value === value && <Check size={14} className={styles.checkIcon} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
