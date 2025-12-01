import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

export function PatientTracking() {
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
    const [doses, setDoses] = useState<any[]>([]);

    // Hasta listesini yükle
    const loadPatients = async () => {
        const data = await apiClient(API_ENDPOINTS.PATIENT_LIST);
        setPatients(data);
    };

    // Seçilen hastanın reçetelerini çek
    const loadPrescriptions = async (patientId: string) => {
        const data = await apiClient(API_ENDPOINTS.PATIENT_PRESCRIPTIONS(patientId));
        setPrescriptions(data);
    };

    // Reçetedeki ilaç dozlarını getir
    const loadDoses = async (prescriptionId: string) => {
        const data = await apiClient(API_ENDPOINTS.PRESCRIPTION_DOSES(prescriptionId));
        setDoses(data);
    };

    useEffect(() => {
        loadPatients();
    }, []);

    return (
        <div className="max-w-7xl space-y-6">
            <h1 className="text-2xl font-bold">Hasta Takibi</h1>

            {/* Hasta Listesi */}
            <div className="bg-white p-4 border rounded-xl">
                <h2 className="font-semibold mb-3">Hastalar</h2>
                <ul className="space-y-2">
                    {patients.map((p) => (
                        <li
                            key={p.id}
                            className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                                setSelectedPatient(p);
                                loadPrescriptions(p.id);
                            }}
                        >
                            {p.name} {p.surname} - {p.tc}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Reçeteler */}
            {selectedPatient && (
                <div className="bg-white p-4 border rounded-xl">
                    <h2 className="font-semibold mb-3">
                        Reçeteler — {selectedPatient.name} {selectedPatient.surname}
                    </h2>
                    <ul className="space-y-2">
                        {prescriptions.map((pr) => (
                            <li
                                key={pr.id}
                                className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                                onClick={() => {
                                    setSelectedPrescription(pr);
                                    loadDoses(pr.id);
                                }}
                            >
                                Dr: {pr.doctor} — {pr.createdAt}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Doz Takibi */}
            {selectedPrescription && (
                <div className="bg-white p-4 border rounded-xl">
                    <h2 className="font-semibold mb-3">İlaç Dozları</h2>

                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="py-2">İlaç</th>
                            <th className="py-2">Etken Madde</th>
                            <th className="py-2">Saat</th>
                            <th className="py-2">Durum</th>
                        </tr>
                        </thead>

                        <tbody>
                        {doses.map((d) => (
                            <tr key={d.id} className="border-b">
                                <td className="py-2">{d.medication.name}</td>
                                <td className="py-2">{d.medication.activeIngredient}</td>
                                <td className="py-2">{d.time}</td>
                                <td className="py-2">
                                    {d.status === "taken" ? (
                                        <span className="text-green-600">Alındı</span>
                                    ) : (
                                        <span className="text-red-600">Bekliyor</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
