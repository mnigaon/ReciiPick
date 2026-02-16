import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Chrome } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup, loginWithGoogle } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, displayName);
            }
            onClose();
        } catch (err) {
            setError(err.message.includes('auth/user-not-found')
                ? 'User not found. Please check your email.'
                : err.message.includes('auth/wrong-password')
                    ? 'Incorrect password.'
                    : 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            onClose();
        } catch (err) {
            setError('Google login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden relative animate-slideUp">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-orange-50 transition-colors"
                >
                    <X className="w-6 h-6 text-orange-950/40" />
                </button>

                <div className="p-8 pt-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-orange-950 mb-2">
                            {isLogin ? 'Welcome Back!' : 'Join ReciiPick'}
                        </h2>
                        <p className="text-orange-900/60">
                            {isLogin ? 'Sign in to save your favorite recipes' : 'Create an account to start your culinary journey'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-orange-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-orange-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-orange-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm pl-2 animate-bounce">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 hover:shadow-orange-300 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-[1px] bg-orange-100" />
                        <span className="text-orange-900/30 text-sm font-medium">OR</span>
                        <div className="flex-1 h-[1px] bg-orange-100" />
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-4 border-2 border-orange-100 flex items-center justify-center gap-3 rounded-2xl hover:bg-orange-50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        <Chrome className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-orange-950">Continue with Google</span>
                    </button>

                    <p className="mt-8 text-center text-orange-900/60">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-orange-600 font-bold hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
