import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Sign In',
    };
}

const Login = () => {
    return "Sign In Page";
};

export default Login;