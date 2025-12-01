import { useState, useEffect } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";

export function MedicineRegistration() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        barcode: "",
        type: "",
        manufacturer: "",
        activeIngredient: "",
        imageUrl: "",
        price: ""
    });

    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const loadMedications = async () => {
        try {
            const list = await apiClient(API_ENDPOINTS.MEDICATION_LIST);
            setMedications(list);
        } catch (err: any) {
            alert("İlaç listesi yüklenemedi: " + err.message);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiClient(API_ENDPOINTS.MEDICATION_CREATE, {
                method: "POST",
                data: form
            });

            alert("İlaç başarıyla eklendi!");
            setForm({
                name: "",
                description: "",
                barcode: "",
                type: "",
                manufacturer: "",
                activeIngredient: "",
                imageUrl: "",
                price: ""
            });

            loadMedications();
        } catch (err: any) {
            alert("Hata: " + err.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadMedications();
    }, []);

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-2xl font-bold">İlaç Kayıt</h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl border"
            >
                <input name="name" value={form.name} onChange={handleChange} placeholder="İlaç Adı" className="border p-2" />
                <input name="barcode" value={form.barcode} onChange={handleChange} placeholder="Barkod" className="border p-2" />
                <input name="type" value={form.type} onChange={handleChange} placeholder="Tipi" className="border p-2" />
                <input name="manufacturer" value={form.manufacturer} onChange={handleChange} placeholder="Üretici" className="border p-2" />
                <input name="activeIngredient" value={form.activeIngredient} onChange={handleChange} placeholder="Etken Madde" className="border p-2" />
                <input name="price" value={form.price} onChange={handleChange} placeholder="Fiyat" className="border p-2" />
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Resim URL" className="border p-2 col-span-2" />

                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Açıklama" className="border p-2 col-span-2" />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 rounded-lg col-span-2"
                >
                    {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
            </form>

            <div className="bg-white p-6 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Kayıtlı İlaçlar</h3>

                <div className="grid grid-cols-3 gap-4">
                    {medications.map((m: any) => (
                        <div key={m.id} className="border p-4 rounded-lg">
                            <h4 className="font-bold">{m.name}</h4>
                            <p>Barkod: {m.barcode}</p>
                            <p>Üretici: {m.manufacturer}</p>
                            <p>Etken Madde: {m.activeIngredient}</p>

                            {m.imageUrl && (
                                <img
                                    src={m.imageUrl}
                                    className="mt-2 w-full h-32 object-cover rounded-lg"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
