// import { defaultLocale } from '@/i18n/config';
import useToast from '@/hooks/useToast';
import { KEY_COOKIES } from '@/lib/constants/auth.constants';
// import { getClientCookie } from '@/lib/cookies.client';
import CryptoJS from 'crypto-js';
import {format, formatDistanceToNow, isToday} from "date-fns";

const secretKey = 'secretbtctothemonfjsejg$^sdfegsb';

export function getFromLocalStorage(key: string) {
    if (typeof window === 'undefined') return null; // Kiểm tra nếu chạy server-side
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
}

export function setToLocalStorage(key: string, value: string) {
    if (typeof window === 'undefined') return; // Kiểm tra nếu chạy server-side

    localStorage.setItem(key, JSON.stringify(value));
}

export function deleteFromLocalStorage(key: string) {
    if (typeof window === 'undefined') return; // Kiểm tra nếu chạy server-side
    localStorage.removeItem(key);
}

export function getFromSessionStorage(key: string): string | null {
    if (typeof sessionStorage !== 'undefined') {
        return sessionStorage.getItem(key);
    }
    return null;
}

export const formatUDID = (
    udid: string,
    startLength: number,
    endLength: number,
) => {
    try {
        if (udid.length <= startLength + endLength) {
            return udid; // Nếu chuỗi quá ngắn, không cần ẩn
        }

        const start = udid.slice(0, startLength); // Lấy phần đầu chuỗi
        const end = udid.slice(-endLength); // Lấy phần cuối chuỗi
        return `${start}...${end}`; // Ghép lại thành chuỗi với dấu ba chấm ở giữa
    } catch {
        return '';
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Đang chờ':
            return 'text-red-500 bg-bg-error'; // Màu đỏ cho trạng thái "Đang chờ"
        case 'Hoàn thành':
            return 'text-green-500 bg-bg-success'; // Màu xanh cho trạng thái "Hoàn thành"
        default:
            return 'text-gray-500 bg-success'; // Màu xám cho các trạng thái khác
    }
};

export const useCopyUrl = () => {
    const { showSuccess, showError } = useToast();
    const handleCopyUrl = (
        url: string,
        txtSuccess: string,
        txtError: string,
    ) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(url)
                .then(() => showSuccess(txtSuccess))
                .catch(() => showError(txtError));
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showSuccess(txtSuccess);
            } catch {
                showError(txtError);
            }
            document.body.removeChild(textArea);
        }
    };
    return { handleCopyUrl };
}


export const useDownloadImage = () => {
    const { showSuccess, showError } = useToast();
    const downloadImage = (
        url: string,
        name: string,
        txtSuccess: string,
        txtError: string,
    ) => {

        try {
            const link = document.createElement('a');
            link.href = url;
            link.download = name; //Name file when download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSuccess(txtSuccess);
        } catch {
            showError(txtError);
        }
    };
    return { downloadImage }
}

export function encryptData(data: string) : string {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

export function decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const expiryDate = (days: number) => {
    const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return expiryDate;
};

export const DAY_COOKIE_EXPIRY = 1;
export const MONTH_COOKIE_EXPIRY = 30;

export const saveInfoUser = async (email: string, password: string) => {
    const loginInfo = {
        email: email,
        password: password,
    };

    // Mã hóa thông tin trước khi lưu
    const encryptInfoUser: string = encryptData(JSON.stringify(loginInfo));

    setToLocalStorage(KEY_COOKIES.SAVE_INFO, encryptInfoUser);
};

export const deleteSaveInfoUser = async () => {
    deleteFromLocalStorage(KEY_COOKIES.SAVE_INFO);
};

export const getInfoSaved = () => {
    try {
        const info = getFromLocalStorage(KEY_COOKIES.SAVE_INFO);
        if (info && info != '') {
            const encryptInfoUser = decryptData(info);
            return JSON.parse(encryptInfoUser);
        }

        return null;
    } catch {
        return null;
    }
};

export const formatCurrencyVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    })
        .format(amount)
        .replace('₫', 'VND')
        .replaceAll('.', ',');
};

export const formatCurrencyUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2, // Hiển thị 2 chữ số sau dấu thập phân
    })
        .format(amount)
        .replaceAll('.', ',');
};

export const formatCurrency = (amount: number) => {
    return formatCurrencyVND(amount).replaceAll('.', ',');
};

