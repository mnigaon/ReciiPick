import React, { useEffect, useRef } from 'react'
import ChefCharacter from './ChefCharacter'
import { Bookmark } from 'lucide-react'

const MessageHistory = ({ messages, isLoading, isSpeaking, onSaveRecipe }) => {
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
                            ? 'bg-white/95 text-orange-950 rounded-tr-none border-2 border-orange-50 ml-auto'
                            : 'bg-white/95 text-orange-950 rounded-tl-none border-4 border-orange-500/10 font-medium'
                            }`}>

                            {/* Speech Bubble Tail for AI - Matched with new background */}
                            {msg.role === 'ai' && (
                                <div className="absolute bottom-10 -left-4 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[20px] border-white/95" />
                            )}

                            <div className="leading-relaxed whitespace-pre-wrap text-xl">
                                {msg.text}
                            </div>

                            {msg.role === 'ai' && !isLoading && msg.id !== 1 && (
                                <button
                                    onClick={() => onSaveRecipe(msg)}
                                    className="absolute -right-4 -bottom-4 p-4 bg-white rounded-full shadow-lg border border-orange-50 text-orange-500 hover:scale-110 active:scale-90 transition-all z-20 group-hover:bg-orange-500 group-hover:text-white"
                                    title="Save Recipe"
                                >
                                    <Bookmark className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default MessageHistory
