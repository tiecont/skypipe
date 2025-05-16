"use client";
import { useState } from "react";

type RegisterFormState = {
    name: string;
    full_name: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    country: string;
    city: string;
    plan_id: string;
    captcha: string;
};

const initialForm: RegisterFormState = {
    name: "",
    full_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    country: "",
    city: "",
    plan_id: "",
    captcha: "pass",
};

const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"];
const plans = ["Basic", "Standard", "Premium", "Enterprise"];

export default function RegisterForm() {
    const [form, setForm] = useState(initialForm);
    const [phase, setPhase] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<RegisterFormState>>({});

    const validatePhase = (phase: number): boolean => {
        const newErrors: Partial<RegisterFormState> = {};

        if (phase === 1) {
            if (!form.name.trim()) newErrors.name = "Username is required";
            if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
            if (!form.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
                newErrors.email = "Email is invalid";
            }
            if (!form.password) {
                newErrors.password = "Password is required";
            } else if (form.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            }
        } else if (phase === 2) {
            if (!form.phone.trim()) newErrors.phone = "Phone is required";
            if (!form.gender) newErrors.gender = "Gender is required";
            if (!form.country) newErrors.country = "Country is required";
        } else if (phase === 3) {
            if (!form.plan_id) newErrors.plan_id = "Plan is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name as keyof RegisterFormState]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const nextPhase = () => {
        if (validatePhase(phase)) {
            setPhase((p) => p + 1);
        }
    };

    const prevPhase = () => setPhase((p) => p - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validatePhase(phase)) {
            console.log("Submitted form:", form);
            setSubmitted(true);
        }
    };

    const renderFields = () => {
        switch (phase) {
            case 1:
                return (
                    <>
                        <Field
                            label="Username"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="Enter your username"
                        />
                        <Field
                            label="Full Name"
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            error={errors.full_name}
                            placeholder="Enter your full name"
                        />
                        <Field
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            error={errors.email}
                            placeholder="your@email.com"
                        />
                        <Field
                            label="Password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            type="password"
                            error={errors.password}
                            placeholder="At least 8 characters"
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        <Field
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            placeholder="+1 (___) ___-____"
                        />
                        <SelectField
                            label="Gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            options={["Male", "Female", "Other", "Prefer not to say"]}
                            error={errors.gender}
                        />
                        <SelectField
                            label="Country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            options={countries}
                            error={errors.country}
                        />
                        <Field
                            label="City"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                        />
                    </>
                );
            case 3:
                return (
                    <>
                        <SelectField
                            label="Plan"
                            name="plan_id"
                            value={form.plan_id}
                            onChange={handleChange}
                            options={plans}
                            error={errors.plan_id}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            {plans.map(plan => (
                                <PlanCard
                                    key={plan}
                                    name={plan}
                                    selected={form.plan_id === plan}
                                    onClick={() => setForm({...form, plan_id: plan})}
                                    price={plan === "Basic" ? "$9.99" : plan === "Standard" ? "$19.99" : plan === "Premium" ? "$29.99" : "Custom"}
                                />
                            ))}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-8 rounded-xl shadow-lg bg-[--color-surface-base] formWrapper border border-[--color-border]">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[--color-text-DEFAULT]">Create your account</h1>
                <p className="text-[--color-text-muted]">Step {phase} of 3</p>
                <div className="w-full bg-[--color-border] h-2 mt-4 rounded-full overflow-hidden">
                    <div
                        className="bg-[--color-primary-DEFAULT] h-full transition-all duration-300 ease-out"
                        style={{ width: `${(phase / 3) * 100}%` }}
                    ></div>
                </div>
            </div>

            {submitted ? (
                <div className="text-center p-8">
                    <div className="w-20 h-20 bg-[--color-accent-success] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[--color-accent-success] mb-2">Registration complete!</h2>
                    <p className="text-[--color-text-muted]">Thank you for signing up. We've sent a confirmation email to {form.email}.</p>
                    <button
                        onClick={() => {
                            setForm(initialForm);
                            setPhase(1);
                            setSubmitted(false);
                        }}
                        className="mt-6 px-6 py-2 bg-[--color-primary-DEFAULT] text-white rounded-lg hover:bg-[--color-primary-dark] transition shadow-md"
                    >
                        Register Another Account
                    </button>
                </div>
            ) : (
                <>
                    <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
                        {renderFields()}
                    </form>
                    <div className="mt-8 flex justify-between items-center">
                        {phase > 1 ? (
                            <button
                                type="button"
                                onClick={prevPhase}
                                className="px-6 py-2 bg-[--color-surface-muted] text-[--color-text-DEFAULT] rounded-lg hover:bg-[--color-border] transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Back
                            </button>
                        ) : (
                            <div></div> // Empty div to maintain space
                        )}
                        {phase < 3 ? (
                            <button
                                type="button"
                                onClick={nextPhase}
                                className="ml-auto px-6 py-2 bg-[--color-primary-DEFAULT] text-text-muted rounded-lg hover:bg-[--color-primary-dark] transition flex items-center gap-2 shadow-md"
                            >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="ml-auto px-6 py-2 bg-[--color-accent-success] text-white rounded-lg hover:bg-[--color-accent-success-dark] transition flex items-center gap-2 shadow-md"
                            >
                                Complete Registration
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function Field({
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
}) {
    return (
        <div className="fieldGroup">
            <label htmlFor={name} className="block text-sm font-medium text-[--color-text-DEFAULT] mb-1">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`inputField ${error ? 'border-[--color-accent-danger]' : ''}`}
                placeholder={placeholder}
            />
            {error && <p className="mt-1 text-sm text-[--color-accent-danger]">{error}</p>}
        </div>
    );
}

function SelectField({
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
    options: string[];
    error?: string;
}) {
    return (
        <div className="fieldGroup">
            <label htmlFor={name} className="block text-sm font-medium text-[--color-text-DEFAULT] mb-1">
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`inputField ${error ? 'border-[--color-accent-danger]' : ''}`}
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-[--color-accent-danger]">{error}</p>}
        </div>
    );
}

function PlanCard({
                      name,
                      selected,
                      onClick,
                      price,
                  }: {
    name: string;
    selected: boolean;
    onClick: () => void;
    price: string;
}) {
    return (
        <div
            className={`p-4 border rounded-lg cursor-pointer transition-all ${selected ? 'border-[--color-primary-DEFAULT] bg-[--color-primary-light] bg-opacity-10' : 'border-[--color-border] hover:border-[--color-primary-light]'}`}
            onClick={onClick}
        >
            <h3 className="font-medium text-[--color-text-DEFAULT]">{name}</h3>
            <p className="text-[--color-primary-DEFAULT] font-bold">{price}</p>
            <p className="text-xs text-[--color-text-muted] mt-1">Per month</p>
        </div>
    );
}