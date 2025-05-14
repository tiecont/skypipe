import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {DefaultSession, Session} from "next-auth";

// Define the custom users type for your session
interface CustomSession extends Session {
    user: DefaultSession['user'] &  {
        id: string | never;
        profile?: {
            email?: string;
            name?: string;
            profile_image_url_https?: string | null;
            profile_background_image_url_https?: string;
            profile_background_color?: string;
        };
        accessToken: string | never;
        accessTokenSecret: string | never;
    };
}

const useCachedSession = () => {
    const [session, setSession] = useState<CustomSession | null>(null); // Correctly typed session state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const cachedSession = await getSession();
                if (cachedSession) {
                    setSession(cachedSession as CustomSession); // Cast to CustomSession
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    return { session, loading };
};

export default useCachedSession;