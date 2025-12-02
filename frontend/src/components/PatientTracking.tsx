import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

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

    // ------------------------------------------------------------
    //  TÜM HASTALARI GETİR
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    //  HASTA EKLE
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    //  HASTAYI SİL
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    //  HASTAYI DÜZENLE
    // ------------------------------------------------------------
    const openEditModal = (patient: any) => {
        setEditPatient(patient);
        setShowEditModal(true);
    };

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

    // ------------------------------------------------------------
    //  HASTANIN REÇETELERİNİ YÜKLE
    // ------------------------------------------------------------
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
        <div className="space-y-6">

            {/* Üst Başlık */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Hasta Takibi</h2>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    + Yeni Hasta
                </button>
            </div>

            {loading && <p>Yükleniyor...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Hasta Listesi */}
            {patients.length === 0 && !loading ? (
                <p>Henüz hasta kaydı bulunamadı.</p>
            ) : (
                <table className="w-full border rounded-lg">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3">Ad</th>
                        <th className="p-3">Soyad</th>
                        <th className="p-3">TC</th>
                        <th className="p-3">Cinsiyet</th>
                        <th className="p-3">Doğum Tarihi</th>
                        <th className="p-3">İşlem</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map((p) => (
                        <tr key={p.id} className="border-t">
                            <td className="p-3">{p.name}</td>
                            <td className="p-3">{p.surname}</td>
                            <td className="p-3">{p.tc}</td>
                            <td className="p-3">{p.gender}</td>
                            <td className="p-3">{p.birthDate}</td>

                            <td className="p-3 flex gap-2">

                                <button
                                    onClick={() => loadPrescriptions(p)}
                                    className="px-3 py-1 bg-green-600 text-white rounded-md"
                                >
                                    Reçeteleri Gör
                                </button>

                                <button
                                    onClick={() => openEditModal(p)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md"
                                >
                                    Düzenle
                                </button>

                                <button
                                    onClick={() => handleDeletePatient(p.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md"
                                >
                                    Sil
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* ----------------------------------------------------
                HASTA EKLEME MODALI
            ---------------------------------------------------- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-96 space-y-4">
                        <h3 className="text-xl font-bold">Yeni Hasta Ekle</h3>

                        <input
                            className="w-full border p-2 rounded"
                            placeholder="Ad"
                            value={newPatient.name}
                            onChange={(e) =>
                                setNewPatient({ ...newPatient, name: e.target.value })
                            }
                        />
                        <input
                            className="w-full border p-2 rounded"
                            placeholder="Soyad"
                            value={newPatient.surname}
                            onChange={(e) =>
                                setNewPatient({
                                    ...newPatient,
                                    surname: e.target.value,
                                })
                            }
                        />
                        <input
                            className="w-full border p-2 rounded"
                            placeholder="TC"
                            value={newPatient.tc}
                            onChange={(e) =>
                                setNewPatient({ ...newPatient, tc: e.target.value })
                            }
                        />

                        <select
                            className="w-full border p-2 rounded"
                            value={newPatient.gender}
                            onChange={(e) =>
                                setNewPatient({
                                    ...newPatient,
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
                            value={newPatient.birthDate}
                            onChange={(e) =>
                                setNewPatient({
                                    ...newPatient,
                                    birthDate: e.target.value,
                                })
                            }
                        />

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
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

            {/* ----------------------------------------------------
                HASTA DÜZENLEME MODALI
            ---------------------------------------------------- */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-96 space-y-4">
                        <h3 className="text-xl font-bold">Hasta Düzenle</h3>

                        <input
                            className="w-full border p-2 rounded"
                            value={editPatient.name}
                            onChange={(e) =>
                                setEditPatient({ ...editPatient, name: e.target.value })
                            }
                        />
                        <input
                            className="w-full border p-2 rounded"
                            value={editPatient.surname}
                            onChange={(e) =>
                                setEditPatient({
                                    ...editPatient,
                                    surname: e.target.value,
                                })
                            }
                        />
                        <input
                            className="w-full border p-2 rounded"
                            value={editPatient.tc}
                            onChange={(e) =>
                                setEditPatient({ ...editPatient, tc: e.target.value })
                            }
                        />

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

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
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

            {/* ----------------------------------------------------
                REÇETE MODALI
            ---------------------------------------------------- */}
            {showPrescriptionsModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white w-[500px] p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-3">
                            {selectedPatient?.name} {selectedPatient?.surname} – Reçeteler
                        </h3>

                        {prescriptions.length === 0 ? (
                            <p>Bu hastada reçete bulunamadı.</p>
                        ) : (
                            <ul className="space-y-3">
                                {prescriptions.map((pr: any) => (
                                    <li key={pr.id} className="border p-3 rounded">
                                        <p><b>İlaç:</b> {pr.medicationName}</p>
                                        <p><b>Toplam Doz:</b> {pr.totalDose}</p>
                                        <p><b>Kalan Doz:</b> {pr.remainingDose}</p>
                                        <p><b>Kullanılan Doz:</b> {pr.usedDose}</p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="text-right mt-4">
                            <button
                                onClick={() => setShowPrescriptionsModal(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
