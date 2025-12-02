import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

export function PatientTracking() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPatients = async () => {
        try {
            const data = await apiClient(API_ENDPOINTS.PATIENTS);
            setPatients(data || []);
        } catch (err: any) {
            console.error("Patient API Error:", err);
            setError(err.message || "Hasta listesi alınamadı.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Hasta Takibi</h2>

            {loading && <p>Yükleniyor...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && patients.length === 0 && (
                <p>Henüz hasta kaydı bulunamadı.</p>
            )}

            {patients.length > 0 && (
                <table className="w-full border rounded-lg">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3">Ad</th>
                        <th className="p-3">Soyad</th>
                        <th className="p-3">TC</th>
                        <th className="p-3">Cinsiyet</th>
                        <th className="p-3">Doğum Tarihi</th>
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
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
