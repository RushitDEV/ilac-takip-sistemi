import { useState } from 'react';
import { PharmacyPanel } from '../src/components/PharmacyPanel';
import { PatientPanel } from '../src/components/PatientPanel';
import { QuickDemo } from '../src/components/QuickDemo';
import { Pill, Zap } from 'lucide-react';
import { apiClient, getCurrentUser, setAuthData, clearAuthData } from './apiClient';
import { API_ENDPOINTS } from './api';

export default function App() {
    const [currentUser, setCurrentUser] = useState<any>(getCurrentUser());
    const [showDemo, setShowDemo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Login işlemi
    const handleLogin = async (role: 'pharmacy' | 'patient') => {
        setError('');
        setIsLoading(true);

        const loginEmail = role === 'pharmacy' ? 'admin@ilac.com' : 'hasta@ilac.com';
        const loginPassword = '123456';

        try {
            const response = await apiClient<{ token: string; user: any }>(
                API_ENDPOINTS.LOGIN,
                {
                    method: 'POST',
                    data: { email: loginEmail, password: loginPassword },
                }
            );

            setAuthData(response.token, response.user);
            setCurrentUser(response.user);

        } catch (err: any) {
            setError(err.message || 'Giriş başarısız oldu.');
            clearAuthData();
        } finally {
            setIsLoading(false);
        }
    };

    // Logout
    const handleLogout = async () => {
        try {
            await apiClient(API_ENDPOINTS.LOGOUT, { method: 'POST' });
        } catch (err) {
            console.error("Çıkış hatası:", err);
        } finally {
            clearAuthData();
            setCurrentUser(null);
            setError('');
        }
    };

    // Kullanıcı giriş yapmamışsa login ekranını göster
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Pill className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-gray-900 mb-2">İlaç Takip Sistemi</h1>
                        <p className="text-gray-600">Sisteme giriş yapmak için rolünüzü seçin</p>

                        <button
                            onClick={() => setShowDemo(true)}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Zap className="w-4 h-4" />
                            Hızlı Demo Rehberi
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-xl">
                        <h3 className="text-gray-900 mb-6 text-center">Giriş Yap</h3>

                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => handleLogin('pharmacy')}
                                disabled={isLoading}
                                className="p-8 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group disabled:opacity-70 disabled:cursor-wait"
                            >
                                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 mb-2">Eczacı Olarak Giriş</h3>
                                <p className="text-sm text-gray-600">
                                    {isLoading ? 'Giriş Yapılıyor...' : 'admin@ilac.com (Test)'}
                                </p>
                            </button>

                            <button
                                onClick={() => handleLogin('patient')}
                                disabled={isLoading}
                                className="p-8 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group disabled:opacity-70 disabled:cursor-wait"
                            >
                                <div className="bg-green-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 mb-2">Hasta Olarak Giriş</h3>
                                <p className="text-sm text-gray-600">
                                    {isLoading ? 'Giriş Yapılıyor...' : 'hasta@ilac.com (Test)'}
                                </p>
                            </button>
                        </div>

                        <div className="mt-8 text-center text-sm text-gray-500">
                            <p>Test kullanıcıları: admin@ilac.com / hasta@ilac.com (Şifre: 123456)</p>
                        </div>
                    </div>
                </div>

                <QuickDemo isOpen={showDemo} onClose={() => setShowDemo(false)} />
            </div>
        );
    }

    // BACKEND'DEN: user.roles → ["pharmacy"] gelecektir
    const isPharmacy = currentUser?.roles?.includes('ROLE_ADMIN');

    return (
        <div>
            {isPharmacy ? (
                <PharmacyPanel user={currentUser} onLogout={handleLogout} />
            ) : (
                <PatientPanel user={currentUser} onLogout={handleLogout} />
            )}
        </div>
    );
}
