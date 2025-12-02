import { useState, useEffect } from 'react';
import {
    AlertTriangle,
    PlusCircle,
    MinusCircle,
} from 'lucide-react';
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

interface StockItem {
    id: number;
    medicationId: number;
    name: string;
    barcode: string;
    manufacturer: string;
    activeIngredient: string;
    stock: number;
    minStock: number;
    maxStock: number;
    lastRestocked?: string;
    expiryDate?: string | null;
    price: number;
    status: "good" | "low" | "critical";
}

export function StockManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus] = useState<'all' | 'good' | 'low' | 'critical'>('all');
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [allMedications, setAllMedications] = useState<any[]>([]);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [adjustType, setAdjustType] = useState<"add" | "remove">("add");
    const [adjustAmount, setAdjustAmount] = useState<string>("");
    const [adjustNote, setAdjustNote] = useState<string>("");
    const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
    const [selectedMedicationId, setSelectedMedicationId] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    const calculateStatus = (current: number, min: number, expiryDate?: string | null) => {
        let expiryCritical = false;

        if (expiryDate) {
            const today = new Date();
            const exp = new Date(expiryDate);
            const diffDays = (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

            if (diffDays <= 7) expiryCritical = true;
            else if (diffDays <= 30 && current > min * 1.5) return "low";
        }

        if (expiryCritical) return "critical";
        if (current <= min) return "critical";
        if (current <= min * 1.5) return "low";
        return "good";
    };

    const loadStock = async () => {
        try {
            const data = await apiClient(API_ENDPOINTS.STOCK_LIST);

            const mapped: StockItem[] = (data || []).map((item: any) => {
                const expiry =
                    item.expiryDate ??
                    item.medication?.expiryDate ??
                    item.medication?.expirationDate ??
                    null;

                return {
                    id: item.id,
                    medicationId: item.medication.id, // ✔ EKLENDİ
                    name: item.medication.name,
                    barcode: item.medication.barcode,
                    manufacturer: item.medication.manufacturer,
                    activeIngredient: item.medication.activeIngredient,
                    stock: item.currentStock,
                    minStock: item.minStock,
                    maxStock: item.maxStock,
                    lastRestocked: item.lastRestock,
                    expiryDate: expiry,
                    price: item.medication.price ?? 0,
                    status: calculateStatus(item.currentStock, item.minStock, expiry),
                };
            });

            setStocks(mapped);
        } catch (err: any) {
            alert("Stok listesi yüklenemedi: " + (err.message || ""));
        }
    };

    const loadMedications = async () => {
        try {
            const meds = await apiClient(API_ENDPOINTS.MEDICATION_LIST);
            setAllMedications(meds || []);
        } catch {
            console.error("İlaçlar yüklenemedi.");
        }
    };

    useEffect(() => {
        loadStock();
        loadMedications();
    }, []);

    const filteredMedicines = stocks.filter((med) => {
        const matchesSearch =
            med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.barcode.includes(searchTerm);

        return matchesSearch;
    });

    const openAdjustModal = (stock: StockItem | null, type: "add" | "remove") => {
        setSelectedStock(stock);
        setAdjustType(type);
        setAdjustAmount("");
        setAdjustNote("");
        setSelectedMedicationId("");
        setShowAdjustModal(true);
    };

    const closeAdjustModal = () => {
        setShowAdjustModal(false);
        setSelectedStock(null);
        setSelectedMedicationId("");
        setAdjustAmount("");
    };

    const handleAdjustStock = async () => {
        const amountNum = parseInt(adjustAmount, 10);
        if (isNaN(amountNum) || amountNum <= 0) {
            alert("Geçerli bir miktar girin.");
            return;
        }

        setIsSaving(true);

        try {
            if (adjustType === "add" && !selectedStock) {
                // ✔ YENİ STOK EKLEME
                await apiClient(API_ENDPOINTS.STOCK_ADD, {
                    method: "POST",
                    data: {
                        medicationId: Number(selectedMedicationId),
                        amount: amountNum,
                        note: adjustNote,
                        minStock: 5,
                        maxStock: 100
                    },
                });
            } else if (adjustType === "add" && selectedStock) {
                // ✔ MEVCUT STOĞU ARTIRMA
                await apiClient(API_ENDPOINTS.STOCK_ADD, {
                    method: "POST",
                    data: {
                        medicationId: selectedStock.medicationId, // ✔ DÜZELTİLDİ
                        amount: amountNum,
                        note: adjustNote,
                    },
                });
            } else {
                // ✔ STOĞU DÜŞÜRME
                await apiClient(API_ENDPOINTS.STOCK_REMOVE, {
                    method: "POST",
                    data: {
                        stockId: selectedStock?.id, // REMOVE için doğru
                        amount: amountNum,
                        note: adjustNote,
                    },
                });
            }

            await loadStock();
            closeAdjustModal();
        } catch (error: any) {
            alert("Stok güncellenemedi: " + JSON.stringify(error));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">

            <div className="flex justify-between items-center my-6">
                <h2 className="text-2xl font-bold">Stok Yönetimi</h2>

                <button
                    onClick={() => openAdjustModal(null, "add")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" /> Yeni Stok Ekle
                </button>
            </div>

            {/* --- STOK TABLOSU --- */}
            <div className="bg-white rounded-xl shadow p-4">
                <table className="w-full text-left">
                    <thead>
                    <tr className="border-b text-gray-600">
                        <th className="py-2">İlaç</th>
                        <th>Barkod</th>
                        <th>Üretici</th>
                        <th>Etken Madde</th>
                        <th>Stok</th>
                        <th>Durum</th>
                        <th>İşlem</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredMedicines.map((s) => (
                        <tr key={s.id} className="border-b">
                            <td className="py-2 font-semibold">{s.name}</td>
                            <td>{s.barcode}</td>
                            <td>{s.manufacturer}</td>
                            <td>{s.activeIngredient}</td>
                            <td>{s.stock}</td>

                            <td>
                                {s.status === "critical" && (
                                    <span className="text-red-600 font-bold flex items-center gap-1">
                                        <AlertTriangle size={16} /> Kritik
                                    </span>
                                )}
                                {s.status === "low" && (
                                    <span className="text-yellow-600 font-bold">Düşük</span>
                                )}
                                {s.status === "good" && (
                                    <span className="text-green-600 font-bold">İyi</span>
                                )}
                            </td>

                            <td className="flex gap-2 py-2">
                                <button
                                    onClick={() => openAdjustModal(s, "add")}
                                    className="p-2 bg-green-600 text-white rounded"
                                >
                                    <PlusCircle size={16}/>
                                </button>
                                <button
                                    onClick={() => openAdjustModal(s, "remove")}
                                    className="p-2 bg-red-600 text-white rounded"
                                >
                                    <MinusCircle size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL --- */}
            {showAdjustModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">
                        <h3 className="text-lg font-bold">
                            {adjustType === "add"
                                ? selectedStock ? "Stok Ekle" : "Yeni Stok Ekle"
                                : "Stok Düşür"}
                        </h3>

                        {/* Yeni stok eklerken ilaç seçimi */}
                        {!selectedStock && adjustType === "add" && (
                            <div>
                                <label className="block text-sm mb-1 font-medium">İlaç Seç</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={selectedMedicationId}
                                    onChange={(e) => setSelectedMedicationId(e.target.value)}
                                >
                                    <option value="">Seçiniz</option>
                                    {allMedications.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} – {m.activeIngredient}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {selectedStock && (
                            <p className="text-sm">
                                Mevcut stok: <b>{selectedStock.stock} kutu</b>
                            </p>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Miktar</label>
                            <input
                                type="number"
                                min={1}
                                className="w-full border p-2 rounded"
                                value={adjustAmount}
                                onChange={(e) => setAdjustAmount(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Not (opsiyonel)</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Satış, tedarik, iade..."
                                value={adjustNote}
                                onChange={(e) => setAdjustNote(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={closeAdjustModal}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                İptal
                            </button>

                            <button
                                onClick={handleAdjustStock}
                                disabled={isSaving}
                                className={`px-4 py-2 rounded-lg text-white ${
                                    adjustType === "add"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                }`}
                            >
                                {isSaving ? "Kaydediliyor..." : adjustType === "add" ? "Ekle" : "Düşür"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
