import React, { useEffect, useRef } from 'react'
import ChefCharacter from './ChefCharacter'
import { Bookmark } from 'lucide-react'

const MessageHistory = ({ messages, isLoading, isSpeaking, onSaveRecipe, savedRecipes = [] }) => {
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div
            ref={scrollRef}
            className={`w-full max-w-4xl h-full overflow-y-auto px-8 py-12 space-y-12 scroll-smooth scrollbar-hide flex flex-col items-center`}
        >
            {messages.map((msg, index) => {
                const isLastAi = msg.role === 'ai' && index === messages.findLastIndex(m => m.role === 'ai');

                return (
                    <div
                        key={msg.id}
                        className={`flex w-full animate-slideUp gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end'}`}
                    >
                        {msg.role === 'ai' && (
                            <div className="shrink-0 mb-[-10px] ml-[-20px]">
                                <ChefCharacter
                                    isLoading={isLastAi && isLoading}
                                    isSpeaking={isLastAi && isSpeaking}
                                />
                            </div>
                        )}

                        <div className={`group relative max-w-[85%] p-8 rounded-[40px] shadow-xl transition-all hover:shadow-orange-100 ${msg.role === 'user'
                            ? 'bg-amber-100/60 text-amber-900 rounded-tr-none border-2 border-amber-200/50 ml-auto'
                            : 'bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 rounded-tl-none border-4 border-white shadow-[0_20px_40px_rgba(217,119,6,0.15)] font-medium'
                            }`}>

                            {/* Speech Bubble Tail for AI - Matched with new background */}
                            {msg.role === 'ai' && (
                                <div className="absolute bottom-10 -left-4 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[20px] border-amber-50" />
                            )}

                            <div className="leading-relaxed whitespace-pre-wrap text-xl text-amber-950">
                                {msg.text}
                            </div>


                            {msg.role === 'ai' && !isLoading && msg.id !== 1 && (() => {
                                const isSaved = savedRecipes.some(saved =>
                                    saved.text.trim() === msg.text.trim()
                                );
                                return (
                                    <button
                                        onClick={() => {
                                            if (isSaved) {
                                                alert('This recipe is already saved!');
                                            } else {
                                                onSaveRecipe(msg);
                                            }
                                        }}
                                        className={`absolute -right-4 -bottom-4 p-4 bg-white rounded-full shadow-lg border transition-all z-20 ${isSaved
                                                ? 'border-amber-600 text-amber-600 bg-amber-50'
                                                : 'border-amber-100 text-amber-700 hover:bg-amber-600 hover:text-white hover:scale-110 active:scale-90'
                                            }`}
                                        title={isSaved ? 'Already Saved' : 'Save Recipe'}
                                    >
                                        <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default MessageHistory
