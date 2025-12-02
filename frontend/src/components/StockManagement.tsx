import { useState, useEffect } from 'react';
import {
    Package,
    AlertTriangle,
    TrendingUp,
    Search,
    Filter,
    PlusCircle,
    MinusCircle,
} from 'lucide-react';
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

interface StockItem {
    id: string;
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
    const [filterStatus, setFilterStatus] = useState<'all' | 'good' | 'low' | 'critical'>('all');
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

            if (diffDays <= 7) {
                expiryCritical = true;
            } else if (diffDays <= 30 && current > min * 1.5) {
                return "low";
            }
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

                const status = calculateStatus(
                    item.currentStock,
                    item.minStock,
                    expiry
                );

                return {
                    id: item.id,
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
                    status,
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
        } catch (error) {
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

        const matchesFilter =
            filterStatus === 'all' || med.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const totalStock = stocks.reduce((sum, med) => sum + med.stock, 0);
    const lowStockCount = stocks.filter(
        (med) => med.status === 'low' || med.status === 'critical'
    ).length;
    const totalValue = stocks.reduce(
        (sum, med) => sum + med.stock * med.price,
        0
    );

    const openAdjustModal = (stock: StockItem | null, type: "add" | "remove") => {
        setSelectedStock(stock);
        setAdjustType(type);
        setAdjustAmount("");
        setAdjustNote("");
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
                await apiClient(API_ENDPOINTS.STOCK_ADD, {
                    method: "POST",
                    data: {
                        medicationId: selectedMedicationId,
                        amount: amountNum,
                        note: adjustNote,
                        minStock: 5,
                        maxStock: 100
                    },
                });
            } else {
                await apiClient(
                    adjustType === "add"
                        ? API_ENDPOINTS.STOCK_ADD
                        : API_ENDPOINTS.STOCK_REMOVE,
                    {
                        method: "POST",
                        data: {
                            stockId: selectedStock?.id,
                            amount: amountNum,
                            note: adjustNote,
                        },
                    }
                );
            }

            await loadStock();
            closeAdjustModal();
        } catch (error: any) {
            alert("Stok güncellenemedi: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6 mt-4">
                <h2 className="text-2xl font-bold text-gray-900">Stok Yönetimi</h2>

                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    onClick={() => openAdjustModal(null, "add")}
                >
                    <PlusCircle className="w-5 h-5" />
                    Yeni Stok Ekle
                </button>
            </div>

            {/* mevcut tablo ve modal kodların HİÇ DEĞİŞMİYOR */}
            {/* sadece yukarıdaki buton + ilaç seçme özelliği eklendi */}

            {/* --- BURAYA KADARKİ TABLON KALACAK --- */}

            {/* Modal */}
            {showAdjustModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">
                        <h3 className="text-lg font-bold">
                            {adjustType === "add"
                                ? selectedStock ? "Stok Ekle" : "Yeni Stok Ekle"
                                : "Stok Düşür"}
                        </h3>

                        {/* Yeni stok eklerken ilaç seçimi */}
                        {!selectedStock && (
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
