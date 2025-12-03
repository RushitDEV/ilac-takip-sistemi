import { useEffect, useState } from "react";
import { Pill, Activity, AlertTriangle } from "lucide-react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

interface MyMedicinesProps {
    user: any;
}

interface Prescription {
    id: number;
    medicationName: string;
    totalDose: number;
    remainingDose: number;
    usedDose: number;
    frequency?: string;    // ör: "Günde 2 kez"
    dosage?: string;       // ör: "500mg"
    doctor?: string;
    purpose?: string;
    startDate?: string;
    endDate?: string;
}

export function MyMedicines({ user }: MyMedicinesProps) {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            const data = await apiClient(
                API_ENDPOINTS.PRESCRIPTION_LIST_BY_PATIENT(user.id)
            );
            setPrescriptions(data || []);
        } catch (err: any) {
            setError(err.message || "Reçeteler yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrescriptions();
    }, []);

    if (loading) {
        return <p className="text-gray-600">İlaçlarınız yükleniyor...</p>;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
            </div>
        );
    }

    if (prescriptions.length === 0) {
        return (
            <div className="bg-white rounded-2xl border shadow p-8 text-center">
                <p className="text-gray-700 font-medium">
                    Henüz tanımlı bir reçeteniz bulunmuyor.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Doktorunuz reçete eklediğinde burada göreceksiniz.
                </p>
            </div>
        );
    }

    const totalActive = prescriptions.length;
    const totalRemaining = prescriptions.reduce(
        (sum, p) => sum + (p.remainingDose ?? 0),
        0
    );
    const nearFinish = prescriptions.filter(
        (p) => p.remainingDose !== null && p.remainingDose <= 3
    );

    return (
        <div className="max-w-7xl space-y-8">
            {/* Özet Kartlar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border shadow p-6 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                        <Pill className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Aktif Reçete</p>
                        <p className="text-2xl font-bold text-gray-900">{totalActive}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border shadow p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Toplam Kalan Doz</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {totalRemaining ?? 0}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border shadow p-6 flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Bitişe Yakın İlaç</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {nearFinish.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reçete Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prescriptions.map((p) => {
                    const progress =
                        p.totalDose && p.totalDose > 0
                            ? Math.round(((p.usedDose ?? 0) / p.totalDose) * 100)
                            : 0;

                    const isAlmostDone = (p.remainingDose ?? 0) <= 3;

                    return (
                        <div
                            key={p.id}
                            className="bg-white rounded-2xl border shadow hover:shadow-lg hover:-translate-y-1 transition p-6 flex flex-col gap-3"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-gray-900 font-semibold">
                                        {p.medicationName}
                                    </p>
                                    {p.dosage && (
                                        <p className="text-sm text-gray-500">{p.dosage}</p>
                                    )}
                                </div>
                                {isAlmostDone && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    Bitmek Üzere
                  </span>
                                )}
                            </div>

                            {p.frequency && (
                                <p className="text-sm text-gray-600">
                                    Kullanım: <span className="font-medium">{p.frequency}</span>
                                </p>
                            )}

                            <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                    Toplam doz:{" "}
                                    <span className="font-medium">{p.totalDose ?? "-"}</span>
                                </p>
                                <p>
                                    Kullanılan doz:{" "}
                                    <span className="font-medium">{p.usedDose ?? 0}</span>
                                </p>
                                <p>
                                    Kalan doz:{" "}
                                    <span className="font-medium">{p.remainingDose ?? 0}</span>
                                </p>
                            </div>

                            {(p.startDate || p.endDate) && (
                                <p className="text-xs text-gray-500">
                                    {p.startDate && <>Başlangıç: {p.startDate}</>}
                                    {p.startDate && p.endDate && " • "}
                                    {p.endDate && <>Bitiş: {p.endDate}</>}
                                </p>
                            )}

                            {/* Progress bar */}
                            <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>İlerleme</span>
                                    <span>%{isNaN(progress) ? 0 : progress}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-green-600"
                                        style={{ width: `${isNaN(progress) ? 0 : progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
