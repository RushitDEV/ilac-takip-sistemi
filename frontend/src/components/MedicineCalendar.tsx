import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pill } from "lucide-react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

interface MedicineCalendarProps {
    user: any;
}

interface Prescription {
    id: number;
    medicationName: string;
    totalDose: number;
    remainingDose: number;
    usedDose: number;
    frequency?: string;
    dosage?: string;
    startDate?: string; // "YYYY-MM-DD"
    endDate?: string;   // "YYYY-MM-DD"
}

export function MedicineCalendar({ user }: MedicineCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            const data = await apiClient(
                API_ENDPOINTS.PRESCRIPTION_LIST_BY_PATIENT(user.id)
            );
            setPrescriptions(data || []);
        } catch (err: any) {
            setError(err.message || "Reçete verileri alınamadı");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    const monthNames = [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık",
    ];

    const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

    // Belirli bir tarihte aktif reçete var mı?
    const hasMedicineOnDate = (date: Date) => {
        return prescriptions.some((p) => {
            if (!p.startDate) return false;

            const start = new Date(p.startDate);
            const end = p.endDate ? new Date(p.endDate) : null;

            // Sadece tarih kıyasla
            const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const e =
                end && new Date(end.getFullYear(), end.getMonth(), end.getDate());

            if (e) {
                return d >= s && d <= e;
            }
            return d >= s;
        });
    };

    const today = new Date();
    const isSameDay = (d1: Date, d2: Date) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    // Bugün aktif olan reçeteler
    const todayPrescriptions = prescriptions.filter((p) => {
        if (!p.startDate) return false;
        const start = new Date(p.startDate);
        const end = p.endDate ? new Date(p.endDate) : null;
        return hasMedicineOnDate(today) && (() => {
            const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const e =
                end && new Date(end.getFullYear(), end.getMonth(), end.getDate());
            if (e) return d >= s && d <= e;
            return d >= s;
        })();
    });

    if (loading) {
        return <p className="text-gray-600">İlaç takviminiz yükleniyor...</p>;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Takvim */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-gray-900 font-semibold">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={previousMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Day Names */}
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="text-center py-2 text-sm text-gray-600 font-medium"
                            >
                                {day}
                            </div>
                        ))}

                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                            <div key={`empty-${index}`} className="aspect-square" />
                        ))}

                        {/* Calendar Days */}
                        {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const dateObj = new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                day
                            );
                            const isToday = isSameDay(dateObj, today);
                            const hasMedicine = hasMedicineOnDate(dateObj);

                            return (
                                <div
                                    key={day}
                                    className={`aspect-square p-2 border rounded-lg flex flex-col items-center justify-center ${
                                        isToday
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-200"
                                    }`}
                                >
                  <span
                      className={`text-sm mb-1 ${
                          isToday ? "text-green-700 font-semibold" : "text-gray-900"
                      }`}
                  >
                    {day}
                  </span>
                                    {hasMedicine && (
                                        <Pill className="w-4 h-4 text-blue-600" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">
                O gün ilaç kullanım planı var
              </span>
                        </div>
                    </div>
                </div>

                {/* Bugünkü Program */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-gray-900 mb-4 font-semibold">Bugünkü Planlanan İlaçlar</h2>

                    {todayPrescriptions.length === 0 ? (
                        <p className="text-sm text-gray-600">
                            Bugün için planlanmış ilaç kaydı bulunmuyor.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {todayPrescriptions.map((p) => (
                                <div
                                    key={p.id}
                                    className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                                >
                                    <p className="text-sm text-gray-900 font-medium">
                                        {p.medicationName}
                                    </p>
                                    {p.dosage && (
                                        <p className="text-xs text-gray-600">{p.dosage}</p>
                                    )}
                                    {p.frequency && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            Kullanım sıklığı:{" "}
                                            <span className="font-medium">{p.frequency}</span>
                                        </p>
                                    )}
                                    <div className="mt-2 text-xs text-gray-500">
                                        Toplam doz: {p.totalDose ?? "-"} • Kalan doz:{" "}
                                        {p.remainingDose ?? 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
