import React from 'react'
import { Sparkles } from 'lucide-react'

const ChefCharacter = ({ isLoading, isSpeaking }) => {
    return (
        <div className="relative flex flex-col items-center">
            <div className="relative">
                {/* Image-based Chef Character - Size increased significantly */}
                <div className={`w-48 h-48 md:w-64 md:h-64 relative transition-all duration-300 ${isSpeaking ? 'animate-chef-wave' : ''} ${isLoading ? 'animate-pulse scale-110' : ''}`}>
                    <img
                        src="/chef.png"
                        alt="AI Chef"
                        className="w-full h-full object-contain drop-shadow-2xl"
                    />
                </div>

                {/* Loading Indicator Sparkles */}
                {isLoading && (
                    <div className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-xl animate-bounce">
                        <Sparkles className="text-yellow-500 w-8 h-8" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChefCharacter
