import createAxiosInstance from "@/lib/axios";
import {API} from "@/lib/constants/api.constants";
import {ILogin, IRegister, IVerifyLogin} from "@/lib/models/auth.model";

const axiosInstance = createAxiosInstance()
const login = (data: ILogin) => axiosInstance.post(API.LOGIN, data);
const register = (data: IRegister) => axiosInstance.post(API.REGISTER, data);
const verifyLogin = (data: IVerifyLogin) => axiosInstance.post(API.VERIFY_LOGIN, data)
export { login, register, verifyLogin };
