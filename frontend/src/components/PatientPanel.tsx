import { useState } from 'react';
import { Heart, LogOut, Pill, Calendar, Clock, Activity } from 'lucide-react';
// Patient klasöründen import et
import { MyMedicines } from './patient/MyMedicines.tsx';
import { HealthData } from './patient/HealthData.tsx';
import { MedicineCalendar } from './patient/MedicineCalendar.tsx';
import { HealthHistory } from './patient/HealthHistory.tsx';


interface PatientPanelProps {
    user: any;
    onLogout: () => void;
}

type TabType = 'medicines' | 'health' | 'calendar' | 'history';

export function PatientPanel({ user, onLogout }: PatientPanelProps) {
    const [activeTab, setActiveTab] = useState<TabType>('medicines');

    const tabs = [
        { id: 'medicines' as TabType, label: 'İlaçlarım', icon: Pill },
        { id: 'health' as TabType, label: 'Sağlık Verileri', icon: Activity },
        { id: 'calendar' as TabType, label: 'İlaç Takvimi', icon: Calendar },
        { id: 'history' as TabType, label: 'Sağlık Geçmişi', icon: Clock },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'medicines':
                return <MyMedicines />;
            case 'health':
                return <HealthData />;
            case 'calendar':
                return <MedicineCalendar />;
            case 'history':
                return <HealthHistory />;
            default:
                return <MyMedicines />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Hasta Paneli</h1>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                                        border-b-2 transition-colors
                                        ${activeTab === tab.id
                                        ? 'border-green-600 text-green-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>
        </div>
    );
}
