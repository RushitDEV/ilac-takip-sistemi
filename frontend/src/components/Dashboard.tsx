import { useState, useEffect } from 'react';
import {
    Package,
    Users,
    TrendingUp,
    AlertTriangle
} from 'lucide-react';
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
            const data = await apiClient(API_ENDPOINTS.DASHBOARD_STATS);
            setStats(data);
        } catch (err: any) {
            setError(err.message || 'API error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
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
            bgColor: 'bg-blue-100/60',
            iconColor: 'text-blue-700'
        },
        {
            title: 'Toplam Hasta',
            value: stats.totalPatients,
            icon: Users,
            bgColor: 'bg-green-100/60',
            iconColor: 'text-green-700'
        },
        {
            title: 'Düşük Stok',
            value: stats.lowStock,
            icon: AlertTriangle,
            bgColor: 'bg-yellow-100/60',
            iconColor: 'text-yellow-700'
        },
        {
            title: 'Bugün Eklenen İlaç',
            value: stats.todayAdded,
            icon: TrendingUp,
            bgColor: 'bg-purple-100/60',
            iconColor: 'text-purple-700'
        }
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="
                                bg-white p-6
                                rounded-2xl border shadow-sm
                                hover:shadow-xl
                                transition-all duration-300
                                hover:-translate-y-1
                                backdrop-blur-md
                            "
                        >
                            <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center shadow-inner`}>
                                <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                            </div>

                            <p className="text-gray-500 text-sm mt-4">{stat.title}</p>
                            <p className="text-4xl font-bold text-gray-900 mt-1">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
