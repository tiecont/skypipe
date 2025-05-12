export interface UserModel {
    profile_pic?: string;
    background_color?: string;
    cover_photo?: string | null;
    created_at?: string;
    updated_at?: string;
    role_id?: number;
    bio?: string;
    birthday?: string | null;
    email?: string;
    googleId?: string | null;
    id: number | null;
    phone_number?: number | string | null;
    password?: string;
    location?: string;
    twitter_id?: string;
    status?: number | string | null;
    sex?: string;
    user_id: number | null;
    username?: string | null;
}