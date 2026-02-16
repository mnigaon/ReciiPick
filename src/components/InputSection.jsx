import React, { useRef } from 'react'
import { Camera, Send, X } from 'lucide-react'

const InputSection = ({ inputValue, setInputValue, onSend, onImageUpload, previewImage, setPreviewImage, isLoading }) => {
    const fileInputRef = useRef(null)

    const tags = ['🥚 Easy Breakfast', '🍝 15min Meal', '🥗 Healthy Diet', '🍺 Party Snacks']

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
        <div className="w-full max-w-4xl px-8 pb-4 pt-0 z-40 transition-all duration-500">
            {/* Image Preview Area */}
            {previewImage && (
                <div className="flex justify-center mb-6 animate-slideUp">
                    <div className="relative">
                        <img src={previewImage} alt="Preview" className="h-44 w-44 object-cover rounded-[32px] border-8 border-white shadow-2xl ring-1 ring-orange-100" />
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-2xl hover:bg-red-600 transition-all hover:scale-110 active:scale-90"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Input Bar - Now more substantial as it's the primary element */}
            <div className={`flex items-center gap-4 bg-white/90 backdrop-blur-xl rounded-[32px] p-2 px-4 border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all focus-within:border-orange-400 focus-within:shadow-[0_20px_50px_rgba(255,165,0,0.2)] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                    className="p-4 hover:bg-orange-50 rounded-2xl transition-all text-orange-500 hover:text-orange-600 active:scale-95"
                >
                    <Camera className="w-9 h-9" />
                </button>

                <textarea
                    rows="1"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Tell me your ingredients... (e.g. Eggs, Onion)"
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none py-4 text-xl text-orange-950 placeholder-orange-200 font-bold resize-none max-h-32"
                />

                <button
                    onClick={onSend}
                    disabled={isLoading || (!inputValue.trim() && !previewImage)}
                    className={`p-5 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-[24px] transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-30 disabled:shadow-none ${isLoading ? 'animate-pulse' : 'hover:scale-105 hover:-rotate-2'}`}
                >
                    <Send className={`w-7 h-7 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
                {tags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => !isLoading && setInputValue(tag.substring(tag.indexOf(' ') + 1))}
                        className="text-sm px-6 py-2.5 rounded-full bg-white/80 text-orange-800 hover:bg-orange-500 hover:text-white transition-all font-extrabold border-2 border-white shadow-sm hover:shadow-lg active:scale-95"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default InputSection
