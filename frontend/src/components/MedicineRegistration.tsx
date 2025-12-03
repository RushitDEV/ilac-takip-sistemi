import { useState, useEffect } from "react";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../api";
import { Pencil, Trash2, X } from "lucide-react";

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

    const [medications, setMedications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // ✨ EDIT STATE
    const [editModal, setEditModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);

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

    // ✨ İLAÇ DÜZENLEME MODALINI AÇ
    const openEditModal = (item: any) => {
        setEditItem(item);
        setEditModal(true);
    };

    // ✨ İLAÇ GÜNCELLE
    const handleUpdate = async () => {
        if (!editItem) return;

        try {
            await apiClient(API_ENDPOINTS.MEDICATION_UPDATE(editItem.id), {
                method: "PUT",
                data: editItem
            });

            setEditModal(false);
            loadMedications();
            alert("İlaç güncellendi!");
        } catch (err: any) {
            alert("Güncelleme hatası: " + err.message);
        }
    };

    // ✨ İLAÇ SİL
    const handleDelete = async (id: number) => {
        if (!confirm("Bu ilacı silmek istediğine emin misin?")) return;

        try {
            await apiClient(API_ENDPOINTS.MEDICATION_DELETE(id), {
                method: "DELETE"
            });

            loadMedications();
            alert("İlaç silindi.");
        } catch (err: any) {
            alert("Silme hatası: " + err.message);
        }
    };

    return (
        <div className="p-4 space-y-10">

            <h2 className="text-3xl font-bold text-gray-900">İlaç Kayıt</h2>

            {/* ----------- FORM ----------- */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border shadow-lg"
            >
                {[
                    { name: "name", placeholder: "İlaç Adı" },
                    { name: "barcode", placeholder: "Barkod" },
                    { name: "type", placeholder: "Tipi" },
                    { name: "manufacturer", placeholder: "Üretici" },
                    { name: "activeIngredient", placeholder: "Etken Madde" },
                    { name: "price", placeholder: "Fiyat" },
                ].map((input) => (
                    <input
                        key={input.name}
                        name={input.name}
                        value={(form as any)[input.name]}
                        onChange={handleChange}
                        placeholder={input.placeholder}
                        className="
                            border p-3 rounded-lg transition
                            focus:ring-2 focus:ring-blue-500
                            focus:border-blue-500 outline-none
                        "
                    />
                ))}

                <input
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="Resim URL"
                    className="
                        border p-3 rounded-lg col-span-1 md:col-span-2
                        focus:ring-2 focus:ring-blue-500
                    "
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Açıklama"
                    className="
                        border p-3 rounded-lg col-span-1 md:col-span-2
                        focus:ring-2 focus:ring-blue-500
                    "
                    rows={3}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        bg-blue-600 text-white py-3 rounded-lg col-span-1 md:col-span-2
                        hover:bg-blue-700 transition text-lg font-semibold
                        shadow-md hover:shadow-lg
                    "
                >
                    {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
            </form>

            {/* ----------- LİSTE ----------- */}
            <div className="bg-white p-8 rounded-2xl border shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Kayıtlı İlaçlar</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medications.map((m: any) => (
                        <div
                            key={m.id}
                            className="
                                border p-5 rounded-xl bg-gray-50 shadow-sm
                                hover:shadow-lg transition hover:-translate-y-1
                                relative
                            "
                        >
                            {/* Edit & Delete Buttons */}
                            <div className="absolute top-3 right-3 flex gap-2">
                                <button
                                    onClick={() => openEditModal(m)}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg"
                                >
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                    onClick={() => handleDelete(m.id)}
                                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>

                            <h4 className="font-bold text-lg text-gray-900">{m.name}</h4>
                            <p className="text-sm text-gray-600">Barkod: {m.barcode}</p>
                            <p className="text-sm text-gray-600">Üretici: {m.manufacturer}</p>
                            <p className="text-sm text-gray-600">
                                Etken Madde: {m.activeIngredient}
                            </p>

                            {m.imageUrl && (
                                <img
                                    src={m.imageUrl}
                                    className="
                                        mt-3 w-full h-40 object-cover rounded-lg
                                        transition-transform duration-300 hover:scale-105 shadow
                                    "
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ----------- EDIT MODAL ----------- */}
            {editModal && editItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">İlacı Düzenle</h3>
                            <button onClick={() => setEditModal(false)}>
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                "name",
                                "barcode",
                                "manufacturer",
                                "activeIngredient",
                                "price",
                                "imageUrl"
                            ].map((field) => (
                                <input
                                    key={field}
                                    name={field}
                                    value={editItem[field] ?? ""}
                                    onChange={(e) =>
                                        setEditItem({ ...editItem, [field]: e.target.value })
                                    }
                                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder={field}
                                />
                            ))}

                            <textarea
                                name="description"
                                value={editItem.description ?? ""}
                                onChange={(e) =>
                                    setEditItem({ ...editItem, description: e.target.value })
                                }
                                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Açıklama"
                            />
                        </div>

                        <button
                            onClick={handleUpdate}
                            className="bg-blue-600 text-white py-3 rounded-lg w-full hover:bg-blue-700"
                        >
                            Güncelle
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
