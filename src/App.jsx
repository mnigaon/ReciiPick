import React, { useState, useEffect } from 'react'
import ChefCharacter from './components/ChefCharacter'
import MessageHistory from './components/MessageHistory'
import InputSection from './components/InputSection'
import { generateRecipe } from './services/aiService'
import { useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import { db } from './firebase'
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { LogIn, LogOut, Heart, BookOpen, Trash2, ChevronDown } from 'lucide-react'

function App() {
    const { user, logout } = useAuth()
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [isRecipeDropdownOpen, setIsRecipeDropdownOpen] = useState(false)
    const [savedRecipes, setSavedRecipes] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [previewImage, setPreviewImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [messages, setMessages] = useState(() => {
        // Load messages from localStorage
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            try {
                return JSON.parse(savedMessages);
            } catch (error) {
                console.error('Error parsing saved messages:', error);
            }
        }
        // Default initial message
        return [{
            id: 1,
            role: 'ai',
            text: "I'm Cooky, your AI Recipe Chef! 👨‍🍳✨\nTell me what ingredients you have, and I'll suggest a delicious recipe! You can also send me a photo of your fridge.",
        }];
    })

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    // Load saved recipes from Firestore
    useEffect(() => {
        if (!user) {
            setSavedRecipes([]);
            return;
        }

        const q = query(
            collection(db, 'saved_recipes'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recipes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
            setSavedRecipes(recipes);
        });

        return unsubscribe;
    }, [user]);

    const handleSaveRecipe = async (recipe) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        try {
            await addDoc(collection(db, 'saved_recipes'), {
                userId: user.uid,
                text: recipe.text,
                title: recipe.text.split('\n')[0].replace('DISH_NAME: ', '').trim() || 'Delicious Recipe',
                createdAt: serverTimestamp()
            });
            alert('Recipe saved to your collection! 💖');
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('Failed to save recipe. Error: ' + error.message);
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        try {
            await deleteDoc(doc(db, 'saved_recipes', recipeId));
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim() && !previewImage) return

        const userMsgText = inputValue;
        const userMsgImage = previewImage;

        const newMessage = {
            id: Date.now(),
            role: 'user',
            text: userMsgText,
            image: userMsgImage
        }

        setMessages(prev => [...prev, newMessage])
        setInputValue('')
        setPreviewImage(null)
        setIsLoading(true)
        setIsSpeaking(true)

        try {
            // 1. Generate Recipe via Gemini
            const recipeText = await generateRecipe(userMsgText, userMsgImage);

            const aiResponseId = Date.now() + 1;
            const initialAiResponse = {
                id: aiResponseId,
                role: 'ai',
                text: recipeText,
            }
            setMessages(prev => [...prev, initialAiResponse]);

        } catch (error) {
            console.error("Failed to fetch AI response:", error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'ai',
                text: "Sorry, I'm having a little trouble thinking right now. 😅 Could you try again in a moment?",
            }]);
        } finally {
            setIsLoading(false)
            setIsSpeaking(false)
        }
    }

    const handleImageUpload = (imageData) => {
        setPreviewImage(imageData)
    }

    return (
        <div className="h-screen w-full overflow-hidden font-outfit relative">
            <main className="w-full h-full flex flex-col items-center relative z-10">
                {/* Header with Auth and Saved Recipes - Full Width */}
                <header className="w-full bg-white/50 backdrop-blur-sm relative">
                    <div className="w-full px-8 py-6 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Heart className="w-6 h-6 text-orange-500 fill-orange-500" />
                            <span className="font-bold text-xl text-orange-950">ReciiPick</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {user && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsRecipeDropdownOpen(!isRecipeDropdownOpen)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:bg-orange-50 transition-all border border-orange-100"
                                    >
                                        <BookOpen className="w-4 h-4 text-orange-500" />
                                        <span className="hidden md:inline">My Recipes</span>
                                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{savedRecipes.length}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${isRecipeDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isRecipeDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsRecipeDropdownOpen(false)}
                                            />
                                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-orange-100 max-h-96 overflow-y-auto z-50">
                                                <div className="p-4 border-b border-orange-50">
                                                    <h3 className="font-bold text-orange-950">Saved Recipes</h3>
                                                </div>
                                                <div className="p-2">
                                                    {savedRecipes.map((recipe) => (
                                                        <div
                                                            key={recipe.id}
                                                            className="group relative p-3 hover:bg-orange-50 rounded-xl transition-all cursor-pointer mb-1"
                                                            onClick={() => {
                                                                setMessages(prev => [...prev, {
                                                                    id: Date.now(),
                                                                    role: 'ai',
                                                                    text: recipe.text
                                                                }]);
                                                                setIsRecipeDropdownOpen(false);
                                                            }}
                                                        >
                                                            <div className="flex items-start gap-3 pr-8">
                                                                <BookOpen className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-sm text-orange-950 truncate">{recipe.title}</h4>
                                                                    <p className="text-xs text-orange-900/40 mt-0.5">
                                                                        {new Date(recipe.createdAt?.seconds * 1000).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteRecipe(recipe.id);
                                                                }}
                                                                className="absolute right-2 top-3 p-1.5 text-orange-950/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-white"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-orange-950 font-medium hidden md:block">
                                        {user.displayName || 'Chef'}
                                    </span>
                                    <button
                                        onClick={() => logout()}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-orange-950 rounded-xl shadow-sm hover:bg-orange-50 transition-all border border-orange-100"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className="w-full max-w-5xl mx-auto h-full flex flex-col flex-1 min-h-0 pt-8">
                    {/* Message Box */}
                    <div className="w-full flex-1 min-h-0 flex flex-col items-center overflow-hidden">
                        <MessageHistory
                            messages={messages}
                            isLoading={isLoading}
                            isSpeaking={isSpeaking}
                            onSaveRecipe={handleSaveRecipe}
                        />
                    </div>

                    {/* Fixed Bottom Input Section */}
                    <div className="w-full flex-none flex flex-col items-center px-8 pb-8 pt-2">
                        <InputSection
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            previewImage={previewImage}
                            setPreviewImage={setPreviewImage}
                            onSend={handleSend}
                            onImageUpload={handleImageUpload}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </main>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#FFF5EB]/30 to-transparent pointer-events-none z-0" />
        </div>
    )
}

export default App
