"use client";
import { useState } from "react";
import Header from "@/components/header/index";
import { useTheme } from "@/context/ThemeContext";
import Field from "@/components/ui/input";
import SelectField from "@/components/ui/select";
import Button from "@/components/ui/button";
import {useRouter} from "@/animation-router/patch-router/router";
import {ROUTES} from "@/lib/constants/routes.constants";
import {CountryCode, Plan, PlanCardProps, SelectOption} from "@/lib/models/register.model";
import {AxiosResponse} from "axios";
import {register} from "@/services/axios";
import {setClientCookie} from "@/lib/cookies.client";
import useToast from "@/hooks/useToast";
import { IRegister } from "@/lib/models/auth.model";
import {KEY_COOKIES} from "@/lib/constants/auth.constants";


// Constants
const initialForm: IRegister = {
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
    countryCode: "+1",
};

const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Vietnam",
];

const countryCodes: CountryCode[] = [
    { code: "+1", name: "US/Canada", flag: "🇺🇸" },
    { code: "+44", name: "UK", flag: "🇬🇧" },
    { code: "+61", name: "AU", flag: "🇦🇺" },
    { code: "+49", name: "DE", flag: "🇩🇪" },
    { code: "+33", name: "FR", flag: "🇫🇷" },
    { code: "+84", name: "VN", flag: "🇻🇳" },
];

const plans: Plan[] = [
    {
        id: "76ba2560-5a0f-4473-8ff1-aff278f724ec",
        name: "Free",
        price: 0,
        max_projects: 1,
        max_users: 5,
    },
    {
        id: "101bb5a8-563a-41c2-b435-5e3402f05f95",
        name: "Pro",
        price: 19.99,
        max_projects: 10,
        max_users: 50,
        recommended: true,
    },
    {
        id: "6a63a77e-c7cf-42eb-ab84-336f15c1137f",
        name: "Enterprise",
        price: 99.99,
        max_projects: 100,
        max_users: 1000,
    },
];

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

