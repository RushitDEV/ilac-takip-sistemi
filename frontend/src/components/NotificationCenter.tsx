import { X, Bell, Pill, Activity, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'medicine',
      title: 'İlaç Zamanı',
      message: 'Parol 500mg almayı unutmayın',
      time: '14:00',
      isUnread: true,
      icon: Pill,
      color: 'blue',
    },
    {
      id: 2,
      type: 'warning',
      title: 'İlaç Etkileşimi',
      message: 'Coraspin ve Lipitor arasında orta seviye etkileşim',
      time: '2 saat önce',
      isUnread: true,
      icon: AlertTriangle,
      color: 'yellow',
    },
    {
      id: 3,
      type: 'success',
      title: 'İlaç Alındı',
      message: 'Coraspin 100mg başarıyla kaydedildi',
      time: '08:00',
      isUnread: false,
      icon: CheckCircle2,
      color: 'green',
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Reçete Yenileme',
      message: 'Parol stoğunuz 2 gün içinde bitecek',
      time: 'Dün',
      isUnread: true,
      icon: AlertTriangle,
      color: 'red',
    },
    {
      id: 5,
      type: 'health',
      title: 'Kan Tahlili Zamanı',
      message: 'Aylık kontrol kan tahlili için randevu alın',
      time: '3 gün önce',
      isUnread: false,
      icon: Activity,
      color: 'purple',
    },
    {
      id: 6,
      type: 'appointment',
      title: 'Doktor Randevusu',
      message: 'Dr. Ahmet Öz - Kardiyoloji kontrolü',
      time: '1 hafta sonra',
      isUnread: false,
      icon: Calendar,
      color: 'indigo',
    },
    {
      id: 7,
      type: 'medicine',
      title: 'Akşam İlaç Hatırlatıcısı',
      message: 'Lipitor 20mg - Akşam 20:00',
      time: 'Bugün',
      isUnread: false,
      icon: Pill,
      color: 'blue',
    },
  ];

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center sm:justify-end z-50">
      <div className="bg-white w-full sm:w-96 sm:h-[600px] h-[90vh] sm:rounded-xl rounded-t-xl flex flex-col sm:m-4 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-700" />
            <div>
              <h2 className="text-gray-900">Bildirimler</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-600">{unreadCount} okunmamış</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  notification.isUnread ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg bg-${notification.color}-50 flex-shrink-0 h-fit`}>
                    <Icon className={`w-5 h-5 text-${notification.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-sm ${notification.isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      {notification.isUnread && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Tümünü Okundu Olarak İşaretle
          </button>
        </div>
      </div>
    </div>
  );
}
