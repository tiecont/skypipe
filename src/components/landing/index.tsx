'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "@/animation-router/patch-router/router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Moon, Sun } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes.contants";
import {getFromLocalStorage, setToLocalStorage} from "@/lib/helper";

const features: string[] = [
    "Automatic GitHub Integration",
    "One-click Kubernetes Deployment",
    "Real-time Monitoring & Alerts",
    "Secure Environment Management",
    "CI/CD with YAML Editor",
    "Team & Role Management",
];

const MotionH2 = motion<'h2'>('h2');

const LandingPage: React.FC = () => {
    const router = useRouter();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Check for saved theme preference or system preference
        const savedTheme = getFromLocalStorage("theme");
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialTheme = savedTheme
            ? savedTheme as 'light' | 'dark'
            : systemPrefersDark ? 'dark' : 'light';

        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    const toggleTheme = (): void => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setToLocalStorage("theme", newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleClickStart = (): void => {
        router.push(ROUTES.AUTH_SIGNIN);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark'
                ? 'bg-surface-dark text-white'
                : 'bg-surface-base text-text'
        }`}>
            {/* Header */}
            <header className={`px-6 py-4 flex justify-between items-center shadow-md transition-colors duration-300 ${
                theme === 'dark' ? 'bg-surface-dark' : 'bg-primary-DEFAULT'
            }`}>
                <h1 className="text-2xl font-bold text-primary">Skypipe</h1>
                <nav className="flex items-center space-x-6">
                    <a href="#features" className="hover:text-primary-dark dark:hover:text-primary transition-colors">
                        Features
                    </a>
                    <a href="#pricing" className="hover:text-primary-dark dark:hover:text-primary transition-colors">
                        Pricing
                    </a>
                    <a href="#login" className="hover:text-primary-dark dark:hover:text-primary transition-colors">
                        Login
                    </a>
                    <Button
                        className="bg-primary text-white hover:bg-primary-dark rounded-xl transition-colors"
                        onClick={handleClickStart}
                    >
                        Get Started
                    </Button>
                    <Button
                        onClick={toggleTheme}
                        className="ml-2"
                        aria-label="Toggle theme"
                        variant="ghost"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 text-yellow-300" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-700" />
                        )}
                    </Button>
                </nav>
            </header>

            {/* Hero Section */}
            <section className={`px-6 py-20 text-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-surface-dark' : 'bg-surface-muted'
            }`}>
                <MotionH2
                    className={`text-4xl font-bold mb-4 ${
                        theme === 'dark' ? 'text-text-base' : 'text-text-muted'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Deploy your DevOps pipeline in one click 🚀
                </MotionH2>
                <p className={`text-lg max-w-xl mx-auto mb-8 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-text-base' : 'text-text-muted'
                }`}>
                    Automate CI/CD, manage teams, configure environments, and track costs — all in one modern platform.
                </p>
                <Button
                    className={`bg-accent-info text-white hover:bg-primary-dark rounded-xl text-lg px-6 py-3 transition-colors hover:cursor-pointer
                    ${ theme === 'dark' ? 'text-text-base' : 'text-surface-dark bg-primary-light hover:bg-accent-success' }`}
                    onClick={handleClickStart}
                >
                    Start Free
                </Button>
                <p className={`mt-4 text-sm transition-colors duration-300 ${
                    theme === 'dark' ? 'text-text-base' : 'text-text-muted'
                }`}>
                    No credit card required
                </p>
            </section>

            {/* Features Section */}
            <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
                <h3 className={`text-2xl font-bold text-center mb-12  ${
                    theme === 'dark' ? 'text-text-base' : 'text-text-muted'
                }`}>Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature: string, index: number) => (
                        <Card
                            key={index}
                            className={`rounded-2xl shadow-soft transition-colors duration-300 hover:bg-primary-light hover:cursor-pointer ${
                                theme === 'dark' ? 'bg-surface-dark text-text-base' : 'bg-primary-light text-text-muted'
                            }`}
                        >
                            <CardContent className="p-6 flex items-start space-x-3">
                                <CheckCircle className="text-primary w-6 h-6" />
                                <p>{feature}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="px-6 py-20 text-center bg-primary text-white">
                <h4 className="text-3xl font-semibold mb-4">
                    Ready to accelerate your DevOps workflow?
                </h4>
                <p className="mb-6 text-lg">
                    Sign up now to access the most advanced deployment and monitoring tools.
                </p>
                <Button
                    className={`text-lg px-6 py-3 rounded-xl transition-colors ${
                        theme === 'dark'
                            ? 'bg-white text-primary hover:bg-gray-200'
                            : 'bg-white text-primary hover:bg-surface-muted'
                    }`}
                    onClick={handleClickStart}
                >
                    Start Free
                </Button>
            </section>

            {/* Footer */}
            <footer className={`px-6 py-10 text-center text-sm transition-colors duration-300 ${
                theme === 'dark'
                    ? 'bg-surface-dark text-gray-400'
                    : 'bg-surface-muted text-text-muted'
            }`}>
                <p>&copy; 2025 Skypipe. All rights reserved.</p>
                <div className="mt-2 space-x-2">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <span>&bull;</span>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;