export default function RegisterForm() {
    const [form, setForm] = useState<IRegister>(initialForm);
    const [phase, setPhase] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<IRegister>>({});
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();

    const { showSuccess, showError } = useToast();
    const router = useRouter();
    // Validation
    const validatePhase = (phase: number): boolean => {
        const newErrors: Partial<IRegister> = {};

        if (phase === 1) {
            if (!form.name.trim()) newErrors.name = "Username is required";
            else if (form.name.length < 3) newErrors.name = "Username must be at least 3 characters";

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
            } else if (!/[A-Z]/.test(form.password)) {
                newErrors.password = "Password must contain at least one uppercase letter";
            } else if (!/[0-9]/.test(form.password)) {
                newErrors.password = "Password must contain at least one number";
            }
        } else if (phase === 2) {
            if (!form.phone.trim()) {
                newErrors.phone = "Phone is required";
            } else if (!/^\d{8,15}$/.test(form.phone)) {
                newErrors.phone = "Phone number is invalid";
            }
            if (!form.gender) newErrors.gender = "Gender is required";
            if (!form.country) newErrors.country = "Country is required";
        } else if (phase === 3) {
            if (!form.plan_id) newErrors.plan_id = "Plan is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof IRegister]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const nextPhase = () => {
        if (validatePhase(phase)) {
            setPhase((p) => p + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const prevPhase = () => {
        setPhase((p) => p - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePhase(phase)) return;

        setIsLoading(true);
        try {
            const response: AxiosResponse = await register(form)
            const res = response.data;
            if (res?.status?.code === 201) {
                setClientCookie(KEY_COOKIES.USER, res.data.user_id, 7);
                showSuccess(res?.data?.message || "Registration successful");
            }
            setSubmitted(true);
        } catch (error) {
            showError(`Registration error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Phase Renderers
    const renderPhase1 = () => (
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
                placeholder="At least 8 characters with number and uppercase"
            />
        </>
    );

    const renderPhase2 = () => {
        const countryCodeOptions: SelectOption[] = countryCodes.map(country => ({
            value: country.code,
            label: `${country.flag} ${country.code}`,
        }));

        const countryOptions: SelectOption[] = [
            { value: "", label: "Select Country" },
            ...countries.map(country => ({ value: country, label: country }))
        ];

        const genderOptionsList: SelectOption[] = [
            { value: "", label: "Select Gender" },
            ...genderOptions.map(gender => ({ value: gender, label: gender }))
        ];

        return (
            <>
                <div className={`fieldGroup ${theme === "dark" ? "text-white" : "text-text-muted"}`}>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <div className="flex gap-2 items-center">
                        <div className="w-24">
                            <SelectField
                                label=""
                                name="countryCode"
                                value={form.countryCode}
                                onChange={handleChange}
                                options={countryCodeOptions}
                                error={errors.countryCode}
                            />
                        </div>
                        <div className="flex-1">
                            <Field
                                label=""
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                placeholder="(123) 456-7890"
                            />
                        </div>
                    </div>
                </div>
                <SelectField
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    options={genderOptionsList}
                    error={errors.gender}
                />
                <SelectField
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    options={countryOptions}
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
    };

    const renderPhase3 = () => {
        // Auto-select recommended plan if none is selected
        if (!form.plan_id) {
            const recommendedPlan = plans.find(plan => plan.recommended);
            if (recommendedPlan) {
                setForm(prev => ({ ...prev, plan_id: recommendedPlan.id }));
            }
        }

        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            name={plan.name}
                            selected={form.plan_id === plan.id}
                            onClick={() => setForm({ ...form, plan_id: plan.id })}
                            price={`${plan.price === 0 ? "Free" : `$${plan.price.toFixed(2)}/mo`}`}
                            maxProjects={plan.max_projects}
                            maxUsers={plan.max_users}
                            recommended={plan.recommended}
                        />
                    ))}
                </div>

                {/* Hidden select field for form submission */}
                <input type="hidden" name="plan_id" value={form.plan_id} />
            </>
        );
    };

    const renderFields = () => {
        switch (phase) {
            case 1: return renderPhase1();
            case 2: return renderPhase2();
            case 3: return renderPhase3();
            default: return null;
        }
    };

    return (
        <div className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-surface-dark" : "bg-primary-dark"}`}>
            <Header />
            <main className="flex-grow flex items-center justify-center p-4 text-text-muted">
                <div className={`max-w-md w-full mx-auto my-10 p-8 rounded-xl shadow-lg border ${theme === "dark" ? "bg-surface-dark text-white" : "bg-surface-base"}`}>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold">Create your account</h1>
                        <p className="text-text-muted">Step {phase} of 3</p>
                        <div className="w-full bg-border h-2 mt-4 rounded-full overflow-hidden">
                            <div
                                className="bg-primary-DEFAULT h-full transition-all duration-300 ease-out"
                                style={{ width: `${(phase / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    {submitted ? (
                        <SuccessMessage form={form} onReset={() => {
                            setForm(initialForm);
                            setPhase(1);
                            setSubmitted(false);
                        }} />
                    ) : (
                        <>
                            <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
                                {renderFields()}
                            </form>
                            <FormNavigation
                                phase={phase}
                                onPrev={prevPhase}
                                onNext={nextPhase}
                                onSubmit={handleSubmit}
                                isLoading={isLoading}
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

// Sub-components
const PlanCard = ({
                      name,
                      price,
                      selected,
                      onClick,
                      maxProjects,
                      maxUsers,
                      recommended = false,
                  }: PlanCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer border rounded-lg p-4 shadow-md transition ${
                selected
                    ? "bg-accent-success/10 border-accent-success"
                    : "hover:shadow-lg hover:border-primary/50"
            } ${recommended ? "border-2 border-primary" : ""} relative`}
        >
            {recommended && (
                <div className="absolute -top-2 -right-2 bg-primary-DEFAULT text-white text-xs font-bold px-2 py-1 rounded">
                    Recommended
                </div>
            )}
            <div className="font-bold text-lg text-text-DEFAULT">{name}</div>
            <div className="text-text-muted">{price}</div>
            <div className="text-sm mt-2 text-text-muted">
                <p>• {maxProjects} projects</p>
                <p>• {maxUsers} users</p>
            </div>
        </div>
    );
};

const SuccessMessage = ({
                            form,
                            onReset
                        }: {
    form: IRegister;
    onReset: () => void
}) => {
    const router = useRouter();
    const handleReturnToLogin = () => {
        router.push(ROUTES.AUTH_SIGNIN)
        onReset();
    };

    return (
        <div className="text-center p-8">
            <div className="w-20 h-20 bg-accent-success rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-accent-success mb-2">Registration complete!</h2>
            <p className="text-text-muted">
                Thank you for signing up. We&#39;ve sent a confirmation email to{" "}
                <span className="font-medium text-text-DEFAULT">{form.email}</span>.
            </p>
            <Button
                type="button"
                onClick={handleReturnToLogin}
                className="mt-6 px-6 py-2 bg-primary-DEFAULT hover:cursor-pointer"
                text={"Return to Login"}
            />

        </div>
    );
};

const FormNavigation = ({
                            phase,
                            onPrev,
                            onNext,
                            onSubmit,
                            isLoading,
                        }: {
    phase: number;
    onPrev: () => void;
    onNext: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}) => {
    return (
        <div className="mt-8 flex justify-between items-center">
            {phase > 1 ? (
                <Button
                    type="button"
                    onClick={onPrev}
                    disabled={isLoading}
                    text={"Back"}
                    className={`bg-primary-DEFAULT`}
                />
            ) : (
                <div/>
            )}
            {phase < 3 ? (
                <Button
                    type="button"
                    onClick={onNext}
                    disabled={isLoading}
                    text={"Continue"}
                    className={`bg-primary-DEFAULT`}
                />
            ) : (
                <Button
                    type="submit"
                    onClick={onSubmit}
                    variant="primary"
                    isLoading={isLoading}
                    loadingColor="#ffffff"
                    text={"Submit"}
                    className={`bg-primary-DEFAULT`}
                />
            )}
        </div>
    );
};