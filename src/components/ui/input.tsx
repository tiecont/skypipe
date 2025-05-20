'use client'
const Field = ({
                   label,
                   name,
                   value,
                   onChange,
                   type = "text",
                   error,
                   placeholder,
               }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
    placeholder?: string;
})=> {
    return (
        <div className="fieldGroup">
            <label htmlFor={name} className="block text-sm font-medium text-text mb-1">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`inputField ${error ? 'border-danger' : ''}`}
                placeholder={placeholder}
            />
            {error && <p className="mt-1 text-sm text-accent-danger">{error}</p>}
        </div>
    );
}

export default Field