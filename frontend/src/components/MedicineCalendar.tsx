import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface MedicineCalendarProps {
    user: any;
}

export function MedicineCalendar({ user }: MedicineCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

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
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    // Mock data for medicine schedule
    const getMedicineStatus = (day: number) => {
        const today = new Date().getDate();
        const currentMonth = new Date().getMonth();
        const selectedMonth = currentDate.getMonth();

        if (selectedMonth !== currentMonth) {
            return null;
        }

        if (day > today) {
            return null;
        }

        if (day === today) {
            return 'partial'; // 2/3 completed
        }

        // Random completion for past days
        const random = Math.random();
        if (random > 0.8) return 'missed';
        if (random > 0.1) return 'completed';
        return 'partial';
    };

    const todaySchedule = [
        {
            time: '08:00',
            medicine: 'Coraspin 100mg',
            taken: true,
        },
        {
            time: '12:00',
            medicine: 'Parol 500mg',
            taken: true,
        },
        {
            time: '14:00',
            medicine: 'Parol 500mg',
            taken: false,
        },
        {
            time: '20:00',
            medicine: 'Lipitor 20mg',
            taken: false,
        },
        {
            time: '22:00',
            medicine: 'Parol 500mg',
            taken: false,
        },
    ];

    return (
        <div className="max-w-7xl space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-gray-900">
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
                            <div key={day} className="text-center py-2 text-sm text-gray-600">
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
                            const status = getMedicineStatus(day);
                            const isToday = day === new Date().getDate() &&
                                currentDate.getMonth() === new Date().getMonth() &&
                                currentDate.getFullYear() === new Date().getFullYear();

                            return (
                                <div
                                    key={day}
                                    className={`aspect-square p-2 border rounded-lg flex flex-col items-center justify-center ${
                                        isToday ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                    }`}
                                >
                  <span className={`text-sm mb-1 ${isToday ? 'text-green-700' : 'text-gray-900'}`}>
                    {day}
                  </span>
                                    {status === 'completed' && (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    )}
                                    {status === 'partial' && (
                                        <Circle className="w-4 h-4 text-orange-600 fill-orange-200" />
                                    )}
                                    {status === 'missed' && (
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">Tamamlandı</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Circle className="w-4 h-4 text-orange-600 fill-orange-200" />
                            <span className="text-sm text-gray-700">Kısmi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-gray-700">Atlandı</span>
                        </div>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-gray-900 mb-4">Bugünkü Program</h2>
                    <div className="space-y-3">
                        {todaySchedule.map((item, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${
                                    item.taken
                                        ? 'border-green-200 bg-green-50'
                                        : 'border-gray-200 bg-white'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 mb-1">{item.time}</p>
                                        <p className="text-xs text-gray-600">{item.medicine}</p>
                                    </div>
                                    {item.taken ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Tamamlanan</span>
                            <span className="text-gray-900">
                {todaySchedule.filter((s) => s.taken).length}/{todaySchedule.length}
              </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                    width: `${
                                        (todaySchedule.filter((s) => s.taken).length / todaySchedule.length) * 100
                                    }%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Bu Ay Tamamlanan</p>
                    <p className="text-gray-900">89%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Atlanan Dozlar</p>
                    <p className="text-gray-900">4</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">En Düzenli Kullanılan</p>
                    <p className="text-gray-900">Coraspin</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Günlük Ortalama</p>
                    <p className="text-gray-900">4.2 doz</p>
                </div>
            </div>
        </div>
    );
}
