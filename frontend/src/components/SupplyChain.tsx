import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";
import { Package, Truck, MapPin, Calendar, Boxes } from "lucide-react";

export function SupplyChain() {
    const [shipments, setShipments] = useState<any[]>([]);
    const [medications, setMedications] = useState<any[]>([]);
    const [form, setForm] = useState({
        medicationId: "",
        supplier: "",
        origin: "",
        destination: "",
        estimatedArrival: "",
        quantity: ""
    });

    const loadShipments = async () => {
        const data = await apiClient(API_ENDPOINTS.SHIPMENT_LIST);
        setShipments(data);
    };

    const loadMedications = async () => {
        const meds = await apiClient(API_ENDPOINTS.MEDICATION_LIST);
        setMedications(meds);
    };

    const createShipment = async (e: any) => {
        e.preventDefault();

        if (!form.medicationId) return alert("İlaç seçmelisin!");
        if (!form.quantity) return alert("Miktar boş olamaz!");

        await apiClient(API_ENDPOINTS.SHIPMENT_CREATE, {
            method: "POST",
            data: {
                medicationId: form.medicationId,
                supplier: form.supplier,
                origin: form.origin,
                destination: form.destination,
                estimatedArrival: form.estimatedArrival,
                quantity: form.quantity
            }
        });

        alert("Sevkiyat oluşturuldu!");
        loadShipments();
    };

    const updateStatus = async (id: string, status: string) => {
        await apiClient(API_ENDPOINTS.SHIPMENT_UPDATE(id), {
            method: "PUT",
            data: { status }
        });
        loadShipments();
    };

    useEffect(() => {
        loadShipments();
        loadMedications();
    }, []);

    const statusColor = (s: string) =>
        s === "pending"
            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
            : s === "in_transit"
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-green-100 text-green-700 border-green-300";

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-10">

            {/* HEADER */}
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-xl text-white">
                    <Truck className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Sevkiyat Yönetimi</h1>
            </div>

            {/* FORM */}
            <form
                onSubmit={createShipment}
                className="bg-white p-8 rounded-2xl shadow-lg border space-y-6"
            >
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                    <Package className="w-5 h-5 text-blue-600" /> Yeni Sevkiyat Oluştur
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-1">
                        <label className="font-semibold text-gray-700">İlaç</label>
                        <select
                            className="border p-3 w-full rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.medicationId}
                            onChange={(e) => setForm({ ...form, medicationId: e.target.value })}
                        >
                            <option value="">İlaç Seç</option>
                            {medications.map((m: any) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold text-gray-700">Tedarikçi</label>
                        <input
                            type="text"
                            className="border p-3 w-full rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Tedarikçi"
                            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold text-gray-700">Çıkış Noktası</label>
                        <input
                            type="text"
                            className="border p-3 w-full rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Örn: Ankara Depo"
                            onChange={(e) => setForm({ ...form, origin: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold text-gray-700">Varış Noktası</label>
                        <input
                            type="text"
                            className="border p-3 w-full rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Örn: İstanbul Şube"
                            onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold text-gray-700">Tahmini Varış</label>
                        <input
                            type="date"
                            className="border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                            onChange={(e) => setForm({ ...form, estimatedArrival: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold text-gray-700">Miktar</label>
                        <input
                            type="number"
                            className="border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none w-full"
                            placeholder="Miktar"
                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        />
                    </div>

                </div>

                <button
                    className="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold w-full shadow hover:bg-green-700 transition"
                >
                    Sevkiyatı Kaydet
                </button>
            </form>

            {/* SHIPMENTS LIST */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Sevkiyatlar</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {shipments.map((s) => (
                        <div
                            key={s.id}
                            className="border rounded-xl p-6 shadow-sm bg-gray-50 hover:shadow-lg hover:-translate-y-1 transition relative"
                        >
                            {/* İlaç Bilgisi */}
                            <p className="font-bold text-xl text-gray-900 flex items-center gap-2">
                                <Boxes className="w-5 h-5 text-blue-600" />
                                {s.medication?.name}
                            </p>

                            <p className="text-sm text-gray-600 mt-1">Kod: {s.shipmentCode}</p>

                            <div className="mt-4 space-y-1 text-gray-700">
                                <p><b>Tedarikçi:</b> {s.supplier}</p>
                                <p><b>Miktar:</b> {s.quantity}</p>

                                <p className="flex items-center gap-1">
                                    <span className="font-bold">Durum:</span>
                                    <span className={`px-3 py-1 border rounded-lg text-sm capitalize ${statusColor(s.status)}`}>
                                        {s.status.replace("_", " ")}
                                    </span>
                                </p>

                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-600" /> Konum: {s.currentLocation}
                                </p>

                                <p className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-600" /> Varış: {s.estimatedArrival}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="mt-4 flex gap-2">
                                {s.status === "pending" && (
                                    <button
                                        onClick={() => updateStatus(s.id, "in_transit")}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Yola Çık
                                    </button>
                                )}

                                {s.status === "in_transit" && (
                                    <button
                                        onClick={() => updateStatus(s.id, "delivered")}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                    >
                                        Teslim Et
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
