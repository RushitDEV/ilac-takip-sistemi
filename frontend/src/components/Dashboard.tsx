import { useState, useEffect } from 'react';
import { Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../src/apiClient.ts';
import { API_ENDPOINTS } from '../../src/api.ts';

interface Stats {
    totalMedications: number;
    activePatients: number;
    lowStock: number;
    todayPrescriptions: number;
}

export function Dashboard() {
    const [stats, setStats] = useState<Stats>({
        totalMedications: 0,
        activePatients: 0,
        lowStock: 0,
        todayPrescriptions: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            // API'den dashboard verilerini çek
            const medications = await apiClient(API_ENDPOINTS.MEDICATIONS);

            // İstatistikleri hesapla
            setStats({
                totalMedications: medications?.length || 0,
                activePatients: 0, // Backend'den gelecek
                lowStock: 0, // Backend'den gelecek
                todayPrescriptions: 0 // Backend'den gelecek
            });
        } catch (err: any) {
            setError(err.message || 'Dashboard verileri yüklenemedi');
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Toplam İlaç',
            value: stats.totalMedications,
            icon: Package,
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Aktif Hasta',
            value: stats.activePatients,
            icon: Users,
            color: 'green',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Düşük Stok',
            value: stats.lowStock,
            icon: AlertTriangle,
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        },
        {
            title: 'Bugünkü Reçeteler',
            value: stats.todayPrescriptions,
            icon: TrendingUp,
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        }
    ];

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
                <p className="text-gray-600">Eczane istatistiklerine genel bakış</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Son Aktiviteler</h3>
                <div className="space-y-3">
                    <p className="text-gray-600 text-sm">Henüz aktivite bulunmuyor.</p>
                </div>
            </div>
        </div>
    );
}
