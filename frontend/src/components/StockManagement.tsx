import { useState } from 'react';
import { Package, AlertTriangle, TrendingUp, Search, Filter } from 'lucide-react';

export function StockManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const medicines = [
    {
      id: 1,
      name: 'Parol 500mg',
      barcode: '8691234567890',
      activeIngredient: 'Paracetamol',
      manufacturer: 'Atabay İlaç',
      stock: 450,
      minStock: 100,
      maxStock: 1000,
      expiryDate: '2026-12-31',
      lastRestocked: '2024-11-20',
      status: 'good',
      price: 12.50,
    },
    {
      id: 2,
      name: 'Plavix 75mg',
      barcode: '8691234567893',
      activeIngredient: 'Clopidogrel',
      manufacturer: 'Sanofi',
      stock: 15,
      minStock: 50,
      maxStock: 500,
      expiryDate: '2025-06-30',
      lastRestocked: '2024-10-15',
      status: 'low',
      price: 89.90,
    },
    {
      id: 3,
      name: 'Coraspin 100mg',
      barcode: '8691234567891',
      activeIngredient: 'Aspirin',
      manufacturer: 'Bayer',
      stock: 8,
      minStock: 75,
      maxStock: 800,
      expiryDate: '2025-03-15',
      lastRestocked: '2024-09-10',
      status: 'critical',
      price: 24.75,
    },
    {
      id: 4,
      name: 'Majezik 275mg',
      barcode: '8691234567892',
      activeIngredient: 'Dexketoprofen',
      manufacturer: 'Abdi İbrahim',
      stock: 320,
      minStock: 80,
      maxStock: 600,
      expiryDate: '2026-08-20',
      lastRestocked: '2024-11-22',
      status: 'good',
      price: 18.25,
    },
    {
      id: 5,
      name: 'Nexium 40mg',
      barcode: '8691234567895',
      activeIngredient: 'Esomeprazole',
      manufacturer: 'AstraZeneca',
      stock: 12,
      minStock: 60,
      maxStock: 500,
      expiryDate: '2025-12-31',
      lastRestocked: '2024-10-05',
      status: 'low',
      price: 45.50,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-700';
      case 'low':
        return 'bg-yellow-100 text-yellow-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'İyi';
      case 'low':
        return 'Düşük';
      case 'critical':
        return 'Kritik';
      default:
        return 'Bilinmiyor';
    }
  };

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.barcode.includes(searchTerm);
    const matchesFilter =
      filterStatus === 'all' || med.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalStock = medicines.reduce((sum, med) => sum + med.stock, 0);
  const lowStockCount = medicines.filter((med) => med.status === 'low' || med.status === 'critical').length;
  const totalValue = medicines.reduce((sum, med) => sum + med.stock * med.price, 0);

  return (
    <div className="max-w-7xl space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Toplam Stok</p>
          </div>
          <p className="text-gray-900">{totalStock} kutu</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-gray-600">Düşük Stok</p>
          </div>
          <p className="text-gray-900">{lowStockCount} ilaç</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Toplam Değer</p>
          </div>
          <p className="text-gray-900">₺{totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">İlaç Çeşidi</p>
          </div>
          <p className="text-gray-900">{medicines.length}</p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-gray-900 mb-4">Stok Yönetimi</h2>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İlaç adı veya barkod ile ara..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="good">İyi</option>
                <option value="low">Düşük</option>
                <option value="critical">Kritik</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-700">İlaç Adı</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Barkod</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Üretici</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Stok</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">SKT</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Fiyat</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Durum</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">{medicine.name}</p>
                    <p className="text-xs text-gray-600">{medicine.activeIngredient}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{medicine.barcode}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{medicine.manufacturer}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-gray-900">{medicine.stock} kutu</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            medicine.status === 'good'
                              ? 'bg-green-600'
                              : medicine.status === 'low'
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{
                            width: `${Math.min((medicine.stock / medicine.maxStock) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{medicine.expiryDate}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">₺{medicine.price}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(medicine.status)}`}>
                      {getStatusText(medicine.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
