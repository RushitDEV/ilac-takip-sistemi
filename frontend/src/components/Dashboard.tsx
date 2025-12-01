import { useState, useEffect } from 'react';
import { Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../src/apiClient';
import { API_ENDPOINTS } from '../../src/api';

interface Stats {
    totalMedicines: number;
    totalPatients: number;
    lowStock: number;
    todayAdded: number;
    pendingShipments: number;
    notifications: number;
}

export function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);

            // 🔥 GERÇEK dashboard endpoint’i
            const data = await apiClient(API_ENDPOINTS.DASHBOARD_STATS);

            setStats(data);
        } catch (err: any) {
            setError(err.message || 'API error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <p className="text-center mt-10">Yükleniyor...</p>;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            title: 'Toplam İlaç',
            value: stats.totalMedicines,
            icon: Package,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Toplam Hasta',
            value: stats.totalPatients,
            icon: Users,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Düşük Stok',
            value: stats.lowStock,
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        },
        {
            title: 'Bugün Eklenen İlaç',
            value: stats.todayAdded,
            icon: TrendingUp,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-white p-6 rounded-xl border hover:shadow-lg transition"
                        >
                            <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                            </div>
                            <p className="text-gray-600 text-sm mt-3">{stat.title}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
