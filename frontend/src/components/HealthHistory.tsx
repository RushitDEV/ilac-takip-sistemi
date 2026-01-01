import { Calendar, FileText, Activity, Pill, TrendingUp } from 'lucide-react';

interface HealthHistoryProps {
    user: any;
}

export function HealthHistory({ user }: HealthHistoryProps) {
    const historyItems = [
        {
            id: 1,
            date: '2024-11-25',
            type: 'medicine',
            title: 'İlaç Satın Alma',
            description: 'Parol 500mg - 3 kutu satın alındı',
            location: 'Merkez Eczanesi',
            icon: Pill,
            color: 'blue',
        },
        {
            id: 2,
            date: '2024-11-20',
            type: 'test',
            title: 'Kan Tahlili',
            description: 'Tam kan sayımı ve biyokimya testleri yapıldı',
            location: 'Merkez Laboratuvar',
            icon: Activity,
            color: 'red',
        },
        {
            id: 3,
            date: '2024-11-18',
            type: 'prescription',
            title: 'Yeni Reçete',
            description: 'Dr. Zeynep Arslan tarafından reçete düzenlendi',
            location: 'Şifa Hastanesi - Dahiliye',
            icon: FileText,
            color: 'green',
        },
        {
            id: 4,
            date: '2024-11-10',
            type: 'medicine',
            title: 'İlaç Tedavisi Tamamlandı',
            description: 'Majezik 275mg tedavisi başarıyla tamamlandı',
            location: '-',
            icon: Pill,
            color: 'blue',
        },
        {
            id: 5,
            date: '2024-10-25',
            type: 'test',
            title: 'Kolesterol Kontrolü',
            description: 'Lipid profili test sonuçları alındı',
            location: 'Sağlık Laboratuvarı',
            icon: Activity,
            color: 'red',
        },
        {
            id: 6,
            date: '2024-10-15',
            type: 'prescription',
            title: 'Kontrol Muayenesi',
            description: 'Kardiyoloji kontrol muayenesi yapıldı',
            location: 'Şifa Hastanesi - Kardiyoloji',
            icon: FileText,
            color: 'green',
        },
    ];

    const healthMetrics = [
        {
            name: 'Toplam Reçete',
            value: '12',
            trend: '+2',
            period: 'Son 6 ay',
            icon: FileText,
        },
        {
            name: 'İlaç Uyumu',
            value: '89%',
            trend: '+5%',
            period: 'Son ay',
            icon: TrendingUp,
        },
        {
            name: 'Test Sayısı',
            value: '8',
            trend: '+1',
            period: 'Son 6 ay',
            icon: Activity,
        },
        {
            name: 'Aktif İlaç',
            value: '3',
            trend: '0',
            period: 'Şu an',
            icon: Pill,
        },
    ];

    const prescriptionHistory = [
        {
            date: '2024-11-18',
            doctor: 'Dr. Zeynep Arslan',
            hospital: 'Şifa Hastanesi',
            diagnosis: 'Grip, Baş ağrısı',
            medicines: ['Parol 500mg', 'Majezik 275mg'],
        },
        {
            date: '2024-10-15',
            doctor: 'Dr. Ahmet Öz',
            hospital: 'Şifa Hastanesi',
            diagnosis: 'Hipertansiyon, Yüksek Kolesterol',
            medicines: ['Coraspin 100mg', 'Lipitor 20mg'],
        },
    ];

    return (
        <div className="max-w-7xl space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {healthMetrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <div key={metric.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <p className="text-sm text-gray-600">{metric.name}</p>
                            </div>
                            <p className="text-gray-900 mb-1">{metric.value}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-green-600">{metric.trend}</span>
                                <span className="text-xs text-gray-500">{metric.period}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-gray-900 mb-6">Sağlık Geçmişi</h2>
                    <div className="space-y-6">
                        {historyItems.map((item, index) => {
                            const Icon = item.icon;
                            const isLast = index === historyItems.length - 1;

                            return (
                                <div key={item.id} className="relative">
                                    {!isLast && (
                                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                                    )}
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-${item.color}-50`}>
                                            <Icon className={`w-6 h-6 text-${item.color}-600`} />
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <div className="flex items-start justify-between mb-1">
                                                <p className="text-gray-900">{item.title}</p>
                                                <span className="text-sm text-gray-500">{item.date}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                                            {item.location !== '-' && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {item.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Prescription History */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-gray-900 mb-4">Reçete Geçmişi</h2>
                    <div className="space-y-4">
                        {prescriptionHistory.map((prescription, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 mb-1">{prescription.doctor}</p>
                                        <p className="text-xs text-gray-600">{prescription.hospital}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{prescription.date}</span>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Tanı</p>
                                        <p className="text-sm text-gray-900">{prescription.diagnosis}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">İlaçlar</p>
                                        <div className="space-y-1">
                                            {prescription.medicines.map((medicine, i) => (
                                                <p key={i} className="text-sm text-gray-900">• {medicine}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-3 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors">
                                    Reçeteyi Görüntüle
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Export Data */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-900 mb-1">Sağlık Verilerini Dışa Aktar</h3>
                        <p className="text-sm text-gray-600">
                            Tüm sağlık geçmişinizi ve test sonuçlarınızı PDF olarak indirin
                        </p>
                    </div>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Tümünü İndir
                    </button>
                </div>
            </div>
        </div>
    );
}
