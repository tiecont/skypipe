export interface UserModel {
    id: string;
    email: string;
    name: string;
    plan_id: string;
    password: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    status: boolean;
    user_id: string;
    full_name: string;
    bio: string;
    avatar_url: string;
    gender: "Male" | "Female" | "Other" | string;
    birthday: string | null;
    phone: string;
    address: string;
    country: string;
    city: string;
    updated_by: string;
}