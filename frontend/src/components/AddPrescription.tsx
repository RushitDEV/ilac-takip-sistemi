import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";
import { useNavigate } from "react-router-dom";

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

    // -------------------------------------------------------
    //  HASTALAR & İLAÇLAR YÜKLENİYOR
    // -------------------------------------------------------
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

    // -------------------------------------------------------
    //  FORM SUBMIT – REÇETE OLUŞTUR
    // -------------------------------------------------------
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

    if (loading) return <p>Yükleniyor...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold">Reçete Oluştur</h2>

            {/* Hasta */}
            <div>
                <label>Hasta Seç</label>
                <select
                    className="w-full border p-2 rounded"
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
            <div>
                <label>İlaç Seç</label>
                <select
                    className="w-full border p-2 rounded"
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
            <input
                className="w-full border p-2 rounded"
                placeholder="Doktor Adı"
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
            />

            {/* Amaç */}
            <input
                className="w-full border p-2 rounded"
                placeholder="Reçete Amacı"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />

            {/* Doz */}
            <input
                className="w-full border p-2 rounded"
                placeholder="Doz (ör: 500mg)"
                value={form.dosage}
                onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            />

            {/* Frekans */}
            <input
                className="w-full border p-2 rounded"
                placeholder="Frekans (ör: Günde 2 kez)"
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            />

            {/* Toplam Doz */}
            <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Toplam Doz"
                value={form.totalDose}
                onChange={(e) => setForm({ ...form, totalDose: e.target.value })}
            />

            {/* Tarihler */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <label>Başlangıç</label>
                    <input
                        type="date"
                        className="w-full border p-2 rounded"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                </div>

                <div className="flex-1">
                    <label>Bitiş</label>
                    <input
                        type="date"
                        className="w-full border p-2 rounded"
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                </div>
            </div>

            {/* Buton */}
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
            >
                Kaydet
            </button>
        </div>
    );
}
