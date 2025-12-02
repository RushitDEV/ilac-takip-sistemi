import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

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

        if (!form.medicationId) {
            alert("İlaç seçmelisin!");
            return;
        }
        if (!form.quantity) {
            alert("Miktar boş olamaz!");
            return;
        }

        await apiClient(API_ENDPOINTS.SHIPMENT_CREATE, {
            method: "POST",
            data: {
                medicationId: form.medicationId, // eski
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
            ? "bg-yellow-100 text-yellow-700"
            : s === "in_transit"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700";

    return (
        <div className="max-w-7xl space-y-6">
            <h1 className="text-2xl font-bold">Sevkiyat Yönetimi</h1>

            {/* Yeni Sevkiyat Formu */}
            <form
                onSubmit={createShipment}
                className="bg-white p-4 border rounded-xl space-y-3"
            >
                <h2 className="font-bold">Yeni Sevkiyat Oluştur</h2>

                <select
                    className="border p-2 w-full"
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

                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Tedarikçi"
                    onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                />

                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Çıkış Noktası"
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                />

                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Varış Noktası"
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                />

                <input
                    type="date"
                    className="border p-2 w-full"
                    onChange={(e) =>
                        setForm({ ...form, estimatedArrival: e.target.value })
                    }
                />

                <input
                    type="number"
                    className="border p-2 w-full"
                    placeholder="Miktar"
                    onChange={(e) =>
                        setForm({ ...form, quantity: e.target.value })
                    }
                />

                <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                    Oluştur
                </button>
            </form>

            {/* Sevkiyat Listesi */}
            <div className="bg-white p-4 border rounded-xl">
                <h2 className="font-bold mb-4">Sevkiyatlar</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shipments.map((s) => (
                        <div key={s.id} className="border rounded-xl p-4">
                            <p className="font-bold text-lg">{s.medication.name}</p>
                            <p>Kod: {s.shipmentCode}</p>
                            <p>Tedarikçi: {s.supplier}</p>
                            <p>Miktar: {s.quantity}</p>

                            <p>
                                Durum:{" "}
                                <span className={`px-2 py-1 rounded ${statusColor(s.status)}`}>
                                    {s.status}
                                </span>
                            </p>

                            <p>Konum: {s.currentLocation}</p>
                            <p>Varış: {s.estimatedArrival}</p>

                            <div className="flex gap-2 mt-3">
                                {s.status === "pending" && (
                                    <button
                                        onClick={() => updateStatus(s.id, "in_transit")}
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Yola Çık
                                    </button>
                                )}

                                {s.status === "in_transit" && (
                                    <button
                                        onClick={() => updateStatus(s.id, "delivered")}
                                        className="bg-green-600 text-white px-3 py-1 rounded"
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
