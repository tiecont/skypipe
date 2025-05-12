export const AUTH_COOKIE_NAME = 'cookie';
export const AUTH_ERROR_MAPPINGS = {
    EMAIL_EXISTS: {
        title: 'Email already exists',
        description:
            'The email is taken. You need to use a different email for registration',
    },
    INVALID_PASSWORD: {
        title: 'Password is invalid',
        description: 'The password is incorrect for the given email address',
    },
    EMAIL_NOT_FOUND: {
        title: 'Email not found',
        description: 'Looks like the email is not registered yet.',
    },
};
// # Mã hóa tất cả các giá trị bằng base64
export const KEY_COOKIES = {
    TOKEN: 'VE9LRU4U',
    REFRESH_TOKEN: 'VA2LRU5E',
    USER: 'VVNFUggV',
    LOCALE: 'TE9DQUxF',
    SAVE_INFO: 'U0FWRV9JTkZP',
};