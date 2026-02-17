import React from 'react'
import { X, Bookmark } from 'lucide-react'

const RecipeModal = ({ recipe, onClose, user, onSave, onLoginRequired }) => {
    if (!recipe) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            {/* Modal Content - Menu Style */}
            <div
                className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-[32px] border-4 border-white shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all hover:scale-110 active:scale-95 z-10 group"
                >
                    <X className="w-6 h-6 text-amber-800 group-hover:text-red-600 transition-colors" />
                </button>

                {/* Menu Header - Fixed */}
                <div className="text-center pt-12 pb-8 px-8 border-b-4 border-amber-200/50 flex-shrink-0">
                    <div className="inline-block mb-4">
                        <span className="text-6xl">🍽️</span>
                    </div>
                    <h2 className="text-4xl font-black bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent mb-3">
                        {recipe.title}
                    </h2>
                </div>

                {/* Recipe Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-10">
                    <div className="bg-white/60 rounded-3xl p-8 border-2 border-amber-200/30 shadow-inner">
                        <pre className="whitespace-pre-wrap font-sans text-lg text-amber-950 leading-relaxed">
                            {recipe.text}
                        </pre>
                    </div>
                </div>

                {/* Action Footer - Fixed */}
                <div className="text-center pb-8 px-8 pt-6 border-t-2 border-amber-200/30 flex-shrink-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
                    <button
                        onClick={() => {
                            if (!user) {
                                onLoginRequired();
                            } else {
                                onSave(recipe);
                            }
                        }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-bold text-lg"
                    >
                        <Bookmark className="w-6 h-6" />
                        <span>Save Recipe</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RecipeModal
