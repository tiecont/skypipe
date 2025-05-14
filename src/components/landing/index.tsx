'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import React from "react";

const features: string[] = [
    "Automatic GitHub Integration",
    "One-click Kubernetes Deployment",
    "Real-time Monitoring & Alerts",
    "Secure Environment Management",
    "CI/CD with YAML Editor",
    "Team & Role Management",
];

const MotionH2 = motion('h2');

const LandingPage: React.FC = () => {
    return (
        <div className="bg-surface-base dark:bg-surface-dark text-text min-h-screen">
            {/* Header */}
            <header className="px-6 py-4 flex justify-between items-center shadow-md bg-white dark:bg-surface-dark">
                <h1 className="text-2xl font-bold text-primary">Skypipe</h1>
                <nav className="space-x-6">
                    <a href="#features" className="hover:text-primary-dark">
                        Features
                    </a>
                    <a href="#pricing" className="hover:text-primary-dark">
                        Pricing
                    </a>
                    <a href="#login" className="hover:text-primary-dark">
                        Login
                    </a>
                    <Button className="bg-primary text-white hover:bg-primary-dark rounded-xl">
                        Get Started
                    </Button>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="px-6 py-20 text-center bg-surface-muted dark:bg-surface-dark">
                <MotionH2
                    className="text-4xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Deploy your DevOps pipeline in one click 🚀
                </MotionH2>
                <p className="text-lg text-text-muted max-w-xl mx-auto mb-8">
                    Automate CI/CD, manage teams, configure environments, and track costs — all in one modern platform.
                </p>
                <Button className="bg-primary text-white hover:bg-primary-dark rounded-xl text-lg px-6 py-3">
                    Start Free
                </Button>
                <p className="mt-4 text-sm text-muted">No credit card required</p>
            </section>

            {/* Features Section */}
            <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-12">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="rounded-2xl shadow-soft">
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
                <Button className="bg-white text-primary hover:bg-surface-muted text-lg px-6 py-3 rounded-xl">
                    Start Free
                </Button>
            </section>

            {/* Footer */}
            <footer className="px-6 py-10 text-center text-text-muted text-sm bg-surface-muted dark:bg-surface-dark">
                <p>&copy; 2025 Skypipe. All rights reserved.</p>
                <div className="mt-2 space-x-2">
                    <a href="#" className="hover:text-primary">Privacy Policy</a>
                    <span>&bull;</span>
                    <a href="#" className="hover:text-primary">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
