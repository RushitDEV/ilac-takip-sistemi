import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";
import { Pencil, Trash2, Eye, X } from "lucide-react";

export function PatientTracking() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Yeni hasta ekleme modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPatient, setNewPatient] = useState({
        name: "",
        surname: "",
        tc: "",
        gender: "Erkek",
        birthDate: "",
    });

    // Düzenleme modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editPatient, setEditPatient] = useState<any>(null);

    // Reçete modal
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [showPrescriptionsModal, setShowPrescriptionsModal] = useState(false);

    const loadPatients = async () => {
        try {
            const data = await apiClient(API_ENDPOINTS.PATIENTS);
            setPatients(data || []);
        } catch (err: any) {
            setError(err.message || "Hasta listesi alınamadı.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
    }, []);

    // Hasta ekle
    const handleAddPatient = async () => {
        try {
            await apiClient(API_ENDPOINTS.PATIENTS, {
                method: "POST",
                data: newPatient,
            });

            setShowAddModal(false);
            setNewPatient({
                name: "",
                surname: "",
                tc: "",
                gender: "Erkek",
                birthDate: "",
            });

            loadPatients();
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Hasta sil
    const handleDeletePatient = async (id: string) => {
        if (!confirm("Bu hastayı silmek istediğinize emin misiniz?")) return;

        try {
            await apiClient(API_ENDPOINTS.PATIENT_DETAIL(id), {
                method: "DELETE",
            });

            loadPatients();
        } catch (err: any) {
            alert("Hata: " + err.message);
        }
    };

    // Düzenleme modalını aç
    const openEditModal = (patient: any) => {
        setEditPatient(patient);
        setShowEditModal(true);
    };

    // Hasta güncelle
    const handleUpdatePatient = async () => {
        try {
            await apiClient(API_ENDPOINTS.PATIENT_DETAIL(editPatient.id), {
                method: "PUT",
                data: editPatient,
            });

            setShowEditModal(false);
            loadPatients();
        } catch (err: any) {
            alert("Hata: " + err.message);
        }
    };

    // Reçete yükle
    const loadPrescriptions = async (patient: any) => {
        setSelectedPatient(patient);

        try {
            const data = await apiClient(
                API_ENDPOINTS.PRESCRIPTION_LIST_BY_PATIENT(patient.id)
            );

            setPrescriptions(data || []);
            setShowPrescriptionsModal(true);
        } catch (err: any) {
            alert("Reçeteler alınamadı: " + err.message);
        }
    };

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Hasta Takibi</h2>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    + Yeni Hasta
                </button>
            </div>

            {loading && <p className="text-gray-600">Yükleniyor...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Tablo */}
            {patients.length === 0 && !loading ? (
                <p className="text-gray-500">Henüz hasta kaydı bulunamadı.</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow border">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm">
                            <th className="p-3 text-left">Ad</th>
                            <th className="p-3 text-left">Soyad</th>
                            <th className="p-3 text-left">TC</th>
                            <th className="p-3 text-left">Cinsiyet</th>
                            <th className="p-3 text-left">Doğum Tarihi</th>
                            <th className="p-3 text-center">İşlem</th>
                        </tr>
                        </thead>

                        <tbody className="text-sm">
                        {patients.map((p) => (
                            <tr
                                key={p.id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="p-3">{p.name}</td>
                                <td className="p-3">{p.surname}</td>
                                <td className="p-3">{p.tc}</td>
                                <td className="p-3">{p.gender}</td>
                                <td className="p-3">{p.birthDate}</td>

                                <td className="p-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => loadPrescriptions(p)}
                                        className="p-2 bg-green-100 hover:bg-green-200 rounded-lg"
                                    >
                                        <Eye className="w-4 h-4 text-green-700" />
                                    </button>

                                    <button
                                        onClick={() => openEditModal(p)}
                                        className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg"
                                    >
                                        <Pencil className="w-4 h-4 text-yellow-700" />
                                    </button>

                                    <button
                                        onClick={() => handleDeletePatient(p.id)}
                                        className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-700" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ----------------------------------------------------------------
                HASTA EKLEME MODAL
            ---------------------------------------------------------------- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 w-96 rounded-xl shadow-xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">Yeni Hasta Ekle</h3>
                            <X
                                className="w-6 h-6 cursor-pointer text-gray-600"
                                onClick={() => setShowAddModal(false)}
                            />
                        </div>

                        {["name", "surname", "tc"].map((field) => (
                            <input
                                key={field}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                placeholder={field.toUpperCase()}
                                value={(newPatient as any)[field]}
                                onChange={(e) =>
                                    setNewPatient({ ...newPatient, [field]: e.target.value })
                                }
                            />
                        ))}

                        <select
                            className="w-full border p-2 rounded"
                            value={newPatient.gender}
                            onChange={(e) =>
                                setNewPatient({ ...newPatient, gender: e.target.value })
                            }
                        >
                            <option value="Erkek">Erkek</option>
                            <option value="Kadın">Kadın</option>
                        </select>

                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            value={newPatient.birthDate}
                            onChange={(e) =>
                                setNewPatient({ ...newPatient, birthDate: e.target.value })
                            }
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAddPatient}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ----------------------------------------------------------------
                HASTA DÜZENLEME MODAL
            ---------------------------------------------------------------- */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 w-96 rounded-xl shadow-xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">Hasta Düzenle</h3>
                            <X
                                className="w-6 h-6 cursor-pointer text-gray-600"
                                onClick={() => setShowEditModal(false)}
                            />
                        </div>

                        {["name", "surname", "tc"].map((field) => (
                            <input
                                key={field}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                value={(editPatient as any)[field]}
                                onChange={(e) =>
                                    setEditPatient({
                                        ...editPatient,
                                        [field]: e.target.value,
                                    })
                                }
                            />
                        ))}

                        <select
                            className="w-full border p-2 rounded"
                            value={editPatient.gender}
                            onChange={(e) =>
                                setEditPatient({
                                    ...editPatient,
                                    gender: e.target.value,
                                })
                            }
                        >
                            <option value="Erkek">Erkek</option>
                            <option value="Kadın">Kadın</option>
                        </select>

                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            value={editPatient.birthDate}
                            onChange={(e) =>
                                setEditPatient({
                                    ...editPatient,
                                    birthDate: e.target.value,
                                })
                            }
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Kapat
                            </button>

                            <button
                                onClick={handleUpdatePatient}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ----------------------------------------------------------------
                REÇETE MODAL
            ---------------------------------------------------------------- */}
            {showPrescriptionsModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[500px] p-6 rounded-xl shadow-xl">
                        <h3 className="text-xl font-bold mb-3 flex justify-between items-center">
                            <span>
                                {selectedPatient?.name} {selectedPatient?.surname} – Reçeteler
                            </span>

                            <X
                                className="w-6 h-6 cursor-pointer text-gray-600"
                                onClick={() => setShowPrescriptionsModal(false)}
                            />
                        </h3>

                        {prescriptions.length === 0 ? (
                            <p className="text-gray-600">Bu hastada reçete bulunamadı.</p>
                        ) : (
                            <ul className="space-y-3">
                                {prescriptions.map((pr: any) => (
                                    <li
                                        key={pr.id}
                                        className="border p-4 rounded-lg shadow-sm bg-gray-50"
                                    >
                                        <p><b>İlaç:</b> {pr.medicationName}</p>
                                        <p><b>Toplam Doz:</b> {pr.totalDose}</p>
                                        <p><b>Kalan Doz:</b> {pr.remainingDose}</p>
                                        <p><b>Kullanılan Doz:</b> {pr.usedDose}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
