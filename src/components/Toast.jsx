import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed top-20 sm:top-24 left-1/2 transform -translate-x-1/2 z-[9999] animate-bounce-in w-[90%] sm:w-auto max-w-sm sm:max-w-none">
            <div className={`
                flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl border-2
                ${isSuccess
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-red-50 border-red-200 text-red-900'}
            `}>
                {isSuccess ? (
                    <CheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${isSuccess ? 'text-amber-600' : 'text-red-500'}`} />
                ) : (
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-red-500" />
                )}

                <span className="font-bold text-sm sm:text-lg flex-1">{message}</span>

                <button
                    onClick={onClose}
                    className={`ml-1 sm:ml-2 p-1 rounded-full hover:bg-black/5 transition-colors flex-shrink-0`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
