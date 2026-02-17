import React, { useState } from 'react'
import { ArrowLeft, Heart, Trash2, BookOpen } from 'lucide-react'
import RecipeModal from './RecipeModal'

const MyRecipesPage = ({ savedRecipes, onBack, onDeleteRecipe }) => {
    const [selectedRecipe, setSelectedRecipe] = useState(null)
    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="w-full px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button and Title - Same Line */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-900 rounded-[18px] shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-amber-200 hover:border-amber-300 font-bold group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </button>

                        {/* Title - Center */}
                        <h1 className="text-5xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent absolute left-1/2 transform -translate-x-1/2">
                            My Recipes
                        </h1>

                        {/* Spacer for balance */}
                        <div className="w-[100px]"></div>
                    </div>

                    {/* Recipe Count - Below */}
                    <div className="text-center">
                        <span className="inline-block bg-gradient-to-br from-amber-600 to-orange-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg">
                            {savedRecipes.length} {savedRecipes.length === 1 ? 'Recipe' : 'Recipes'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    {savedRecipes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <BookOpen className="w-24 h-24 text-amber-300 mb-6" />
                            <h2 className="text-3xl font-bold text-amber-900 mb-3">No Saved Recipes Yet</h2>
                            <p className="text-amber-700 text-lg">
                                Start chatting with the AI chef to discover and save delicious recipes! 👨‍🍳
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedRecipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="group relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-[24px] p-6 border-4 border-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
                                    onClick={() => setSelectedRecipe(recipe)}
                                >
                                    {/* Heart Icon */}
                                    <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-600 to-orange-600 text-white p-3 rounded-full shadow-lg">
                                        <Heart className="w-6 h-6 fill-current" />
                                    </div>

                                    {/* Recipe Content */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-black text-amber-900 mb-3 line-clamp-2">
                                            {recipe.title}
                                        </h3>
                                        <p className="text-amber-800 text-sm line-clamp-4 leading-relaxed">
                                            {recipe.text.substring(0, 200)}...
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t-2 border-amber-200">
                                        <span className="text-xs text-amber-600 font-semibold">
                                            {new Date(recipe.createdAt?.seconds * 1000).toLocaleDateString('ko-KR')}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Are you sure you want to delete this recipe?')) {
                                                    onDeleteRecipe(recipe.id);
                                                }
                                            }}
                                            className="p-2 hover:bg-red-100 rounded-lg transition-all text-red-500 hover:text-red-700 hover:scale-110 active:scale-95"
                                            title="Delete Recipe"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recipe Modal */}
            {selectedRecipe && (
                <RecipeModal
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                    isSaved={true}
                />
            )}
        </div>
    )
}

export default MyRecipesPage
