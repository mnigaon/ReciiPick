import React from 'react'
import { X, Bookmark } from 'lucide-react'

const RecipeModal = ({ recipe, onClose, user, onSave, onLoginRequired, isSaved = false }) => {
    if (!recipe) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            {/* Modal Content - Menu Style */}
            <div
                className="relative w-full max-w-3xl max-h-[90dvh] sm:max-h-[85vh] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-t-[32px] sm:rounded-[32px] border-4 border-white shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all hover:scale-110 active:scale-95 z-10 group"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800 group-hover:text-red-600 transition-colors" />
                </button>

                {/* Menu Header - Fixed */}
                <div className="text-center pt-8 sm:pt-12 pb-4 sm:pb-8 px-6 sm:px-8 border-b-4 border-amber-200/50 flex-shrink-0">
                    <div className="inline-block mb-2 sm:mb-4">
                        <span className="text-4xl sm:text-6xl">🍽️</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent mb-2 sm:mb-3">
                        {recipe.title}
                    </h2>
                </div>

                {/* Recipe Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-10">
                    <div className="bg-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-amber-200/30 shadow-inner">
                        <pre className="whitespace-pre-wrap font-sans text-sm sm:text-lg text-amber-950 leading-relaxed">
                            {recipe.text}
                        </pre>
                    </div>
                </div>

                {/* Action Footer - Fixed */}
                {!isSaved && (
                    <div className="text-center pb-6 sm:pb-8 px-6 sm:px-8 pt-4 sm:pt-6 border-t-2 border-amber-200/30 flex-shrink-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
                        <button
                            onClick={() => {
                                if (!user) {
                                    onLoginRequired();
                                } else {
                                    onSave(recipe);
                                }
                            }}
                            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-bold text-base sm:text-lg"
                        >
                            <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span>Save Recipe</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecipeModal
