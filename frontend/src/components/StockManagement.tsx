import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, Search, Filter } from 'lucide-react';
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

export function StockManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [stocks, setStocks] = useState<any[]>([]);

    // STATUS hesaplama
    const calculateStatus = (current: number, min: number) => {
        if (current <= min) return "critical";
        if (current <= min * 1.5) return "low";
        return "good";
    };

    // Backend'den stok çekme
    const loadStock = async () => {
        try {
            const data = await apiClient(API_ENDPOINTS.STOCK_LIST);

            const mapped = data.map((item: any) => ({
                id: item.id,
                name: item.medication.name,
                barcode: item.medication.barcode,
                manufacturer: item.medication.manufacturer,
                activeIngredient: item.medication.activeIngredient,
                stock: item.currentStock,
                minStock: item.minStock,
                maxStock: item.maxStock,
                lastRestocked: item.lastRestock,
                expiryDate: "—", // Medication’da SKT yoksa sabit gösterilir
                price: item.medication.price ?? 0,
                status: calculateStatus(item.currentStock, item.minStock),
            }));

            setStocks(mapped);
        } catch (err: any) {
            alert("Stok listesi yüklenemedi: " + err.message);
        }
    };

    useEffect(() => {
        loadStock();
    }, []);

    const filteredMedicines = stocks.filter((med) => {
        const matchesSearch =
            med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.barcode.includes(searchTerm);
        const matchesFilter =
            filterStatus === 'all' || med.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalStock = stocks.reduce((sum, med) => sum + med.stock, 0);
    const lowStockCount = stocks.filter((med) => med.status === 'low' || med.status === 'critical').length;
    const totalValue = stocks.reduce((sum, med) => sum + med.stock * med.price, 0);

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
                    <p className="text-gray-900">{stocks.length}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                {/* Search */}
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
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg"
                            >
                                <option value="all">Tüm Durumlar</option>
                                <option value="good">İyi</option>
                                <option value="low">Düşük</option>
                                <option value="critical">Kritik</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
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
                                    <p className="text-sm text-gray-900">{medicine.stock} kutu</p>
                                </td>

                                <td className="py-4 px-4 text-sm text-gray-600">{medicine.expiryDate}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">₺{medicine.price}</td>

                                <td className="py-4 px-4">
                    <span
                        className={`px-3 py-1 rounded-full text-xs ${
                            medicine.status === "good"
                                ? "bg-green-100 text-green-700"
                                : medicine.status === "low"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                        }`}
                    >
                      {medicine.status === "good"
                          ? "İyi"
                          : medicine.status === "low"
                              ? "Düşük"
                              : "Kritik"}
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
