import { useState } from 'react';
import { Factory, Microscope, Package, Truck, Store, User, Trash2, ChevronRight } from 'lucide-react';

export function Lifecycle() {
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);

  const lifecycleData = {
    barcode: '8691234567890',
    name: 'Parol 500mg',
    activeIngredient: 'Paracetamol',
    batchNo: 'LOT2024789',
    stages: [
      {
        id: 1,
        name: 'Üretim',
        icon: Factory,
        status: 'completed',
        date: '2024-10-15',
        location: 'Atabay İlaç Fabrikası - İstanbul',
        details: 'Üretim tamamlandı, kalite kontrol sürecine gönderildi',
        responsible: 'Üretim Müdürü: Ahmet Yılmaz',
        documents: ['Üretim Raporu', 'GMP Belgesi'],
      },
      {
        id: 2,
        name: 'Kalite Kontrol',
        icon: Microscope,
        status: 'completed',
        date: '2024-10-18',
        location: 'Kalite Kontrol Laboratuvarı - İstanbul',
        details: 'Tüm testler başarıyla tamamlandı, ruhsat onayı alındı',
        responsible: 'Kalite Kontrol Sorumlusu: Dr. Zeynep Kaya',
        documents: ['Test Raporu', 'Analiz Sonuçları', 'Ruhsat Belgesi'],
      },
      {
        id: 3,
        name: 'Depolama',
        icon: Package,
        status: 'completed',
        date: '2024-10-20',
        location: 'Merkez Depo - İstanbul',
        details: 'Uygun koşullarda depolandı, barkod sistemi ile kayıt altına alındı',
        responsible: 'Depo Sorumlusu: Mehmet Demir',
        documents: ['Depo Giriş Formu', 'Sıcaklık Kayıtları'],
      },
      {
        id: 4,
        name: 'Dağıtım',
        icon: Truck,
        status: 'completed',
        date: '2024-10-25',
        location: 'Soğuk Zincir Lojistik - Transit',
        details: 'İlaç dağıtım firması aracılığıyla eczanelere gönderildi',
        responsible: 'Lojistik Koordinatörü: Ali Şahin',
        documents: ['Sevkiyat Formu', 'Taşıma Belgesi'],
      },
      {
        id: 5,
        name: 'Eczane',
        icon: Store,
        status: 'completed',
        date: '2024-10-28',
        location: 'Merkez Eczanesi - Ankara',
        details: 'Eczane stoğuna eklendi, satışa hazır',
        responsible: 'Eczacı: Dr. Ayşe Yılmaz',
        documents: ['Teslim Tutanağı', 'Stok Giriş Formu'],
      },
      {
        id: 6,
        name: 'Satış',
        icon: User,
        status: 'completed',
        date: '2024-11-25',
        location: 'Merkez Eczanesi - Ankara',
        details: 'Hastaya reçete ile teslim edildi',
        responsible: 'Eczacı: Dr. Ayşe Yılmaz',
        documents: ['Reçete', 'Satış Fişi', 'ITS Bildirim'],
      },
      {
        id: 7,
        name: 'İmha',
        icon: Trash2,
        status: 'pending',
        date: '-',
        location: '-',
        details: 'Kullanım sonrası veya son kullanma tarihinde imha edilecek',
        responsible: '-',
        documents: [],
      },
    ],
  };

  const medicines = [
    {
      barcode: '8691234567890',
      name: 'Parol 500mg',
      batchNo: 'LOT2024789',
      currentStage: 'Satış',
      completedStages: 6,
      totalStages: 7,
    },
    {
      barcode: '8691234567891',
      name: 'Coraspin 100mg',
      batchNo: 'LOT2024790',
      currentStage: 'Eczane',
      completedStages: 5,
      totalStages: 7,
    },
    {
      barcode: '8691234567892',
      name: 'Majezik 275mg',
      batchNo: 'LOT2024791',
      currentStage: 'Dağıtım',
      completedStages: 4,
      totalStages: 7,
    },
  ];

  return (
    <div className="max-w-7xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-gray-900 mb-4">İlaç Yaşam Döngüsü Takibi</h2>
        <p className="text-sm text-gray-600 mb-6">
          İlacın üretiminden imhasına kadar tüm aşamaları takip edin
        </p>

        {/* Medicine Selection */}
        <div className="space-y-3 mb-6">
          {medicines.map((medicine) => (
            <button
              key={medicine.barcode}
              onClick={() => setSelectedMedicine(medicine)}
              className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-gray-900">{medicine.name}</p>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      {medicine.currentStage}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Barkod: {medicine.barcode}</span>
                    <span>•</span>
                    <span>Lot: {medicine.batchNo}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-600">
                        İlerleme: {medicine.completedStages}/{medicine.totalStages}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(medicine.completedStages / medicine.totalStages) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lifecycle Timeline */}
      {selectedMedicine && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-gray-900 mb-1">{lifecycleData.name}</h3>
            <p className="text-sm text-gray-600">
              Barkod: {lifecycleData.barcode} • Lot No: {lifecycleData.batchNo}
            </p>
          </div>

          <div className="space-y-6">
            {lifecycleData.stages.map((stage, index) => {
              const Icon = stage.icon;
              const isCompleted = stage.status === 'completed';
              const isLast = index === lifecycleData.stages.length - 1;

              return (
                <div key={stage.id} className="relative">
                  {!isLast && (
                    <div
                      className={`absolute left-6 top-12 bottom-0 w-0.5 ${
                        isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      style={{ height: 'calc(100% + 24px)' }}
                    />
                  )}

                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gray-900">{stage.name}</p>
                          {stage.date !== '-' && (
                            <p className="text-sm text-gray-600">{stage.date}</p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            isCompleted
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isCompleted ? 'Tamamlandı' : 'Bekliyor'}
                        </span>
                      </div>

                      {isCompleted && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div>
                            <p className="text-sm text-gray-700 mb-1">Konum</p>
                            <p className="text-sm text-gray-900">{stage.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 mb-1">Detaylar</p>
                            <p className="text-sm text-gray-900">{stage.details}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 mb-1">Sorumlu</p>
                            <p className="text-sm text-gray-900">{stage.responsible}</p>
                          </div>
                          {stage.documents.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-700 mb-2">Belgeler</p>
                              <div className="flex flex-wrap gap-2">
                                {stage.documents.map((doc, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700"
                                  >
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-blue-900 mb-2">İlaç Yaşam Döngüsü Takibi Hakkında</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Her ilacın üretiminden imhasına kadar tüm aşamaları takip edilir</li>
          <li>• Barkod sistemi ile her aşama otomatik olarak kaydedilir</li>
          <li>• Sorunlu ilaçların geri çağrılması kolaylaşır</li>
          <li>• Hasta güvenliği ve ilaç kalitesi garanti altına alınır</li>
          <li>• Yasal düzenlemelere tam uyumluluk sağlanır</li>
        </ul>
      </div>
    </div>
  );
}
