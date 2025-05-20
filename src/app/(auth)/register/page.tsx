import { Metadata } from 'next';
import RegisterForm from "@/components/auth/register";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Sign Up',
    };
}

const Register = () => {
    return <RegisterForm />;
};

export default Register;