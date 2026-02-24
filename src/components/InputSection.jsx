import React, { useRef } from 'react'
import { Camera, Utensils, X } from 'lucide-react'

const InputSection = ({ inputValue, setInputValue, onSend, onImageUpload, previewImage, setPreviewImage, isLoading }) => {
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result)
                onImageUpload(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSend()
        }
    }

    return (
        <div className="w-full max-w-4xl pb-0 pt-0 z-40 transition-all duration-500">
            {/* Image Preview Area */}
            {previewImage && (
                <div className="flex justify-center mb-3 sm:mb-6 animate-slideUp">
                    <div className="relative">
                        <img src={previewImage} alt="Preview" className="h-28 w-28 sm:h-44 sm:w-44 object-cover rounded-[24px] sm:rounded-[32px] border-4 sm:border-8 border-white shadow-2xl ring-1 ring-orange-100" />
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 sm:p-2 rounded-full shadow-2xl hover:bg-red-600 transition-all hover:scale-110 active:scale-90"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Input Bar */}
            <div className={`flex items-center gap-2 sm:gap-4 bg-amber-50/90 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] p-1.5 sm:p-2 px-2 sm:px-4 border-4 border-white shadow-[0_20px_50px_rgba(217,119,6,0.12)] transition-all focus-within:border-amber-300 focus-within:shadow-[0_20px_50px_rgba(217,119,6,0.25)] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="p-2.5 sm:p-4 hover:bg-amber-100 rounded-xl sm:rounded-2xl transition-all text-amber-700 hover:text-amber-800 active:scale-95 flex-shrink-0"
                >
                    <Camera className="w-6 h-6 sm:w-9 sm:h-9" />
                </button>

                <textarea
                    rows="1"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Tell me your ingredients..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none py-3 sm:py-4 text-base sm:text-xl text-amber-950 placeholder-amber-400 font-bold resize-none max-h-32"
                />

                <button
                    onClick={onSend}
                    disabled={isLoading || (!inputValue.trim() && !previewImage)}
                    className={`p-3.5 sm:p-5 bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-[18px] sm:rounded-[24px] transition-all shadow-xl shadow-amber-600/30 active:scale-95 disabled:opacity-30 disabled:shadow-none flex-shrink-0 ${isLoading ? 'animate-pulse' : 'hover:scale-105 hover:-rotate-2'}`}
                >
                    <Utensils className={`w-5 h-5 sm:w-7 sm:h-7 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    )
}

export default InputSection
