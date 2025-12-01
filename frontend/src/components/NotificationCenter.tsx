import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<any[]>([]);

    const loadNotifications = async () => {
        const data = await apiClient(API_ENDPOINTS.NOTIFICATION_LIST);
        setNotifications(data);
    };

    const markRead = async (id: string) => {
        await apiClient(API_ENDPOINTS.NOTIFICATION_MARK_READ(id), {
            method: "PUT",
        });
        loadNotifications();
    };

    const generateStockWarnings = async () => {
        await apiClient(API_ENDPOINTS.NOTIFICATION_GENERATE_STOCK, {
            method: "POST",
        });
        alert("Stok bildirimleri oluşturuldu.");
        loadNotifications();
    };

    const generateShipmentWarnings = async () => {
        await apiClient(API_ENDPOINTS.NOTIFICATION_GENERATE_SHIPMENT, {
            method: "POST",
        });
        alert("Sevkiyat bildirimleri oluşturuldu.");
        loadNotifications();
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const typeColor = (type: string) =>
        type === "stock"
            ? "bg-red-100 text-red-700"
            : type === "shipment"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700";

    return (
        <div className="max-w-4xl space-y-6">
            <h1 className="text-2xl font-bold">Bildirim Merkezi</h1>

            {/* Bildirim oluşturma (test amaçlı) */}
            <div className="flex gap-4">
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={generateStockWarnings}
                >
                    Stok Bildirimleri Oluştur
                </button>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={generateShipmentWarnings}
                >
                    Sevkiyat Bildirimleri Oluştur
                </button>
            </div>

            {/* Bildirim listesi */}
            <div className="bg-white p-4 border rounded-xl space-y-4">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`p-4 border rounded-xl ${
                            n.isRead ? "opacity-50" : ""
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">{n.title}</h3>
                            <span
                                className={`px-2 py-1 rounded text-xs ${typeColor(n.type)}`}
                            >
                {n.type}
              </span>
                        </div>

                        <p className="text-gray-700">{n.message}</p>
                        <p className="text-xs text-gray-500">{n.createdAt}</p>

                        {!n.isRead && (
                            <button
                                className="mt-2 text-sm text-blue-600"
                                onClick={() => markRead(n.id)}
                            >
                                Okundu İşaretle
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
