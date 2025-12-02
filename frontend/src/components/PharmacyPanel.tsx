import { useState } from 'react';
import {
    Package,
    LogOut,
    Plus,
    ClipboardList,
    Truck,
    Activity,
    Box,
    FilePlus
} from 'lucide-react';

import { Dashboard } from './Dashboard.tsx';
import { MedicineRegistration } from './MedicineRegistration.tsx';
import { PatientTracking } from './PatientTracking.tsx';
import { SupplyChain } from './SupplyChain.tsx';
import { StockManagement } from './StockManagement.tsx';
import { Lifecycle } from './Lifecycle.tsx';
import { PrescriptionCreate } from './PrescriptionCreate.tsx';

interface PharmacyPanelProps {
    user: any;
    onLogout: () => void;
}

type TabType =
    | 'dashboard'
    | 'register'
    | 'patients'
    | 'prescriptions'
    | 'supply'
    | 'stock'
    | 'lifecycle';

export function PharmacyPanel({ user, onLogout }: PharmacyPanelProps) {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');

    const tabs = [
        { id: 'dashboard' as TabType, label: 'Dashboard', icon: Activity },
        { id: 'register' as TabType, label: 'İlaç Kaydı', icon: Plus },
        { id: 'patients' as TabType, label: 'Hasta Takibi', icon: ClipboardList },

        // ⭐ YENİ EKLEDİĞİMİZ SEKME ⭐
        { id: 'prescriptions' as TabType, label: 'Reçete Ekle', icon: FilePlus },

        { id: 'supply' as TabType, label: 'Tedarik Zinciri', icon: Truck },
        { id: 'stock' as TabType, label: 'Stok Yönetimi', icon: Box },
        { id: 'lifecycle' as TabType, label: 'Yaşam Döngüsü', icon: Package },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'register':
                return <MedicineRegistration />;
            case 'patients':
                return <PatientTracking />;
            case 'prescriptions':
                return <PrescriptionCreate />; // ⭐ YENİ COMPONENT
            case 'supply':
                return <SupplyChain />;
            case 'stock':
                return <StockManagement />;
            case 'lifecycle':
                return <Lifecycle />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Eczacı Paneli
                                </h1>
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
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                                        ${
                                        activeTab === tab.id
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
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
