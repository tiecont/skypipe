'use client'

import {useTheme} from "@/context/ThemeContext";

interface SelectOption {
    value: string;
    label: string;
    flag?: string;
}

const SelectField = ({
                         label,
                         name,
                         value,
                         onChange,
                         options,
                         error,
                     }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    error?: string;
}) => {
    const { theme } = useTheme();
    return (
        <div className="fieldGroup">
            <label htmlFor={name} className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-text-muted'} mb-1`}>
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`inputField ${error ? 'border-danger' : ''}`}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.flag ? `${option.flag} ${option.label}` : option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-accent-danger">{error}</p>}
        </div>
    );
}

export default SelectField;