export const getDomain = () => {
    if (typeof window !== 'undefined') {
        return window.location.origin; // Trả về domain với giao thức
    }
    return '';
};

export const formatDateForAdmin = (isoString: string) => {
    try {
        if (isoString == '') return '';
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        return `${day}/${month}/${year}`; // Trả về định dạng mong muốn
    } catch {
        return '';
    }
};

export const formatDateTime = (dateString: string) => {
    try {
        if (dateString == '') {
            return '';
        }
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    } catch {
        return '';
    }
};

export function getTimeComponents(dateString: string) {
    try {
        if (dateString == '') {
            return {
                day: '0',
                hours: '0',
                minutes: '0',
            };
        }
        const date = new Date(dateString);

        // Lấy các thành phần ngày, giờ và phút
        const day = date.getUTCDate(); // Ngày trong tháng
        const hours = date.getUTCHours(); // Giờ (theo định dạng 24h)
        const minutes = date.getUTCMinutes(); // Phút

        return { day, hours, minutes };
    } catch {
        return {
            day: '0',
            hours: '0',
            minutes: '0',
        };
    }
}

export function formatTimeDifference(futureDateStr: string): string {
    if (futureDateStr == '') return '';
    try {
        const futureDate = new Date(futureDateStr);
        const now = new Date();

        // Tính toán sự khác biệt
        const differenceInMillis = futureDate.getTime() - now.getTime();

        // Chuyển đổi sự khác biệt thành ngày và giờ
        const differenceInSeconds = Math.floor(differenceInMillis / 1000);
        const days = Math.floor(differenceInSeconds / (3600 * 24));
        const hours = Math.floor((differenceInSeconds % (3600 * 24)) / 3600);

        // Định dạng kết quả
        let result = '';
        if (days > 0) {
            result += `${days} ngày `;
        }
        result += `${hours} giờ`;

        return result.trim();
    } catch {
        return '';
    }
}

export const formatNumberWithCommas = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function isValidUDID(udid: string) {
    const fortyCharPattern = /^[a-f0-9]{40}$/i;
    const hyphenatedPattern = /^[a-f0-9]{8}-[a-f0-9]{16}$/i;
    return fortyCharPattern.test(udid) || hyphenatedPattern.test(udid);
}

export function getColorForDate(date: string): {
    bg: string;
    titleColor: string;
    textColor: string;
    borderColor: string;
} {
    if (date == '') {
        return {
            bg: 'bg-bg-error',
            titleColor: 'text-error',
            textColor: 'text-error',
            borderColor: 'border-error',
        };
    }

    const endTime = new Date(date); // Chuyển đổi chuỗi thành đối tượng Date
    const currentTime = new Date(); // Thời gian hiện tại

    const timeDiff = endTime.getTime() - currentTime.getTime();

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (days < 30) {
        return {
            bg: 'bg-bg-error',
            titleColor: 'text-error',
            textColor: 'text-error',
            borderColor: 'border-error',
        };
    } else {
        return {
            bg: 'bg-gray-subtle',
            titleColor: 'text-text-thrid',
            textColor: 'text-text-tertiary',
            borderColor: 'border-border-primary',
        };
    }
}

export function getRemainingTime(appleReviewEndTime: string): {
    days: string;
    hours: string;
    minutes: string;
} {
    if (appleReviewEndTime == '') {
        return { days: '00', hours: '00', minutes: '00' };
    }

    const endTime = new Date(appleReviewEndTime); // Chuyển đổi chuỗi thành đối tượng Date
    const currentTime = new Date(); // Thời gian hiện tại

    // Tính toán chênh lệch thời gian
    const timeDiff = endTime.getTime() - currentTime.getTime();

    if (timeDiff < 0) {
        return { days: '00', hours: '00', minutes: '00' };
    }

    // Tính toán các đơn vị thời gian
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    // Đảm bảo các giá trị luôn có hai chữ số
    const formattedDays = String(days).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    // Trả về chuỗi thời gian còn lại
    return {
        days: formattedDays,
        hours: formattedHours,
        minutes: formattedMinutes,
    };
}


export const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (isToday(parsedDate)) {
        // If it's today, show time relative to now
        return formatDistanceToNow(parsedDate, { addSuffix: true });
    } else {
        // If it's in the past, show the date (e.g., Jan 12)
        return format(parsedDate, "MMM d");
    }
};

export const formatCount = (count: number): string => {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
};