import { Zap, X } from 'lucide-react';

interface QuickDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickDemo({ isOpen, onClose }: QuickDemoProps) {
  if (!isOpen) return null;

  const features = [
    {
      category: 'Hasta Paneli Özellikleri',
      items: [
        '✅ İlaç Etkileşim Kontrolü - Kullanılan ilaçlar arası tehlikeli etkileşimleri tespit eder',
        '✅ Kan Değerleri Grafikleri - Glukoz, kolesterol, tansiyon trendlerini görselleştirir',
        '✅ Akıllı Bildirimler - İlaç saatleri, etkileşimler, reçete yenileme uyarıları',
        '✅ İlaç Takvimi - Aylık kullanım takibi ve günlük program',
        '✅ Sağlık Geçmişi - Tüm reçete, test ve tedavi kayıtları',
      ],
    },
    {
      category: 'Eczacı Paneli Özellikleri',
      items: [
        '✅ Barkod Sistemi - Hızlı ilaç kaydı ve takibi',
        '✅ Tedarik Zinciri - 5 aşamalı sevkiyat takibi (Üretim → Teslimat)',
        '✅ Stok Yönetimi - Kritik stok uyarıları ve otomatik sipariş',
        '✅ Yaşam Döngüsü - İlacın üretiminden imhasına kadar her aşama',
        '✅ Hasta Takibi - Hangi hastanın hangi ilacı kullandığı',
      ],
    },
    {
      category: 'Güvenlik ve Uyarılar',
      items: [
        '⚠️ İlaç-ilaç etkileşim kontrolü',
        '⚠️ Kritik stok seviyesi uyarıları',
        '⚠️ Son kullanma tarihi takibi',
        '⚠️ Anormal kan değeri bildirimleri',
        '⚠️ Dozaj aşımı kontrolleri',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Hızlı Demo Rehberi</h2>
              <p className="text-sm text-gray-600">Sistemin tüm özelliklerini keşfedin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Quick Access */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
            <h3 className="text-gray-900 mb-4">🎯 Hızlı Erişim</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-900 mb-2">👨‍⚕️ <strong>Hasta Olarak Giriş</strong></p>
                <p className="text-xs text-gray-600">
                  Ana sayfada "Hasta Paneli" seçin → İlaçlarım sayfasında etkileşim uyarısını görün → Sağlık Verileri'nde grafikleri inceleyin → Bildirim simgesine tıklayın
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-900 mb-2">💊 <strong>Eczacı Olarak Giriş</strong></p>
                <p className="text-xs text-gray-600">
                  Ana sayfada "Eczacı Paneli" seçin → İlaç Kaydı'nda barkod tarayın → Tedarik Zinciri'nde sevkiyat takibi → Stok Yönetimi'nde kritik stokları görün
                </p>
              </div>
            </div>
          </div>

          {/* Features List */}
          {features.map((section, index) => (
            <div key={index}>
              <h3 className="text-gray-900 mb-4">{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Demo Scenarios */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-yellow-900 mb-4">🎬 Sunumda Gösterebileceğiniz Senaryolar</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-900 mb-2">
                  <strong>Senaryo 1: İlaç Etkileşimi Tespiti</strong>
                </p>
                <p className="text-xs text-gray-600">
                  Hasta paneline girin → İlaçlarım sayfasında sarı uyarı kutusuna dikkat çekin → 
                  "Detayları görüntüle" butonuna tıklayın → İlaç etkileşimlerini açıklayın → 
                  Bu özelliğin hasta güvenliği için önemini vurgulayın
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-900 mb-2">
                  <strong>Senaryo 2: Sağlık Verileri Görselleştirme</strong>
                </p>
                <p className="text-xs text-gray-600">
                  Hasta paneline girin → Sağlık Verileri sayfasına gidin → 
                  Kan şekeri, tansiyon ve kolesterol grafiklerini gösterin → 
                  Trendlerin nasıl görselleştirildiğini açıklayın → 
                  Hastaların sağlık durumlarını kolayca takip edebildiğini gösterin
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-900 mb-2">
                  <strong>Senaryo 3: Tedarik Zinciri Takibi</strong>
                </p>
                <p className="text-xs text-gray-600">
                  Eczacı paneline girin → Tedarik Zinciri sayfasına gidin → 
                  5 aşamalı süreç çizelgesini gösterin → 
                  İlacın üretimden eczaneye nasıl geldiğini anlat → 
                  Gerçek zamanlı konum takibini vurgulayın
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-900 mb-2">
                  <strong>Senaryo 4: Akıllı Bildirimler</strong>
                </p>
                <p className="text-xs text-gray-600">
                  Herhangi bir panelde → Sağ üstteki bildirim simgesine (🔔) tıklayın → 
                  Farklı bildirim tiplerini gösterin → 
                  Sistematik hatırlatıcıların hasta uyumunu artırdığını açıklayın
                </p>
              </div>
            </div>
          </div>

          {/* Technical Highlights */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-blue-900 mb-4">💻 Teknik Özellikler (Sunumda Bahsedilebilir)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-sm text-blue-800">⚛️ React 18 + TypeScript</div>
              <div className="text-sm text-blue-800">🎨 Tailwind CSS 4.0</div>
              <div className="text-sm text-blue-800">📊 Recharts (Veri görselleştirme)</div>
              <div className="text-sm text-blue-800">🎯 Component-based mimari</div>
              <div className="text-sm text-blue-800">🔐 Rol tabanlı erişim</div>
              <div className="text-sm text-blue-800">📱 Responsive tasarım</div>
              <div className="text-sm text-blue-800">🔔 Real-time bildirimler</div>
              <div className="text-sm text-blue-800">📈 Trend analizi</div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-green-900 mb-3">💡 Sunum İpuçları</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>✓ Hasta güvenliği odaklı özellikleri vurgulayın (etkileşim kontrolü)</li>
              <li>✓ Görsel grafiklerle verilerin anlamlı hale geldiğini gösterin</li>
              <li>✓ İki farklı kullanıcı deneyimi (eczacı/hasta) sunduğunuzu belirtin</li>
              <li>✓ Gerçek dünya problemlerine çözüm sunduğunuzu açıklayın</li>
              <li>✓ Gelecek geliştirmeleri (mobil app, AI, blockchain) bahsedin</li>
              <li>✓ ITS (İlaç Takip Sistemi) uyumlu olduğunu söyleyin</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Hazırım, Başlayalım! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
