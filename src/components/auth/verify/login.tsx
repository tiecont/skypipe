import { useAuth } from "@/hooks/authContext";
import { useRouter } from "@/animation-router/patch-router/router";
import { useSearchParams } from "next/navigation";
import { SEARCH } from "@/lib/constants/search.constants";
import axios, {AxiosResponse} from "axios";
import { ROUTES } from "@/lib/constants/routes.constants";
import { useState } from "react";
import useToast from "@/hooks/useToast";
import {verifyLogin} from "@/services/axios";
import {IServerResponse} from "@/lib/models/response.model";
import OTPInput from "@/components/ui/otp";

const VerifyLogin = () => {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get(SEARCH.EMAIL) ?? "";
    const { showSuccess, showError } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);

    const MAX_ATTEMPTS = Number(process.env.NEXT_PUBLIC_MAX_OTP_ATTEMPTS || 3);

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
            const payload = {
                email,
                code: otpValue,
            };

            const response: AxiosResponse = await verifyLogin(payload);
            const res: IServerResponse<string> = response.data;
            setIsLoading(false);

            if (res?.status?.code === 200) {
                showSuccess("Login verified successfully");
                login();
                router.push(ROUTES.HOME);
            } else {
                setAttemptCount(prev => prev + 1);
                showError(res?.status?.message || "Invalid code");

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
        <div>
            <OTPInput onSubmit={handleOtpSubmit} isLoading={isLoading} />
        </div>
    );
};

export default VerifyLogin;