import React, { useState, useEffect } from 'react'
import ChefCharacter from './components/ChefCharacter'
import InputSection from './components/InputSection'
import MyRecipesPage from './components/MyRecipesPage'
import LoadingScreen from './components/LoadingScreen'
import RecipeModal from './components/RecipeModal'
import ErrorModal from './components/ErrorModal'
import { generateRecipe } from './services/aiService'
import { useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import { db } from './firebase'
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { LogIn, LogOut } from 'lucide-react'

function App() {
    const { user, logout } = useAuth()
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState('home') // 'home' or 'recipes'
    const [savedRecipes, setSavedRecipes] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [previewImage, setPreviewImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // New state for single recipe system
    const [currentRecipe, setCurrentRecipe] = useState(null)
    const [showRecipeModal, setShowRecipeModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

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

        // Check for duplicates
        const isDuplicate = savedRecipes.some(saved =>
            saved.text.trim() === recipe.text.trim()
        );

        if (isDuplicate) {
            alert('This recipe is already saved!');
            return;
        }

        try {
            // Extract title from new format: [DISH_NAME: Recipe Title]
            let title = 'Delicious Recipe';
            const dishNameMatch = recipe.text.match(/\[DISH_NAME:\s*(.+?)\]/);
            if (dishNameMatch && dishNameMatch[1]) {
                title = dishNameMatch[1].trim();
            } else {
                // Fallback to old format or first line
                const firstLine = recipe.text.split('\n')[0];
                title = firstLine.replace('DISH_NAME:', '').replace('[', '').replace(']', '').trim() || 'Delicious Recipe';
            }

            await addDoc(collection(db, 'saved_recipes'), {
                userId: user.uid,
                text: recipe.text,
                title: title,
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
        const userMsgText = inputValue.trim();
        const userMsgImage = previewImage;

        if (!userMsgText && !userMsgImage) return;

        setInputValue('')
        setPreviewImage(null)
        setIsLoading(true)

        try {
            // Generate Recipe via Gemini
            const recipeText = await generateRecipe(userMsgText, userMsgImage);

            // Debug: Log AI response
            console.log("AI Response:", recipeText);

            // ✅ FIXED: Check explicitly for REJECTED tag
            if (recipeText.startsWith('[REJECTED:')) {
                // Extract rejection message
                const rejectedMatch = recipeText.match(/\[REJECTED:\s*(.+?)\]/s);
                if (rejectedMatch && rejectedMatch[1]) {
                    setErrorMessage(rejectedMatch[1].trim());
                } else {
                    // Fallback if format is malformed but starts with REJECTED tag
                    setErrorMessage(recipeText.replace('[REJECTED:', '').replace(']', '').trim());
                }
                return;
            }

            // ✅ FIXED: Check for DISH_NAME tag to confirm success
            if (recipeText.includes('[DISH_NAME:')) {
                // Extract title from recipe
                let title = 'Delicious Recipe';
                const dishNameMatch = recipeText.match(/\[DISH_NAME:\s*(.+?)\]/);
                if (dishNameMatch && dishNameMatch[1]) {
                    title = dishNameMatch[1].trim();
                }

                // Set current recipe and show modal
                setCurrentRecipe({
                    title: title,
                    text: recipeText
                });
                setShowRecipeModal(true);
                return;
            }

            // ✅ FALLBACK: If format is ambiguous, treat as recipe
            // (AI might have missed the exact format, but content is likely a recipe)
            const firstLine = recipeText.split('\n')[0].trim();
            setCurrentRecipe({
                title: firstLine || 'Delicious Recipe',
                text: recipeText
            });
            setShowRecipeModal(true);

        } catch (error) {
            console.error("Failed to fetch AI response:", error);
            alert("Sorry, I'm having trouble creating a recipe. 😅 Please try again!");
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = (imageData) => {
        setPreviewImage(imageData)
    }

    return (
        <div className="h-screen w-full overflow-hidden font-outfit relative">
            <main className="w-full h-full flex flex-col items-center relative z-10">
                {/* Header */}
                <header className="w-full bg-amber-50/70 backdrop-blur-md relative border-b-2 border-amber-200/50">
                    <div className="w-full px-8 py-5 flex justify-between items-center">
                        <div className="flex items-center gap-3 group">
                            <img
                                src="/reciipick.png"
                                alt="ReciiPick Logo"
                                className="w-14 h-14 object-contain transition-transform group-hover:rotate-12 group-hover:scale-110"
                            />
                            <h1 className="text-5xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(217,119,6,0.3)] hover:drop-shadow-[0_4px_12px_rgba(217,119,6,0.5)] transition-all hover:scale-105">
                                Recii<span className="italic">Pick</span>
                            </h1>
                        </div>


                        <div className="flex items-center gap-4">
                            {user && (
                                <button
                                    onClick={() => setCurrentPage('recipes')}
                                    className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-[20px] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-amber-300/50 hover:border-amber-400 group"
                                >
                                    <svg className="w-5 h-5 text-amber-700 group-hover:text-orange-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span className="font-extrabold text-amber-900 text-sm tracking-wide">My Recipes</span>
                                    <span className="bg-gradient-to-br from-amber-600 to-orange-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">{savedRecipes.length}</span>
                                </button>
                            )}

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-orange-950 font-medium hidden md:block">
                                        {user.displayName || 'Chef'}
                                    </span>
                                    <button
                                        onClick={() => logout()}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 rounded-[18px] shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-amber-200 hover:border-amber-300 font-bold text-sm group"
                                    >
                                        <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white rounded-[20px] shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all font-black text-sm tracking-wide border-2 border-white/20 hover:border-white/40"
                                >
                                    <LogIn className="w-5 h-5 drop-shadow-md" />
                                    <span className="drop-shadow-md">Sign In</span>
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Conditional Page Rendering */}
                {currentPage === 'home' ? (
                    <>
                        {/* Main Content */}
                        <div className="w-full max-w-5xl mx-auto h-full flex flex-col flex-1 min-h-0 pt-8">
                            {isLoading ? (
                                /* Loading Screen */
                                <LoadingScreen />
                            ) : (
                                /* Initial Screen - Chef + Welcome */
                                <div className="w-full flex-1 flex items-center justify-center overflow-hidden px-8">
                                    <div className="flex items-center gap-12 max-w-6xl">
                                        {/* Chef Character - Left */}
                                        <div className="flex-shrink-0">
                                            <ChefCharacter isLoading={false} isSpeaking={false} />
                                        </div>

                                        {/* Welcome Bubble - Right */}
                                        <div className="flex-1 bg-gradient-to-br from-amber-100 to-orange-100 rounded-[32px] p-8 shadow-xl border-4 border-white">
                                            <h2 className="text-3xl font-black bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent mb-4">
                                                Welcome to Recii<span className="italic">Pick</span>! 👨‍🍳✨
                                            </h2>
                                            <p className="text-amber-900 text-lg leading-relaxed">
                                                Tell me what ingredients you have, and I'll create a delicious recipe for you!
                                                You can also send me a photo of your fridge. 📸
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fixed Bottom Input Section */}
                            {!isLoading && (
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
                            )}
                        </div>
                    </>
                ) : (
                    <MyRecipesPage
                        savedRecipes={savedRecipes}
                        onBack={() => setCurrentPage('home')}
                        onDeleteRecipe={handleDeleteRecipe}
                    />
                )}
            </main>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            {/* Recipe Modal */}
            {showRecipeModal && currentRecipe && (
                <RecipeModal
                    recipe={currentRecipe}
                    user={user}
                    onSave={handleSaveRecipe}
                    onLoginRequired={() => setIsAuthModalOpen(true)}
                    onClose={() => {
                        setShowRecipeModal(false);
                        setCurrentRecipe(null);
                    }}
                />
            )}

            {/* Error Modal */}
            {errorMessage && (
                <ErrorModal
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#FFF5EB]/30 to-transparent pointer-events-none z-0" />
        </div>
    )
}

export default App
