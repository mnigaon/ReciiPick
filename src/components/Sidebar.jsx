import React from 'react'
import { X, ChefHat, BookOpen, Trash2, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar, savedRecipes, onDeleteRecipe, onSelectRecipe }) => {
    const { user } = useAuth();

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`fixed lg:static inset-y-0 left-0 w-85 bg-white shadow-2xl z-50 transition-all duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-85'
                } flex flex-col`}>

                {/* Sidebar Header */}
                <div className="p-8 border-b border-orange-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-xl">
                            <ChefHat className="w-6 h-6 text-orange-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-orange-950 font-outfit">My Kitchen</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {!user ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                            <div className="p-4 bg-orange-50 rounded-full">
                                <Heart className="w-12 h-12 text-orange-200" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-orange-950">Unlock Your Recipe Book</h3>
                                <p className="text-sm text-orange-900/50 mt-2">Sign in to save and organize your favorite recipes from Chef Gemini!</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between px-2">
                                <span className="text-sm font-bold text-orange-950/40 uppercase tracking-widest">
                                    Saved Recipes ({savedRecipes?.length || 0})
                                </span>
                            </div>

                            <div className="space-y-3">
                                {savedRecipes && savedRecipes.length > 0 ? (
                                    savedRecipes.map((recipe) => (
                                        <div
                                            key={recipe.id}
                                            className="group relative bg-orange-50/50 hover:bg-orange-100/50 rounded-2xl p-4 transition-all cursor-pointer border border-transparent hover:border-orange-200"
                                            onClick={() => onSelectRecipe(recipe)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <BookOpen className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <div className="flex-1 pr-6">
                                                    <h4 className="font-bold text-orange-950 text-sm line-clamp-1">
                                                        {recipe.title}
                                                    </h4>
                                                    <p className="text-xs text-orange-900/40 mt-1">
                                                        {new Date(recipe.createdAt?.seconds * 1000).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteRecipe(recipe.id);
                                                }}
                                                className="absolute right-3 top-3 p-2 text-orange-950/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-white shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 px-4 border-2 border-dashed border-orange-100 rounded-[32px]">
                                        <p className="text-orange-900/30 text-sm font-medium">No recipes saved yet.</p>
                                        <p className="text-xs text-orange-900/20 mt-1">Chat with the chef to find something delicious!</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar Footer */}
                <div className="p-8 border-t border-orange-50 bg-orange-50/20">
                    <p className="text-xs text-orange-900/30 text-center font-medium">
                        © 2026 ReciiPick AI Chef v1.0
                    </p>
                </div>
            </aside>

            {/* Floating Toggle Button for Mobile */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-6 left-6 z-[60] p-4 bg-white rounded-2xl shadow-xl border border-orange-50 text-orange-600 transition-all duration-300 lg:hidden ${isOpen ? 'translate-x-72 scale-0 opacity-0' : 'translate-x-0'
                    }`}
            >
                <ChefHat className="w-6 h-6" />
            </button>
        </>
    )
}

export default Sidebar
