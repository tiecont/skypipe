export interface IRegister {
    name: string;
    full_name: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    country: string;
    city: string;
    plan_id: string;
    captcha: string;
    countryCode: string;
}
export interface ILogin {
    email: string;
    password: string;
}

export interface IVerifyLogin {
    email: string;
    code: string;
}
export interface IUserInformation {
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    country: string;
    city: string;
    plan_id: string;
    name: string;
    teamId: string[] | null;
}