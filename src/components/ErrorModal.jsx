import React from 'react'
import { X, AlertCircle } from 'lucide-react'

const ErrorModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            {/* Error Modal Content */}
            <div
                className="relative w-full max-w-2xl bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-[32px] border-4 border-white shadow-2xl p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all hover:scale-110 active:scale-95 z-10 group"
                >
                    <X className="w-6 h-6 text-red-600 group-hover:text-red-700 transition-colors" />
                </button>

                {/* Error Icon */}
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 p-6 bg-white rounded-full shadow-lg">
                        <AlertCircle className="w-16 h-16 text-orange-600" />
                    </div>

                    {/* Error Message */}
                    <div className="max-w-lg">
                        <h2 className="text-3xl font-black bg-gradient-to-r from-orange-700 via-red-700 to-orange-700 bg-clip-text text-transparent mb-6">
                            Oops! 😅
                        </h2>
                        <p className="text-amber-950 text-lg leading-relaxed whitespace-pre-wrap">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorModal
