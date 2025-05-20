import { Metadata } from 'next';
import LoginForm from "@/components/auth/login";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Sign In',
    };
}

const Login = () => {
    return <LoginForm />;
};

export default Login;