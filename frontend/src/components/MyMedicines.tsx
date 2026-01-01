import { useState } from 'react';
import { Clock, AlertCircle, CheckCircle2, Pill, Calendar, AlertTriangle, X } from 'lucide-react';

interface MyMedicinesProps {
    user: any;
}

export function MyMedicines({ user }: MyMedicinesProps) {
    const [showInteractionModal, setShowInteractionModal] = useState(false);
    const currentMedicines = [
        {
            id: 1,
            name: 'Parol 500mg',
            activeIngredient: 'Paracetamol',
            dosage: '3x1',
            purpose: 'Ağrı kesici',
            startDate: '2024-11-20',
            endDate: '2024-11-27',
            remainingDays: 2,
            nextDose: '14:00',
            takenToday: 2,
            totalToday: 3,
            doctor: 'Dr. Zeynep Arslan',
            instructions: 'Tok karnına alınız',
            sideEffects: 'Mide bulantısı, baş dönmesi',
            barcode: '8691234567890',
        },
        {
            id: 2,
            name: 'Coraspin 100mg',
            activeIngredient: 'Aspirin',
            dosage: '1x1',
            purpose: 'Kan sulandırıcı',
            startDate: '2024-11-15',
            endDate: '2024-12-15',
            remainingDays: 18,
            nextDose: '08:00 (Yarın)',
            takenToday: 1,
            totalToday: 1,
            doctor: 'Dr. Ahmet Öz',
            instructions: 'Sabahları aç karnına',
            sideEffects: 'Kanama riski artışı',
            barcode: '8691234567891',
        },
        {
            id: 3,
            name: 'Lipitor 20mg',
            activeIngredient: 'Atorvastatin',
            dosage: '1x1',
            purpose: 'Kolesterol düşürücü',
            startDate: '2024-10-01',
            endDate: '2025-01-01',
            remainingDays: 35,
            nextDose: '20:00',
            takenToday: 0,
            totalToday: 1,
            doctor: 'Dr. Ahmet Öz',
            instructions: 'Akşam yemeğinden sonra',
            sideEffects: 'Kas ağrısı, yorgunluk',
            barcode: '8691234567896',
        },
    ];

    const completedMedicines = [
        {
            id: 4,
            name: 'Majezik 275mg',
            activeIngredient: 'Dexketoprofen',
            dosage: '2x1',
            purpose: 'Ağrı kesici',
            startDate: '2024-11-10',
            endDate: '2024-11-20',
            completedDate: '2024-11-20',
            doctor: 'Dr. Zeynep Arslan',
            barcode: '8691234567892',
        },
    ];

    const interactions = [
        {
            medicine1: 'Parol 500mg',
            medicine2: 'Coraspin 100mg',
            severity: 'low',
            warning: 'Bu ilaçları birlikte kullanabilirsiniz, ancak dozlara dikkat edin.',
        },
        {
            medicine1: 'Coraspin 100mg',
            medicine2: 'Lipitor 20mg',
            severity: 'medium',
            warning: 'Kanama riski artabilir. Doktorunuzun bilgisi dahilinde kullanın.',
        },
    ];

    return (
        <div className="max-w-7xl space-y-6">
            {/* Drug Interaction Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-yellow-900 mb-2">
                            <span className="font-medium">İlaç etkileşimi tespit edildi!</span> Kullandığınız ilaçlar arasında olası etkileşimler bulunmaktadır.
                        </p>
                        <button
                            onClick={() => setShowInteractionModal(true)}
                            className="text-sm text-yellow-700 hover:text-yellow-800 underline"
                        >
                            Detayları görüntüle
                        </button>
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Pill className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-gray-600">Aktif İlaçlar</p>
                    </div>
                    <p className="text-gray-900">{currentMedicines.length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-gray-600">Bugün Alınan</p>
                    </div>
                    <p className="text-gray-900">
                        {currentMedicines.reduce((sum, m) => sum + m.takenToday, 0)}/
                        {currentMedicines.reduce((sum, m) => sum + m.totalToday, 0)}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <p className="text-sm text-gray-600">Biten İlaçlar</p>
                    </div>
                    <p className="text-gray-900">
                        {currentMedicines.filter((m) => m.remainingDays <= 7).length}
                    </p>
                </div>
            </div>

            {/* Current Medicines */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-gray-900">Aktif İlaçlarım</h2>
                </div>
                <div className="p-6 space-y-4">
                    {currentMedicines.map((medicine) => (
                        <div key={medicine.id} className="border border-gray-200 rounded-xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gray-50 p-4 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="text-gray-900">{medicine.name}</p>
                                            {medicine.takenToday === medicine.totalToday ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Bugün tamamlandı
                        </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                                                    {medicine.totalToday - medicine.takenToday} doz kaldı
                        </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{medicine.activeIngredient}</p>
                                    </div>
                                    {medicine.remainingDays <= 7 && (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      {medicine.remainingDays} gün kaldı
                    </span>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Kullanım Amacı</p>
                                            <p className="text-gray-900">{medicine.purpose}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Dozaj</p>
                                            <p className="text-gray-900">{medicine.dosage}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Reçete Eden Doktor</p>
                                            <p className="text-gray-900">{medicine.doctor}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Kullanım Süresi</p>
                                            <p className="text-gray-900">
                                                {medicine.startDate} - {medicine.endDate}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Sonraki Doz</p>
                                            <p className="text-gray-900 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                {medicine.nextDose}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Kullanım Talimatları</p>
                                            <p className="text-gray-900">{medicine.instructions}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Yan Etkiler</p>
                                            <p className="text-gray-900">{medicine.sideEffects}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Barkod</p>
                                            <p className="text-gray-900">{medicine.barcode}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-gray-700">Bugünkü İlerleme</p>
                                        <p className="text-sm text-gray-900">
                                            {medicine.takenToday}/{medicine.totalToday} doz
                                        </p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full transition-all"
                                            style={{
                                                width: `${(medicine.takenToday / medicine.totalToday) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-4">
                                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                        İlacı Aldım
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        Hatırlatıcı Kur
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Completed Medicines */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-gray-900">Tamamlanan İlaçlar</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        {completedMedicines.map((medicine) => (
                            <div
                                key={medicine.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex-1">
                                    <p className="text-gray-900">{medicine.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {medicine.startDate} - {medicine.endDate}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Tamamlandı
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interaction Modal */}
            {showInteractionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-50 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                </div>
                                <h2 className="text-gray-900">İlaç Etkileşimleri</h2>
                            </div>
                            <button
                                onClick={() => setShowInteractionModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {interactions.map((interaction, index) => (
                                <div
                                    key={index}
                                    className={`border-l-4 rounded-lg p-4 ${
                                        interaction.severity === 'high'
                                            ? 'border-red-500 bg-red-50'
                                            : interaction.severity === 'medium'
                                                ? 'border-yellow-500 bg-yellow-50'
                                                : 'border-green-500 bg-green-50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <AlertTriangle
                                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                                interaction.severity === 'high'
                                                    ? 'text-red-600'
                                                    : interaction.severity === 'medium'
                                                        ? 'text-yellow-600'
                                                        : 'text-green-600'
                                            }`}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {interaction.medicine1}
                        </span>
                                                <span className="text-gray-500">+</span>
                                                <span className="text-sm font-medium text-gray-900">
                          {interaction.medicine2}
                        </span>
                                            </div>
                                            <span
                                                className={`inline-block px-2 py-1 rounded text-xs mb-2 ${
                                                    interaction.severity === 'high'
                                                        ? 'bg-red-100 text-red-700'
                                                        : interaction.severity === 'medium'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-green-100 text-green-700'
                                                }`}
                                            >
                        {interaction.severity === 'high'
                            ? 'Yüksek Risk'
                            : interaction.severity === 'medium'
                                ? 'Orta Risk'
                                : 'Düşük Risk'}
                      </span>
                                            <p className="text-sm text-gray-700">{interaction.warning}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                                <p className="text-sm text-blue-900">
                                    <strong>Önemli:</strong> Bu uyarılar bilgilendirme amaçlıdır. İlaçlarınızı kullanmaya
                                    devam etmeden önce mutlaka doktorunuza danışın.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => setShowInteractionModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Kapat
                            </button>
                            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Doktoruma Danış
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
