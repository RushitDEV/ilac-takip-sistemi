import { Activity, Droplet, Heart, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HealthDataProps {
  user: any;
}

export function HealthData({ user }: HealthDataProps) {
  const bloodTests = [
    {
      id: 1,
      name: 'Hemoglobin (HGB)',
      value: 14.2,
      unit: 'g/dL',
      normalRange: '13.5-17.5',
      status: 'normal',
      date: '2024-11-20',
      trend: 'up',
    },
    {
      id: 2,
      name: 'Beyaz Küre (WBC)',
      value: 7.8,
      unit: '10³/µL',
      normalRange: '4.0-11.0',
      status: 'normal',
      date: '2024-11-20',
      trend: 'stable',
    },
    {
      id: 3,
      name: 'Glukoz (Açlık)',
      value: 118,
      unit: 'mg/dL',
      normalRange: '70-100',
      status: 'high',
      date: '2024-11-20',
      trend: 'up',
    },
    {
      id: 4,
      name: 'Kolesterol (Total)',
      value: 215,
      unit: 'mg/dL',
      normalRange: '<200',
      status: 'high',
      date: '2024-11-20',
      trend: 'down',
    },
    {
      id: 5,
      name: 'Trigliserit',
      value: 165,
      unit: 'mg/dL',
      normalRange: '<150',
      status: 'high',
      date: '2024-11-20',
      trend: 'up',
    },
    {
      id: 6,
      name: 'HDL Kolesterol',
      value: 48,
      unit: 'mg/dL',
      normalRange: '>40',
      status: 'normal',
      date: '2024-11-20',
      trend: 'stable',
    },
    {
      id: 7,
      name: 'LDL Kolesterol',
      value: 134,
      unit: 'mg/dL',
      normalRange: '<100',
      status: 'high',
      date: '2024-11-20',
      trend: 'down',
    },
    {
      id: 8,
      name: 'Kreatinin',
      value: 0.9,
      unit: 'mg/dL',
      normalRange: '0.7-1.3',
      status: 'normal',
      date: '2024-11-20',
      trend: 'stable',
    },
  ];

  const vitalSigns = [
    {
      name: 'Tansiyon',
      value: '130/85',
      unit: 'mmHg',
      icon: Heart,
      status: 'high',
      lastChecked: '2 saat önce',
    },
    {
      name: 'Nabız',
      value: '78',
      unit: 'bpm',
      icon: Activity,
      status: 'normal',
      lastChecked: '2 saat önce',
    },
    {
      name: 'Oksijen',
      value: '98',
      unit: '%',
      icon: Droplet,
      status: 'normal',
      lastChecked: '2 saat önce',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'low':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'high':
        return 'Yüksek';
      case 'low':
        return 'Düşük';
      default:
        return 'Bilinmiyor';
    }
  };

  const abnormalCount = bloodTests.filter((test) => test.status !== 'normal').length;

  // Historical data for charts
  const glucoseHistory = [
    { date: 'Eyl', value: 105 },
    { date: 'Eki', value: 112 },
    { date: 'Kas', value: 118 },
  ];

  const cholesterolHistory = [
    { date: 'Ağu', total: 225, ldl: 145, hdl: 45 },
    { date: 'Eyl', total: 220, ldl: 140, hdl: 46 },
    { date: 'Eki', total: 218, ldl: 138, hdl: 47 },
    { date: 'Kas', total: 215, ldl: 134, hdl: 48 },
  ];

  const pressureHistory = [
    { date: '20 Kas', systolic: 135, diastolic: 88 },
    { date: '21 Kas', systolic: 132, diastolic: 86 },
    { date: '22 Kas', systolic: 128, diastolic: 84 },
    { date: '23 Kas', systolic: 130, diastolic: 85 },
    { date: '24 Kas', systolic: 133, diastolic: 87 },
    { date: '25 Kas', systolic: 131, diastolic: 86 },
    { date: '26 Kas', systolic: 129, diastolic: 84 },
    { date: '27 Kas', systolic: 130, diastolic: 85 },
  ];

  return (
    <div className="max-w-7xl space-y-6">
      {/* Vital Signs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vitalSigns.map((vital) => {
          const Icon = vital.icon;
          return (
            <div key={vital.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${vital.status === 'normal' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Icon className={`w-6 h-6 ${vital.status === 'normal' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{vital.name}</p>
                    <p className="text-xs text-gray-500">{vital.lastChecked}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(vital.status)}`}>
                  {getStatusText(vital.status)}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-gray-900">{vital.value}</p>
                <p className="text-sm text-gray-600">{vital.unit}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Blood Test Results */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">Kan Değerleri</h2>
              <p className="text-sm text-gray-600 mt-1">Son test: 20 Kasım 2024</p>
            </div>
            {abnormalCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-700">
                  {abnormalCount} anormal değer
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bloodTests.map((test) => (
              <div
                key={test.id}
                className={`p-4 border rounded-lg ${
                  test.status !== 'normal' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-gray-900">{test.name}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Normal aralık: {test.normalRange} {test.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-600" />}
                    {test.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-600" />}
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(test.status)}`}>
                      {getStatusText(test.status)}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <p className={`text-2xl ${test.status !== 'normal' ? 'text-red-700' : 'text-gray-900'}`}>
                    {test.value}
                  </p>
                  <p className="text-sm text-gray-600">{test.unit}</p>
                </div>

                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute h-full ${
                      test.status === 'normal' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    style={{ width: '60%', left: '20%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Activity className="w-6 h-6 text-blue-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-blue-900 mb-2">Sağlık Özeti</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Kan şekeriniz normal aralığın üzerinde, diyetinize dikkat edin</li>
              <li>• Kolesterol değerleriniz yüksek, Lipitor ilacınızı düzenli kullanın</li>
              <li>• Tansiyonunuz hafif yüksek, tuz tüketiminizi azaltın</li>
              <li>• Düzenli egzersiz yapmanız önerilir</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Glucose Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-gray-900 mb-4">Kan Şekeri Trendi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={glucoseHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[70, 130]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} name="Glukoz (mg/dL)" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Kan şekeriniz son 3 ayda artış gösteriyor. Diyetinize dikkat edin.
            </p>
          </div>
        </div>

        {/* Blood Pressure Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-gray-900 mb-4">Tansiyon Takibi (Son 7 Gün)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={pressureHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[70, 150]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} name="Sistolik" />
              <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} name="Diastolik" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Tansiyonunuz hafif yüksek seyrediyor. Tuz t��ketiminizi azaltın.
            </p>
          </div>
        </div>

        {/* Cholesterol Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <h3 className="text-gray-900 mb-4">Kolesterol Değerleri Trendi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cholesterolHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 250]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} name="Total Kolesterol" />
              <Line type="monotone" dataKey="ldl" stroke="#ef4444" strokeWidth={2} name="LDL (Kötü)" />
              <Line type="monotone" dataKey="hdl" stroke="#10b981" strokeWidth={2} name="HDL (İyi)" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Kolesterol değerleriniz düşüş trendinde! Lipitor ilacınızı kullanmaya devam edin.
            </p>
          </div>
        </div>
      </div>

      {/* Download Report */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 mb-1">Test Raporları</h3>
            <p className="text-sm text-gray-600">
              Kan tahlili ve diğer test sonuçlarınızı indirin
            </p>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Raporu İndir (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
