import { useEffect, useState } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

export function Lifecycle() {
    const [items, setItems] = useState<any[]>([]);

    const loadLifecycle = async () => {
        const data = await apiClient(API_ENDPOINTS.LIFECYCLE_ALL);
        setItems(data);
    };

    useEffect(() => {
        loadLifecycle();
    }, []);

    const badgeColor = (status: string) => {
        switch (status) {
            case "good":
                return "bg-green-100 text-green-700";
            case "low":
                return "bg-yellow-100 text-yellow-700";
            case "critical":
                return "bg-red-100 text-red-700";
            case "in_transit":
                return "bg-blue-100 text-blue-700";
            case "delivered":
                return "bg-purple-100 text-purple-700";
            case "pending":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="max-w-7xl space-y-6">
            <h1 className="text-2xl font-bold">İlaç Yaşam Döngüsü</h1>

            <div className="bg-white p-6 rounded-xl border">
                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4">İlaç</th>
                        <th className="text-left py-3 px-4">Üretici</th>
                        <th className="text-left py-3 px-4">Sevkiyat</th>
                        <th className="text-left py-3 px-4">Stok</th>
                        <th className="text-left py-3 px-4">Reçete</th>
                        <th className="text-left py-3 px-4">Doz Durumu</th>
                    </tr>
                    </thead>

                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{item.name}</td>

                            <td className="py-3 px-4">{item.manufacturer}</td>

                            <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${badgeColor(item.shipmentStatus)}`}>
                    {item.shipmentStatus}
                  </span>
                            </td>

                            <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${badgeColor(item.stockStatus)}`}>
                    {item.stock} adet
                  </span>
                            </td>

                            <td className="py-3 px-4">{item.prescriptionCount} reçete</td>

                            <td className="py-3 px-4">
                                {item.doseTaken}/{item.doseTotal} doz
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
