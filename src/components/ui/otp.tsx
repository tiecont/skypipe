'use client';
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

interface OTPInputProps {
    onSubmit: (otpValue: string) => void;
    isLoading: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ onSubmit, isLoading }) => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const { theme } = useTheme();

    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;
        const newOtp = [...otp];
        pastedData.split("").forEach((digit, i) => {
            if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        inputsRef.current[pastedData.length - 1]?.focus();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(otp.join(""));
    };

    const handleResend = () => {
        console.log("Resend OTP");
        // Optionally reset OTP if needed:
        // setOtp(Array(6).fill(""));
    };

    // Auto submit when all 6 digits are filled
    useEffect(() => {
        if (otp.every((digit) => digit !== "")) {
            onSubmit(otp.join(""));
        }
    }, [otp]);

    return (
        <form onSubmit={handleSubmit} className={`w-full rounded-xl shadow-lg border p-8 
            ${theme === "dark" ? "bg-surface-dark" : "bg-surface-base"}`}>
            <p>We have sent the verification code to your email address</p>
            <div className="flex justify-between gap-2 mt-10" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => {
                            if (el) inputsRef.current[index] = el;
                        }}
                        className="w-[48px] h-[55px] text-center text-2xl font-semibold border border-border-primary rounded-xl placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-border-primary"
                    />
                ))}
            </div>
            <div className="flex gap-4 mt-6">
                <Button
                    isLoading={isLoading}
                    text="Submit"
                    className="w-full bg-primary-DEFAULT"
                    loadingColor="#ffffff"
                    type="submit"
                />
                <Button
                    isLoading={false}
                    text="Resend"
                    className="bg-secondary text-white"
                    type="button"
                    onClick={handleResend}
                />
            </div>
        </form>
    );
};

export default OTPInput;
