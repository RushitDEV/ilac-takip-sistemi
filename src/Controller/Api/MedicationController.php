<?php

namespace App\Controller\Api;

use App\Entity\Medication;
use App\Repository\MedicationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/medication', name: 'api_medication_')]
class MedicationController extends AbstractController
{
    /**
     * Tüm ilaçları listeler (Eczacı Paneli Stok Yönetimi için).
     */
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(MedicationRepository $medicationRepository): JsonResponse
    {
        // Güvenlik: Sadece eczacılar (ROLE_ADMIN) bu listeye erişebilir.
        // Frontend'de bu rol ayrımı App.tsx'te yapıldığı için, şimdilik sadece API'yi oluşturuyoruz.
        // if (!$this->isGranted('ROLE_ADMIN')) {
        //     return $this->json(['message' => 'Erişim engellendi.'], 403);
        // }

        $medications = $medicationRepository->findAll();

        $data = array_map(function (Medication $med) {
            // Medication Entity'mizin tüm alanlarını React'in beklediği JSON formatına çeviriyoruz.
            return [
                'id' => $med->getId(),
                'name' => $med->getName(),
                'barcode' => $med->getBarcode(),
                'activeIngredient' => $med->getActiveIngredient(),
                'form' => $med->getForm(),
                'strength' => $med->getStrength(),
                'manufacturer' => 'Mock Manufacturer', // Mock veri olarak eklendi
                'stock' => rand(5, 500), // Mock veri
                'minStock' => 50, // Mock veri
                'maxStock' => 500, // Mock veri
                'expiryDate' => (new \DateTimeImmutable())->modify('+' . rand(3, 30) . ' months')->format('Y-m-d'), // Mock
                'price' => round(rand(10, 150) + rand(0, 99) / 100, 2), // Mock
                'status' => (rand(0, 100) < 10) ? 'critical' : ((rand(0, 100) < 30) ? 'low' : 'good'), // Mock
            ];
        }, $medications);

        return $this->json($data);
    }

    /**
     * Yeni bir ilacı kaydeder (Eczacı Paneli İlaç Kaydı için).
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        // Güvenlik: Sadece eczacılar (ROLE_ADMIN) ilaç kaydedebilir.
        // if (!$this->isGranted('ROLE_ADMIN')) {
        //     return $this->json(['message' => 'Erişim engellendi.'], 403);
        // }

        // JSON verisini al
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['message' => 'Geçersiz JSON verisi.'], 400);
        }

        // İlaç zaten var mı kontrol et (Barkod benzersiz olmalı)
        if (isset($data['barcode'])) {
            $existingMedication = $entityManager->getRepository(Medication::class)->findOneBy(['barcode' => $data['barcode']]);
            if ($existingMedication) {
                // Eğer ilaç zaten varsa, sadece stok bilgilerini güncelle (şimdilik sadece geri bildirim verelim)
                return $this->json([
                    'message' => 'İlaç zaten kayıtlı.',
                    'id' => $existingMedication->getId(),
                ], 200);
            }
        }

        // Yeni Entity oluştur
        $medication = new Medication();
        $medication->setName($data['name'] ?? 'Bilinmeyen İlaç');
        $medication->setBarcode($data['barcode'] ?? null);
        $medication->setActiveIngredient($data['activeIngredient'] ?? null);
        $medication->setForm($data['form'] ?? null);
        $medication->setStrength($data['strength'] ?? null);

        // Doğrulama (validation)
        $errors = $validator->validate($medication);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getPropertyPath() . ': ' . $error->getMessage();
            }
            return $this->json(['message' => 'Doğrulama hatası', 'errors' => $errorMessages], 400);
        }

        // Veritabanına kaydet
        $entityManager->persist($medication);
        $entityManager->flush();

        return $this->json([
            'message' => 'İlaç başarıyla kaydedildi.',
            'id' => $medication->getId(),
        ], 201); // 201 Created
    }
}
