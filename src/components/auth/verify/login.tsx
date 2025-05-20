'use client'
import { useAuth } from "@/hooks/authContext";
import { useRouter } from "@/animation-router/patch-router/router";
import { useSearchParams } from "next/navigation";
import { SEARCH } from "@/lib/constants/search.constants";
import axios from "axios";
import { ROUTES } from "@/lib/constants/routes.constants";
import {useEffect, useState} from "react";
import useToast from "@/hooks/useToast";
import OTPInput from "@/components/ui/otp";
import {getClientCookie} from "@/lib/cookies.client";
import {KEY_COOKIES} from "@/lib/constants/auth.constants";
import {IVerifyLogin} from "@/lib/models/auth.model";
import {handleLogin, HandleResponse} from "@/app/api/actions/auth.actions";
import {useTheme} from "@/context/ThemeContext";
import Header from "@/components/header";

const VerifyLogin = () => {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get(SEARCH.EMAIL) ?? "";
    const { showSuccess, showError } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const { theme } = useTheme();
    const MAX_ATTEMPTS = Number(process.env.NEXT_PUBLIC_MAX_OTP_ATTEMPTS || 3);
    const token = getClientCookie(KEY_COOKIES.OTP_TOKEN);
    const userId = getClientCookie(KEY_COOKIES.USER_ID);
    useEffect(() => {
        if (!token || !userId) {
            showError("Invalid request")
            router.push(ROUTES.AUTH_SIGNIN)
            return
        }
    }, [])
    const handleOtpSubmit = async (otpValue: string) => {
        if (!otpValue || otpValue.length !== 6) {
            showError("Invalid code length");
            return;
        }

        if (attemptCount >= MAX_ATTEMPTS) {
            showError("Too many failed attempts. Please request a new code.");
            return;
        }

        try {
            setIsLoading(true);
            const payload: IVerifyLogin = {
                token,
                user_id: userId,
                email,
                code: otpValue,
            };

            const response: HandleResponse = await handleLogin(payload);

            setIsLoading(false);

            if (response.success) {
                showSuccess("Login verified successfully");
                login();
                router.push(ROUTES.HOME);
            } else {
                setAttemptCount(prev => prev + 1);
                showError("Invalid code");

                if (attemptCount + 1 >= MAX_ATTEMPTS) {
                    showError("You have reached the maximum number of attempts.");
                    router.push(ROUTES.AUTH_SIGNIN);
                }
            }
        } catch (error) {
            setIsLoading(false);
            setAttemptCount(prev => prev + 1);
            if (axios.isAxiosError(error) && error.response) {
                showError(error.response.data?.message || "Verification failed");
            } else {
                showError("An unexpected error occurred");
            }

            if (attemptCount + 1 >= MAX_ATTEMPTS) {
                showError("You have reached the maximum number of attempts.");
                router.push(ROUTES.AUTH_SIGNIN);
            }
        }
    };

    return (
        <div className={`w-screen h-screen flex flex-col
        ${theme === "dark" ? "bg-surface-dark" : "bg-primary-dark"}`}>
            <Header />
            <div className={`flex flex-col items-center justify-center w-1/3 h-full m-auto ${theme === "dark" ? "text-white" : "text-text-muted"}`}>
                <OTPInput onSubmit={handleOtpSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default VerifyLogin;