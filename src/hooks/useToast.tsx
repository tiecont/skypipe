import toast from 'react-hot-toast';

const useToast = () => {
    const showSuccess = (message: string) => {
        toast.success(message, {
            position: 'top-right',
            duration: 3000,
            icon: '✔',
            style: {
                border: '1px solid #22C55E',
                color: '##0A0A0A',
                background: '#F0FDF4',
                boxShadow: 'none',
                fontFamily: 'HarmonyOSSans',
                fontSize: 18,
                fontStyle: 'normal',
            },
        });
    };

    const showError = (message: string) => {
        toast.error(message, {
            position: 'top-right',
            duration: 3000,
            icon: '❗',
            style: {
                border: '1px solid #EF4444',
                color: '##0A0A0A',
                boxShadow: 'none',
                background: '#FEF2F2',
                fontFamily: 'HarmonyOSSans',
                fontSize: 18,
                fontStyle: 'normal',
            },
        });
    };

    const showWarning = (message: string) => {
        toast(message, {
            icon: '🔁',
            position: 'top-right',
            duration: 3000,
            style: {
                border: '1px solid #ffa726',
                color: '##0A0A0A',
                boxShadow: 'none',
                background: '#FFF7ED',
                fontFamily: 'HarmonyOSSans',
                fontSize: 18,
                fontStyle: 'normal',
            },
        });
    };

    return { showSuccess, showError, showWarning };
};

export default useToast;