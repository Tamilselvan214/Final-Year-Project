import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, Loader, Mail, Landmark, CheckCircle2, FileCheck, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [role, setRole] = useState('PUBLIC');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isRegistering) {
                // Registration Logic
                if (role === 'ADMIN' && email !== 'admin@landregistry.com') {
                    throw new Error("Only 'admin@landregistry.com' can register as ADMIN.");
                }

                await register({
                    name: name || 'New User',
                    email,
                    password,
                    role,
                    nationalId: "123456789" // Dummy ID
                });

                toast.success("Registration successful. Please log in.");
                setIsRegistering(false);
            } else {
                // Login Logic
                await login(role, email, password);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Authentication failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions = [
        { value: 'PUBLIC', label: 'Public', helper: 'Search records', icon: Search },
        { value: 'OWNER', label: 'Owner', helper: 'Manage lands', icon: Landmark },
        { value: 'ADMIN', label: 'Admin', helper: 'Verify records', icon: FileCheck },
    ];

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_45%,_#ecfdf5_100%)] text-gray-900">
            <main className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 p-4 sm:p-6 lg:grid-cols-[0.95fr_1fr] lg:p-8">
                <section className="relative hidden overflow-hidden rounded-l-2xl bg-gradient-to-br from-blue-950 via-blue-800 to-emerald-700 px-10 py-12 text-white shadow-2xl lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-x-0 top-0 h-40 bg-white/10"></div>
                    <div className="absolute -right-20 bottom-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"></div>
                    <div className="absolute left-12 top-36 h-28 w-28 rounded-full bg-emerald-300/20 blur-2xl"></div>

                    <div>
                        <div className="relative flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white shadow-sm ring-1 ring-white/25">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">LandRegistry</h1>
                                <p className="text-sm text-blue-100">Secure land records portal</p>
                            </div>
                        </div>

                        <div className="relative mt-16 space-y-5">
                            <p className="inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-cyan-100 ring-1 ring-white/20">
                                Blockchain verified
                            </p>
                            <h2 className="max-w-md text-4xl font-bold leading-tight">
                                Access trusted property records with the right role.
                            </h2>
                            <p className="max-w-md text-base leading-7 text-blue-50">
                                Sign in as a public user, owner, or administrator to search records, manage property submissions, and verify land transfers.
                            </p>
                        </div>
                    </div>

                    <div className="relative grid gap-3">
                        {[
                            ['Immutable audit trail', 'Every land update keeps a clear verification history.'],
                            ['Role-aware dashboard', 'Each user sees only the workflows relevant to them.'],
                            ['Transfer oversight', 'Admins can review pending ownership changes.'],
                        ].map(([title, description]) => (
                            <div key={title} className="flex gap-3 rounded-xl border border-white/15 bg-white/10 p-4 shadow-sm backdrop-blur">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-200" />
                                <div>
                                    <p className="font-semibold text-white">{title}</p>
                                    <p className="mt-1 text-sm text-blue-50/85">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="flex items-center justify-center rounded-2xl bg-white/80 px-4 py-8 shadow-xl ring-1 ring-white/70 backdrop-blur sm:px-6 lg:rounded-l-none lg:px-10">
                    <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:p-8">
                        <div className="mb-8">
                            <div className="mb-5 flex items-center gap-3 lg:hidden">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-blue-950">LandRegistry</p>
                                    <p className="text-xs text-gray-500">Secure land records portal</p>
                                </div>
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                                {isRegistering ? 'Create account' : 'Welcome back'}
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-gray-950">
                                {isRegistering ? 'Register for access' : 'Sign in to your workspace'}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Choose your role before continuing so the dashboard opens with the correct tools.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Account role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {roleOptions.map((option) => {
                                        const RoleIcon = option.icon;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setRole(option.value)}
                                            className={`rounded-xl border p-3 text-left transition-all ${role === option.value
                                                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-800 shadow-sm ring-2 ring-blue-100'
                                                : 'border-gray-200 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-gray-50 hover:shadow-sm'
                                                }`}
                                            aria-pressed={role === option.value}
                                        >
                                                <span className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${role === option.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    <RoleIcon className="h-4 w-4" />
                                                </span>
                                                <span className="block text-sm font-semibold">{option.label}</span>
                                                <span className="mt-1 block text-xs text-gray-500">{option.helper}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {isRegistering && (
                                    <div>
                                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">Full name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:translate-y-0 disabled:from-blue-300 disabled:to-emerald-300"
                            >
                                {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <>{isRegistering ? 'Create account' : 'Sign in'} <ArrowRight className="h-5 w-5" /></>}
                            </button>
                        </form>

                        <div className="mt-6 flex flex-col items-center gap-3 border-t border-gray-100 pt-5 text-sm">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!email) {
                                        setError("Please enter your email first to reset password.");
                                        return;
                                    }
                                    if (window.confirm("Do you want to reset your password to 'admin123' for this account?")) {
                                        // Demo Reset Trigger
                                        api.post('/auth/reset-password', { email, password: 'admin123' })
                                            .then(() => toast.success("Password reset to 'admin123'. Please log in now."))
                                            .catch(() => toast.error("Failed to reset password. User not found."));
                                    }
                                }}
                                className="font-medium text-gray-500 transition-colors hover:text-gray-900"
                            >
                                Forgot password?
                            </button>

                            <button
                                type="button"
                                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                {isRegistering ? 'Already have an account? Sign in' : 'New user? Register here'}
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Login;
