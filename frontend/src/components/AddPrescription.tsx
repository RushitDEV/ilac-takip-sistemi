import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";
import { useNavigate } from "react-router-dom";
import { Pill, User, ClipboardPlus } from "lucide-react";

export default function AddPrescription() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState<any[]>([]);
    const [medications, setMedications] = useState<any[]>([]);

    const [form, setForm] = useState({
        patientId: "",
        medicationId: "",
        doctor: "",
        purpose: "",
        dosage: "",
        frequency: "",
        totalDose: "",
        startDate: "",
        endDate: "",
    });

    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const pat = await apiClient(API_ENDPOINTS.PATIENTS);
            const meds = await apiClient(API_ENDPOINTS.MEDICATION_LIST);

            setPatients(pat || []);
            setMedications(meds || []);
        } catch (err) {
            alert("Veriler yüklenemedi!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async () => {
        try {
            await apiClient(API_ENDPOINTS.PRESCRIPTIONS, {
                method: "POST",
                data: form,
            });

            alert("Reçete başarıyla oluşturuldu!");
            navigate("/patient-tracking");

        } catch (err: any) {
            alert("Hata: " + err.message);
        }
    };

    if (loading) return <p className="text-gray-600 p-6">Yükleniyor...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 border space-y-8">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-3 rounded-xl text-white">
                        <ClipboardPlus className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Reçete Oluştur
                    </h2>
                </div>

                {/* Hasta */}
                <div className="space-y-1">
                    <label className="font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" /> Hasta Seç
                    </label>
                    <select
                        className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={form.patientId}
                        onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    >
                        <option value="">Seçiniz</option>
                        {patients.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} {p.surname}
                            </option>
                        ))}
                    </select>
                </div>

                {/* İlaç */}
                <div className="space-y-1">
                    <label className="font-semibold text-gray-700 flex items-center gap-2">
                        <Pill className="w-4 h-4" /> İlaç Seç
                    </label>
                    <select
                        className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={form.medicationId}
                        onChange={(e) => setForm({ ...form, medicationId: e.target.value })}
                    >
                        <option value="">Seçiniz</option>
                        {medications.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Doktor */}
                <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Doktor Adı</label>
                    <input
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                        placeholder="Örn: Dr. Ahmet Yılmaz"
                        value={form.doctor}
                        onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                    />
                </div>

                {/* Amaç */}
                <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Reçete Amacı</label>
                    <input
                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                        placeholder="Örn: Enfeksiyon tedavisi"
                        value={form.purpose}
                        onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                    />
                </div>

                {/* Doz - Frekans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold text-gray-700">Doz</label>
                        <input
                            className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Örn: 250mg"
                            value={form.dosage}
                            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-gray-700">Frekans</label>
                        <input
                            className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Örn: Günde 2 kez"
                            value={form.frequency}
                            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                        />
                    </div>
                </div>

                {/* Toplam Doz */}
                <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Toplam Doz</label>
                    <input
                        type="number"
                        className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Örn: 20"
                        value={form.totalDose}
                        onChange={(e) => setForm({ ...form, totalDose: e.target.value })}
                    />
                </div>

                {/* Tarihler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="font-semibold text-gray-700">Başlangıç Tarihi</label>
                        <input
                            type="date"
                            className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.startDate}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold text-gray-700">Bitiş Tarihi</label>
                        <input
                            type="date"
                            className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.endDate}
                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        />
                    </div>
                </div>

                {/* Buton */}
                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-lg font-semibold"
                >
                    Reçeteyi Kaydet
                </button>
            </div>
        </div>
    );
}
