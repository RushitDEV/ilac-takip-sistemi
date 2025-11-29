import { useState } from 'react';
import { Scan, Plus, Check } from 'lucide-react';

export function MedicineRegistration() {
  const [barcode, setBarcode] = useState('');
  const [scannedMedicines, setScannedMedicines] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!barcode) return;

    // Simulated medicine data
    const mockMedicine = {
      barcode: barcode,
      name: 'Parol 500mg',
      activeIngredient: 'Paracetamol',
      manufacturer: 'Atabay İlaç',
      batchNo: 'LOT2024' + Math.floor(Math.random() * 1000),
      expiryDate: '2026-12-31',
      quantity: Math.floor(Math.random() * 100) + 1,
      price: (Math.random() * 100 + 10).toFixed(2),
    };

    setScannedMedicines([mockMedicine, ...scannedMedicines]);
    setBarcode('');
    setIsScanning(false);
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-gray-900 mb-6">Barkod ile İlaç Kaydı</h2>

        {/* Barcode Scanner Section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-2">
                Barkod Numarası
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                  placeholder="Barkodu tarayın veya manuel girin"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleScan}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Scan className="w-5 h-5" />
                  Tara
                </button>
              </div>
            </div>
          </div>

          {isScanning && (
            <div className="p-8 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 text-center">
              <Scan className="w-12 h-12 text-blue-600 mx-auto mb-3 animate-pulse" />
              <p className="text-blue-900">Barkod taranıyor...</p>
              <p className="text-sm text-blue-700 mt-1">
                Barkodu okuyucu ile tarayın
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setIsScanning(!isScanning)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Scan className="w-5 h-5" />
              Barkod Okuyucu Başlat
            </button>
            <button className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Manuel İlaç Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Scanned Medicines */}
      {scannedMedicines.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">
              Taranan İlaçlar ({scannedMedicines.length})
            </h2>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Check className="w-5 h-5" />
              Tümünü Kaydet
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-700">
                    Barkod
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">
                    İlaç Adı
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">
                    Etken Madde
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">
                    Üretici
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">
                    Lot No
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">
                    SKT
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">
                    Adet
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">
                    Fiyat
                  </th>
                </tr>
              </thead>
              <tbody>
                {scannedMedicines.map((medicine, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {medicine.barcode}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {medicine.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {medicine.activeIngredient}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {medicine.manufacturer}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {medicine.batchNo}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {medicine.expiryDate}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {medicine.quantity}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      ₺{medicine.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-blue-900 mb-2">Barkod Sistemi Hakkında</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Türkiye'de ilaç barkodları ITS (İlaç Takip Sistemi) standardına uygun olmalıdır</li>
          <li>• Her ilaç kutusu üzerinde benzersiz bir barkod bulunur</li>
          <li>• Barkodlar sayesinde ilaçların üretimden satışa kadar tüm hareketleri izlenir</li>
          <li>• Sahte ilaç kullanımının önüne geçilir ve hasta güvenliği sağlanır</li>
        </ul>
      </div>
    </div>
  );
}
