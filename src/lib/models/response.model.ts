export interface IServerResponse<T> {
    data: T;
    status: {
        code: number;
        message: string;
    };
    error: string | null;
}
