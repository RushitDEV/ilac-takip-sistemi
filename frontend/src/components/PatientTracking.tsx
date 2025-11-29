import { useState } from 'react';
import { Search, User, Calendar, Pill, FileText } from 'lucide-react';

export function PatientTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const patients = [
    {
      id: 1,
      name: 'Mehmet Kaya',
      tcNo: '12345678901',
      phone: '0555 123 4567',
      age: 45,
      lastVisit: '2024-11-25',
      activePrescriptions: 3,
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      tcNo: '12345678902',
      phone: '0555 234 5678',
      age: 38,
      lastVisit: '2024-11-24',
      activePrescriptions: 2,
    },
    {
      id: 3,
      name: 'Ali Yılmaz',
      tcNo: '12345678903',
      phone: '0555 345 6789',
      age: 52,
      lastVisit: '2024-11-23',
      activePrescriptions: 4,
    },
  ];

  const patientMedicines = [
    {
      id: 1,
      name: 'Parol 500mg',
      barcode: '8691234567890',
      dosage: '3x1',
      startDate: '2024-11-20',
      endDate: '2024-11-27',
      doctor: 'Dr. Zeynep Arslan',
      status: 'active',
      dispensedDate: '2024-11-20',
      remainingDays: 2,
    },
    {
      id: 2,
      name: 'Coraspin 100mg',
      barcode: '8691234567891',
      dosage: '1x1',
      startDate: '2024-11-15',
      endDate: '2024-12-15',
      doctor: 'Dr. Ahmet Öz',
      status: 'active',
      dispensedDate: '2024-11-15',
      remainingDays: 18,
    },
    {
      id: 3,
      name: 'Majezik 275mg',
      barcode: '8691234567892',
      dosage: '2x1',
      startDate: '2024-11-10',
      endDate: '2024-11-20',
      doctor: 'Dr. Zeynep Arslan',
      status: 'completed',
      dispensedDate: '2024-11-10',
      remainingDays: 0,
    },
  ];

  return (
    <div className="max-w-7xl space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-gray-900 mb-4">Hasta Arama</h2>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hasta adı, TC No veya telefon ile ara..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Ara
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Hastalar</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedPatient?.id === patient.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate">{patient.name}</p>
                    <p className="text-xs text-gray-600">TC: {patient.tcNo}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                        <Pill className="w-3 h-3" />
                        {patient.activePrescriptions} reçete
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatient ? (
            <>
              {/* Patient Info */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-gray-900 mb-4">Hasta Bilgileri</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ad Soyad</p>
                    <p className="text-gray-900">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">TC Kimlik No</p>
                    <p className="text-gray-900">{selectedPatient.tcNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Telefon</p>
                    <p className="text-gray-900">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Yaş</p>
                    <p className="text-gray-900">{selectedPatient.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Son Ziyaret</p>
                    <p className="text-gray-900">{selectedPatient.lastVisit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Aktif Reçete</p>
                    <p className="text-gray-900">{selectedPatient.activePrescriptions}</p>
                  </div>
                </div>
              </div>

              {/* Medicine History */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-gray-900 mb-4">İlaç Geçmişi</h2>
                <div className="space-y-4">
                  {patientMedicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-gray-900">{medicine.name}</p>
                          <p className="text-sm text-gray-600">
                            Barkod: {medicine.barcode}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            medicine.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {medicine.status === 'active' ? 'Aktif' : 'Tamamlandı'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Dozaj</p>
                          <p className="text-gray-900">{medicine.dosage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Reçete Eden Doktor</p>
                          <p className="text-gray-900">{medicine.doctor}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Başlangıç - Bitiş</p>
                          <p className="text-gray-900">
                            {medicine.startDate} / {medicine.endDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Veriliş Tarihi</p>
                          <p className="text-gray-900">{medicine.dispensedDate}</p>
                        </div>
                      </div>
                      {medicine.status === 'active' && (
                        <div className="mt-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <p className="text-sm text-blue-600">
                            Kalan Süre: {medicine.remainingDays} gün
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                Detayları görüntülemek için bir hasta seçin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
