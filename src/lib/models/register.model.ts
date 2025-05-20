export interface Plan {
    id: string;
    name: string;
    price: number;
    max_projects: number;
    max_users: number;
    recommended?: boolean;
}

export interface CountryCode {
    code: string;
    name: string;
    flag: string;
}

export interface SelectOption {
    value: string;
    label: string;
    flag?: string;
}

export interface PlanCardProps {
    name: string;
    price: string;
    selected: boolean;
    onClick: () => void;
    maxProjects: number;
    maxUsers: number;
    recommended?: boolean;
}