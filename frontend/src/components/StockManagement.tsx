import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";
import { Plus, Minus, AlertTriangle } from "lucide-react";

export function StockManagement() {
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const [selectedStock, setSelectedStock] = useState<any>(null);
    const [amount, setAmount] = useState(0);

    // --------------------------------------------
    // STOKLARI YÜKLE
    // --------------------------------------------
    const loadStocks = async () => {
        try {
            const data = await apiClient(API_ENDPOINTS.STOCK_LIST);
            setStocks(data || []);
        } catch (err: any) {
            setError(err.message || "Stoklar yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStocks();
    }, []);

    // --------------------------------------------
    // STOK EKLE
    // --------------------------------------------
    const handleAddStock = async () => {
        try {
            await apiClient(API_ENDPOINTS.STOCK_ADD, {
                method: "POST",
                data: {
                    medicationId: selectedStock.medication.id,
                    amount: amount,
                    minStock: selectedStock.minStock,
                    maxStock: selectedStock.maxStock
                }
            });

            setShowAddModal(false);
            setAmount(0);
            loadStocks();
        } catch (err: any) {
            alert("Hata: " + err.message);
        }
    };

    // --------------------------------------------
    // STOK AZALT
    // --------------------------------------------
    const handleRemoveStock = async () => {
        try {
            await apiClient(API_ENDPOINTS.STOCK_REMOVE, {
                method: "POST",
                data: {
                    stockId: selectedStock.id,
                    amount: amount,
                }
            });

            setShowRemoveModal(false);
            setAmount(0);
            loadStocks();
        } catch (err: any) {
            alert("Hata: " + err.message);
        }
    };

    // --------------------------------------------
    // DURUM RENKLERİ
    // --------------------------------------------
    const getStatus = (s: any) => {
        if (s.currentStock === 0) return { label: "Tükendi", color: "text-red-600" };
        if (s.currentStock <= s.minStock) return { label: "Düşük", color: "text-orange-500" };
        return { label: "Normal", color: "text-green-600" };
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Stok Yönetimi</h2>

            {loading && <p>Yükleniyor...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* TABLO */}
            <table className="w-full border rounded-lg">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-3">İlaç Adı</th>
                    <th className="p-3">Üretici</th>
                    <th className="p-3">Stok</th>
                    <th className="p-3">Fiyat</th>
                    <th className="p-3">Durum</th>
                    <th className="p-3">İşlem</th>
                </tr>
                </thead>

                <tbody>
                {stocks.map((s: any) => {
                    const status = getStatus(s);

                    return (
                        <tr key={s.id} className="border-t">
                            <td className="p-3">{s.medication.name}</td>
                            <td className="p-3">{s.medication.manufacturer}</td>
                            <td className="p-3">{s.currentStock}</td>
                            <td className="p-3">{s.medication.price} ₺</td>

                            <td className={`p-3 font-semibold ${status.color}`}>
                                {status.label}
                            </td>

                            <td className="p-3 flex gap-2">
                                <button
                                    className="px-3 py-1 bg-green-600 text-white rounded-md flex items-center gap-1"
                                    onClick={() => {
                                        setSelectedStock(s);
                                        setShowAddModal(true);
                                    }}
                                >
                                    <Plus className="w-4 h-4" /> Ekle
                                </button>

                                <button
                                    className="px-3 py-1 bg-red-600 text-white rounded-md flex items-center gap-1"
                                    onClick={() => {
                                        setSelectedStock(s);
                                        setShowRemoveModal(true);
                                    }}
                                >
                                    <Minus className="w-4 h-4" /> Azalt
                                </button>
                            </td>
                        </tr>
                    );
                })}

                {stocks.length === 0 && !loading && (
                    <tr>
                        <td className="p-3" colSpan={6}>Hiç stok yok.</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* --------------------------------------------------------- */}
            {/* STOK EKLE MODALI */}
            {/* --------------------------------------------------------- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-96 space-y-4">
                        <h3 className="text-xl font-bold">Stok Ekle</h3>

                        <p><b>İlaç:</b> {selectedStock.medication.name}</p>

                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            placeholder="Eklenecek miktar"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                onClick={() => setShowAddModal(false)}
                            >
                                İptal
                            </button>

                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                onClick={handleAddStock}
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --------------------------------------------------------- */}
            {/* STOK AZALT MODALI */}
            {/* --------------------------------------------------------- */}
            {showRemoveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-96 space-y-4">
                        <h3 className="text-xl font-bold">Stok Azalt</h3>

                        <p><b>İlaç:</b> {selectedStock.medication.name}</p>

                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            placeholder="Azaltılacak miktar"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                onClick={() => setShowRemoveModal(false)}
                            >
                                İptal
                            </button>

                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                onClick={handleRemoveStock}
                            >
                                Azalt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
