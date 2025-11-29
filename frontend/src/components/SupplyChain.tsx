import { Factory, Truck, Package, Building2, CheckCircle2, Clock } from 'lucide-react';

export function SupplyChain() {
  const shipments = [
    {
      id: 'SHP-2024-001',
      medicine: 'Parol 500mg',
      barcode: '8691234567890',
      supplier: 'Atabay İlaç A.Ş.',
      quantity: 500,
      status: 'in_transit',
      origin: 'İstanbul Fabrika',
      destination: 'Merkez Eczanesi',
      estimatedArrival: '2024-11-28',
      currentLocation: 'Ankara Depo',
      stages: [
        { name: 'Üretim', completed: true, date: '2024-11-24' },
        { name: 'Kalite Kontrol', completed: true, date: '2024-11-25' },
        { name: 'Depo', completed: true, date: '2024-11-26' },
        { name: 'Transit', completed: false, date: '' },
        { name: 'Teslimat', completed: false, date: '' },
      ],
    },
    {
      id: 'SHP-2024-002',
      medicine: 'Aspirin 100mg',
      barcode: '8691234567891',
      supplier: 'Bayer Türk',
      quantity: 300,
      status: 'delivered',
      origin: 'İzmir Fabrika',
      destination: 'Merkez Eczanesi',
      estimatedArrival: '2024-11-26',
      currentLocation: 'Teslim Edildi',
      stages: [
        { name: 'Üretim', completed: true, date: '2024-11-20' },
        { name: 'Kalite Kontrol', completed: true, date: '2024-11-21' },
        { name: 'Depo', completed: true, date: '2024-11-22' },
        { name: 'Transit', completed: true, date: '2024-11-25' },
        { name: 'Teslimat', completed: true, date: '2024-11-26' },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'Yolda';
      case 'delivered':
        return 'Teslim Edildi';
      case 'pending':
        return 'Bekliyor';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Tedarik Zinciri Takibi</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Yeni Sipariş Oluştur
          </button>
        </div>

        <div className="space-y-6">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-gray-900">{shipment.medicine}</p>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(shipment.status)}`}>
                        {getStatusText(shipment.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Sipariş No: {shipment.id}</span>
                      <span>•</span>
                      <span>Barkod: {shipment.barcode}</span>
                      <span>•</span>
                      <span>Miktar: {shipment.quantity} kutu</span>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Detayları Gör
                  </button>
                </div>
              </div>

              {/* Supply Chain Stages */}
              <div className="p-6">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{
                        width: `${
                          (shipment.stages.filter((s) => s.completed).length /
                            shipment.stages.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  {/* Stages */}
                  <div className="relative flex justify-between">
                    {shipment.stages.map((stage, index) => (
                      <div key={index} className="flex flex-col items-center" style={{ width: '20%' }}>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                            stage.completed
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {index === 0 && <Factory className="w-6 h-6" />}
                          {index === 1 && <CheckCircle2 className="w-6 h-6" />}
                          {index === 2 && <Building2 className="w-6 h-6" />}
                          {index === 3 && <Truck className="w-6 h-6" />}
                          {index === 4 && <Package className="w-6 h-6" />}
                        </div>
                        <p
                          className={`text-sm text-center mb-1 ${
                            stage.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {stage.name}
                        </p>
                        {stage.date && (
                          <p className="text-xs text-gray-600">{stage.date}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Tedarikçi</p>
                      <p className="text-gray-900">{shipment.supplier}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Çıkış Noktası</p>
                      <p className="text-gray-900">{shipment.origin}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Mevcut Konum</p>
                      <p className="text-gray-900">{shipment.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Tahmini Varış</p>
                      <p className="text-gray-900">{shipment.estimatedArrival}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suppliers */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-gray-900 mb-4">Tedarikçiler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Atabay İlaç A.Ş.', activeOrders: 3, totalDelivered: 1250 },
            { name: 'Bayer Türk', activeOrders: 2, totalDelivered: 980 },
            { name: 'Livas İlaç', activeOrders: 1, totalDelivered: 750 },
          ].map((supplier, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <p className="text-gray-900 mb-3">{supplier.name}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Aktif Siparişler</span>
                  <span className="text-gray-900">{supplier.activeOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Teslimat</span>
                  <span className="text-gray-900">{supplier.totalDelivered}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
