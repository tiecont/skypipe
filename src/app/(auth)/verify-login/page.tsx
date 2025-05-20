import { Metadata } from 'next';
import VerifyLogin from "@/components/auth/verify/login";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Verify Login',
    };
}

const VerifyLoginPage = () => {
    return <VerifyLogin />;
};

export default VerifyLoginPage;