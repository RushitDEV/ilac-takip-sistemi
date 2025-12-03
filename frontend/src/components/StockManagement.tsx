/*********************************************************************
 * PREMIUM UI REVAMP — STOCK MANAGEMENT
 * Backend endpoints değişmedi, sadece görsel iyileştirme yapıldı.
 *********************************************************************/

import { useState, useEffect } from "react";
import {
    AlertTriangle,
    PlusCircle,
    MinusCircle,
    PackageSearch,
    Warehouse,
    Boxes
} from "lucide-react";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [allMedications, setAllMedications] = useState<any[]>([]);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [adjustType, setAdjustType] = useState<"add" | "remove">("add");
    const [adjustAmount, setAdjustAmount] = useState("");
    const [adjustNote, setAdjustNote] = useState("");
    const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
    const [selectedMedicationId, setSelectedMedicationId] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    /*********************************************************************
     * STATUS CALCULATOR
     *********************************************************************/
    const calculateStatus = (
        current: number,
        min: number,
        expiryDate?: string | null
    ) => {
        let expiryCritical = false;

        if (expiryDate) {
            const today = new Date();
            const exp = new Date(expiryDate);
            const diff = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24);
            if (diff <= 7) expiryCritical = true;
            else if (diff <= 30 && current > min * 1.5) return "low";
        }

        if (expiryCritical) return "critical";
        if (current <= min) return "critical";
        if (current <= min * 1.5) return "low";
        return "good";
    };

    /*********************************************************************
     * LOAD FUNCTIONS
     *********************************************************************/
    const loadStock = async () => {
        try {
            const data = await apiClient(API_ENDPOINTS.STOCK_LIST);

            const mapped: StockItem[] = (data || []).map((item: any) => {
                const expiry =
                    item.expiryDate ||
                    item.medication?.expiryDate ||
                    item.medication?.expirationDate ||
                    null;

                return {
                    id: item.id,
                    medicationId: item.medication.id,
                    name: item.medication.name,
                    barcode: item.medication.barcode,
                    manufacturer: item.medication.manufacturer,
                    activeIngredient: item.medication.activeIngredient,
                    stock: item.currentStock,
                    minStock: item.minStock,
                    maxStock: item.maxStock,
                    lastRestocked: item.lastRestock,
                    expiryDate: expiry,
                    price: item.medication.price || 0,
                    status: calculateStatus(item.currentStock, item.minStock, expiry)
                };
            });

            setStocks(mapped);
        } catch (err: any) {
            alert("Stok listesi alınamadı!");
        }
    };

    const loadMedications = async () => {
        const meds = await apiClient(API_ENDPOINTS.MEDICATION_LIST);
        setAllMedications(meds || []);
    };

    useEffect(() => {
        loadStock();
        loadMedications();
    }, []);

    /*********************************************************************
     * FILTER
     *********************************************************************/
    const filtered = stocks.filter(
        (x) =>
            x.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            x.barcode.includes(searchTerm)
    );

    /*********************************************************************
     * MODAL OPEN & CLOSE
     *********************************************************************/
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

    /*********************************************************************
     * SAVE STOCK
     *********************************************************************/
    const handleAdjustStock = async () => {
        const amountNum = parseInt(adjustAmount, 10);
        if (!amountNum || amountNum <= 0) return alert("Geçerli bir miktar girin!");

        setIsSaving(true);

        try {
            if (adjustType === "add" && !selectedStock) {
                await apiClient(API_ENDPOINTS.STOCK_ADD, {
                    method: "POST",
                    data: {
                        medicationId: Number(selectedMedicationId),
                        amount: amountNum,
                        note: adjustNote,
                        minStock: 5,
                        maxStock: 100
                    }
                });
            } else if (adjustType === "add" && selectedStock) {
                await apiClient(API_ENDPOINTS.STOCK_ADD, {
                    method: "POST",
                    data: {
                        medicationId: selectedStock.medicationId,
                        amount: amountNum,
                        note: adjustNote
                    }
                });
            } else {
                await apiClient(API_ENDPOINTS.STOCK_REMOVE, {
                    method: "POST",
                    data: {
                        stockId: selectedStock?.id,
                        amount: amountNum,
                        note: adjustNote
                    }
                });
            }

            await loadStock();
            closeAdjustModal();
        } catch {
            alert("Stok güncellenemedi.");
        } finally {
            setIsSaving(false);
        }
    };

    /*********************************************************************
     * UI — MAIN
     *********************************************************************/
    return (
        <div className="max-w-7xl mx-auto p-4 space-y-10">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-3 rounded-xl text-white">
                        <Warehouse className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Stok Yönetimi</h2>
                </div>

                <button
                    onClick={() => openAdjustModal(null, "add")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 transition"
                >
                    <PlusCircle className="w-5 h-5" /> Yeni Stok Ekle
                </button>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
                <PackageSearch className="w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="İlaç adı veya barkod ara..."
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 text-gray-700 text-sm border-b">
                    <tr>
                        <th className="p-3 text-left">İlaç</th>
                        <th className="p-3">Barkod</th>
                        <th className="p-3">Üretici</th>
                        <th className="p-3">Etken Madde</th>
                        <th className="p-3 text-center">Stok</th>
                        <th className="p-3 text-center">Durum</th>
                        <th className="p-3 text-center">İşlem</th>
                    </tr>
                    </thead>

                    <tbody className="text-sm">
                    {filtered.map((s, idx) => (
                        <tr
                            key={s.id}
                            className={`border-b hover:bg-gray-50 transition ${
                                idx % 2 ? "bg-white" : "bg-gray-50/50"
                            }`}
                        >
                            <td className="p-3 font-semibold">{s.name}</td>
                            <td className="p-3">{s.barcode}</td>
                            <td className="p-3">{s.manufacturer}</td>
                            <td className="p-3">{s.activeIngredient}</td>

                            <td className="p-3 text-center font-bold">{s.stock}</td>

                            <td className="p-3 text-center">
                                {s.status === "critical" && (
                                    <span className="px-3 py-1 bg-red-100 border border-red-300 text-red-700 rounded-lg font-semibold flex items-center justify-center gap-1">
                                            <AlertTriangle size={14} /> Kritik
                                        </span>
                                )}
                                {s.status === "low" && (
                                    <span className="px-3 py-1 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg font-semibold">
                                            Düşük
                                        </span>
                                )}
                                {s.status === "good" && (
                                    <span className="px-3 py-1 bg-green-100 border border-green-300 text-green-700 rounded-lg font-semibold">
                                            İyi
                                        </span>
                                )}
                            </td>

                            <td className="p-3 flex justify-center gap-2">
                                <button
                                    onClick={() => openAdjustModal(s, "add")}
                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
                                >
                                    <PlusCircle size={16} />
                                </button>

                                <button
                                    onClick={() => openAdjustModal(s, "remove")}
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
                                >
                                    <MinusCircle size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showAdjustModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-5">

                        <h3 className="text-xl font-bold text-gray-900">
                            {adjustType === "add"
                                ? selectedStock
                                    ? "Stok Artır"
                                    : "Yeni Stok Oluştur"
                                : "Stok Düşür"}
                        </h3>

                        {!selectedStock && adjustType === "add" && (
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">
                                    İlaç Seç
                                </label>
                                <select
                                    className="w-full border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedMedicationId}
                                    onChange={(e) =>
                                        setSelectedMedicationId(e.target.value)
                                    }
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
                            <div className="bg-gray-50 border rounded-lg p-3 text-sm">
                                Mevcut stok:{" "}
                                <span className="font-bold">{selectedStock.stock}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Miktar</label>
                            <input
                                type="number"
                                min={1}
                                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={adjustAmount}
                                onChange={(e) => setAdjustAmount(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Not (opsiyonel)</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Satış, tedarik, iade vs."
                                value={adjustNote}
                                onChange={(e) => setAdjustNote(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={closeAdjustModal}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                            >
                                İptal
                            </button>

                            <button
                                onClick={handleAdjustStock}
                                disabled={isSaving}
                                className={`px-4 py-2 rounded-lg text-white shadow transition ${
                                    adjustType === "add"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                }`}
                            >
                                {isSaving
                                    ? "Kaydediliyor..."
                                    : adjustType === "add"
                                        ? "Stok Ekle"
                                        : "Stok Düş"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
