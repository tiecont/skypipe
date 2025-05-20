"use client";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Field from "@/components/ui/input";
import Button from "@/components/ui/button";
import Header from "@/components/header";
import {useRouter} from "@/animation-router/patch-router/router";
import {ROUTES} from "@/lib/constants/routes.constants";
import axios, {AxiosResponse} from "axios";
import {login} from "@/services/axios";
import {ILogin} from "@/lib/models/auth.model";
import {deleteClientCookie, setClientCookie} from "@/lib/cookies.client";
import {KEY_COOKIES} from "@/lib/constants/auth.constants";
import { setToLocalStorage} from "@/lib/helper";
import useToast from "@/hooks/useToast";
import {IServerResponse} from "@/lib/models/response.model";

interface T {
    token: string;
    user_id: string;
    email: string;
}
export default function LoginForm() {
    const [form, setForm] = useState<ILogin>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<ILogin>>({});
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useTheme();
    const router = useRouter()
    const {showSuccess, showError, showWarning} = useToast()
    const validateForm = (): boolean => {
        const newErrors: Partial<ILogin> = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name as keyof ILogin]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response: AxiosResponse = await login(form)
            const res: IServerResponse<T> = response.data
            if (res.status?.code === 200) {
                setToLocalStorage("email", res.data.email);
                setClientCookie(KEY_COOKIES.OTP_TOKEN, res.data.token, { minutes: 3 })
                setClientCookie(KEY_COOKIES.USER_ID, res.data.user_id, { minutes: 3 })
                showSuccess(res.status?.message || "We just send to you an email verification code. Redirecting...");
                router.push(`${ROUTES.AUTH_VERIFY_LOGIN}?email=${res.data.email}`);
            }
            if (res.status?.code === 401) {
                deleteClientCookie(KEY_COOKIES.USER)
                deleteClientCookie(KEY_COOKIES.TOKEN)
                deleteClientCookie(KEY_COOKIES.REFRESH_TOKEN)
                showWarning(res.status?.message || "Invalid credentials, please try again.");
            }
            if (res.status?.code === 400) {
                deleteClientCookie(KEY_COOKIES.USER)
                deleteClientCookie(KEY_COOKIES.TOKEN)
                deleteClientCookie(KEY_COOKIES.REFRESH_TOKEN)
                showWarning(res.status?.message || "Invalid input, please try again.");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                showError(error?.message || "Login failed.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleMoveToRegister = () => {
        router.push(ROUTES.AUTH_SIGN_UP)
    }
    return (
        <div className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-surface-dark" : "bg-primary-dark"}`}>
            <Header/>
            <main className={`flex-grow flex items-center justify-center p-4 ${theme === "dark" ? "text-white" : "text-text-muted"}`}>
                <div
                    className={`max-w-md w-full mx-auto p-8 rounded-xl shadow-lg border ${
                        theme === "dark" ? "bg-surface-dark" : "bg-surface-base"
                    }`}
                >
                    <h1 className="text-2xl font-bold text-text text-center mb-8">Login</h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Field
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="your@email.com"
                        />

                        <Field
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Enter your password"
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant={"primary"}
                                isLoading={isLoading}
                                className="w-full bg-primary-DEFAULT"
                                text={isLoading ? "Logging in..." : "Login"}
                            />
                        </div>
                    </form>

                    <div className="mt-4 text-center text-sm text-text-muted">
                        Don&#39;t have an account?{" "}
                        <span className="text-primary-DEFAULT hover:cursor-pointer hover:text-primary-dark"
                        onClick={handleMoveToRegister}>
                            Register here
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
}