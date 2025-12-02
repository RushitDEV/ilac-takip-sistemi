import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

export function PrescriptionCreate() {
    const [patients, setPatients] = useState([]);
    const [medications, setMedications] = useState([]);

    const [form, setForm] = useState({
        patientId: "",
        medicationId: "",
        doctor: "",
        dosage: "",
        purpose: "",
        startDate: "",
        endDate: "",
        instructions: "",
        sideEffects: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // -----------------------------
    // VERİLERİ YÜKLE
    // -----------------------------
    useEffect(() => {
        loadPatients();
        loadMedications();
    }, []);

    const loadPatients = async () => {
        try {
            const data = await apiClient(API_ENDPOINTS.PATIENTS);
            setPatients(data);
        } catch {
            setError("Hastalar yüklenemedi.");
        }
    };

    const loadMedications = async () => {
        try {
            const data = await apiClient(API_ENDPOINTS.MEDICATION_LIST);
            setMedications(data);
        } catch {
            setError("İlaç listesi yüklenemedi.");
        }
    };

    // -----------------------------
    // FORM GÜNCELLEME
    // -----------------------------
    const updateField = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    // -----------------------------
    // KAYDET
    // -----------------------------
    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!form.patientId || !form.medicationId) {
            setError("Lütfen hasta ve ilaç seçiniz.");
            return;
        }

        setLoading(true);
        try {
            await apiClient(API_ENDPOINTS.PRESCRIPTIONS, {
                method: "POST",
                data: form,
            });

            setSuccess("Reçete başarıyla eklendi!");
            setForm({
                patientId: "",
                medicationId: "",
                doctor: "",
                dosage: "",
                purpose: "",
                startDate: "",
                endDate: "",
                instructions: "",
                sideEffects: "",
            });
        } catch (err: any) {
            setError(err.message || "Kayıt sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold">Yeni Reçete Oluştur</h2>

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Hasta Seçimi */}
                <div>
                    <label className="block font-medium">Hasta</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={form.patientId}
                        onChange={(e) => updateField("patientId", e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        {patients.map((p: any) => (
                            <option key={p.id} value={p.id}>
                                {p.name} {p.surname} (TC: {p.tc})
                            </option>
                        ))}
                    </select>
                </div>

                {/* İlaç Seçimi */}
                <div>
                    <label className="block font-medium">İlaç</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={form.medicationId}
                        onChange={(e) => updateField("medicationId", e.target.value)}
                    >
                        <option value="">Seçiniz</option>
                        {medications.map((m: any) => (
                            <option key={m.id} value={m.id}>
                                {m.name} ({m.activeIngredient})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Doktor */}
                <div>
                    <label className="block font-medium">Doktor</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.doctor}
                        onChange={(e) => updateField("doctor", e.target.value)}
                        placeholder="Dr. Mehmet Yılmaz"
                    />
                </div>

                {/* Dozaj */}
                <div>
                    <label className="block font-medium">Dozaj</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.dosage}
                        onChange={(e) => updateField("dosage", e.target.value)}
                        placeholder="Günde 1 kez"
                    />
                </div>

                {/* Başlangıç Tarihi */}
                <div>
                    <label className="block font-medium">Başlangıç Tarihi</label>
                    <input
                        type="date"
                        className="w-full border p-2 rounded"
                        value={form.startDate}
                        onChange={(e) => updateField("startDate", e.target.value)}
                    />
                </div>

                {/* Bitiş Tarihi */}
                <div>
                    <label className="block font-medium">Bitiş Tarihi</label>
                    <input
                        type="date"
                        className="w-full border p-2 rounded"
                        value={form.endDate}
                        onChange={(e) => updateField("endDate", e.target.value)}
                    />
                </div>
            </div>

            {/* Amaç */}
            <div>
                <label className="block font-medium">Kullanım Amacı</label>
                <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={form.purpose}
                    onChange={(e) => updateField("purpose", e.target.value)}
                    placeholder="Baş ağrısı tedavisi"
                />
            </div>

            {/* Talimatlar */}
            <div>
                <label className="block font-medium">Talimatlar</label>
                <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    value={form.instructions}
                    onChange={(e) => updateField("instructions", e.target.value)}
                />
            </div>

            {/* Yan Etkiler */}
            <div>
                <label className="block font-medium">Yan Etkiler</label>
                <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    value={form.sideEffects}
                    onChange={(e) => updateField("sideEffects", e.target.value)}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
                {loading ? "Kaydediliyor..." : "Reçeteyi Kaydet"}
            </button>
        </div>
    );
}
