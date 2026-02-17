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
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[9999] animate-bounce-in">
            <div className={`
                flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border-2
                ${isSuccess
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-red-50 border-red-200 text-red-900'}
            `}>
                {isSuccess ? (
                    <CheckCircle className={`w-6 h-6 ${isSuccess ? 'text-amber-600' : 'text-red-500'}`} />
                ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                )}

                <span className="font-bold text-lg">{message}</span>

                <button
                    onClick={onClose}
                    className={`ml-2 p-1 rounded-full hover:bg-black/5 transition-colors`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
