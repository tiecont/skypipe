import {Moon, Sun} from "lucide-react";
import React from "react";
import Button from "@/components/ui/button";
import {ROUTES} from "@/lib/constants/routes.constants";
import {useRouter} from "@/animation-router/patch-router/router";
import {useTheme} from "@/context/ThemeContext";

const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter()

    const handleClickStart = (): void => {
        router.push(ROUTES.AUTH_SIGNIN);
    };
    return (
        <><header className={`px-6 py-4 flex justify-between items-center shadow-md transition-colors duration-300 ${
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
                    className="bg-primary text-white hover:bg-primary-dark rounded-xl transition-colors hover:cursor-pointer"
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
        </header></>
    )
}

export default Header;