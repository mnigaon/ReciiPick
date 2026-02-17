import React from 'react'
import ChefCharacter from './ChefCharacter'

const LoadingScreen = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Animated Headline */}
            <div className="mb-8 text-center animate-pulse">
                <h2 className="text-4xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                    I'm building a special recipe for you...
                </h2>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>

            {/* Chef Character - Centered */}
            <div className="transform scale-125">
                <ChefCharacter isLoading={false} isSpeaking={false} />
            </div>
        </div>
    )
}

export default LoadingScreen
