<?php

namespace App\Controller\Api;

use App\Entity\DoseEvent;
use App\Entity\Prescription;
use App\Entity\Schedule;
use App\Entity\User; // User Entity'sini kullanıyoruz
use App\Repository\PrescriptionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
// KRİTİK DÜZELTME: Güvenlik servisi için doğru yol
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/prescription', name: 'api_prescription_')]
class PrescriptionController extends AbstractController
{
    private Security $security;
    private EntityManagerInterface $entityManager;

    // Bağımlılık Enjeksiyonu
    public function __construct(Security $security, EntityManagerInterface $entityManager)
    {
        $this->security = $security;
        $this->entityManager = $entityManager;
    }

    /**
     * Oturum açmış kullanıcının (Hasta) aktif reçetelerini listeler.
     */
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(PrescriptionRepository $prescriptionRepository): JsonResponse
    {
        // Mock User for testing purposes (Fetches 'hasta@ilac.com' user created in fixtures)
        $userPatient = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'hasta@ilac.com']);

        if (!$userPatient) {
            return $this->json(['message' => 'Test kullanıcısı bulunamadı.'], 404);
        }

        // Fetch prescriptions linked to this user
        $prescriptions = $prescriptionRepository->findBy(['patient' => $userPatient]);

        // Mock function to simulate doses taken today
        $getTakenToday = function (Prescription $prescription) {
            // In reality, check the DoseEvent table
            return $prescription->getId() == 1 ? 2 : 1; // Mock: Parol 2/3, Coraspin 1/1
        };

        // Mock function to simulate total doses required today
        $getTotalToday = function (Prescription $prescription) {
            return $prescription->getId() == 1 ? 3 : 1; // Mock: Parol 3, Coraspin 1
        };

        $data = array_map(function (Prescription $p) use ($getTakenToday, $getTotalToday) {

            // Get associated schedules
            $schedules = $this->entityManager->getRepository(Schedule::class)->findBy(['prescription' => $p]);

            $totalDoses = $getTotalToday($p);
            $takenDoses = $getTakenToday($p);
            $isCompleted = $takenDoses >= $totalDoses;

            $nextDoseTime = null;
            if (!$isCompleted && !empty($schedules)) {
                // Use the time of the first schedule as the next dose time
                $nextDoseTime = $schedules[0]->getTime()->format('H:i');
            }

            return [
                'id' => $p->getId(),
                'name' => $p->getMedication()?->getName() . ' ' . $p->getMedication()?->getStrength(),
                'activeIngredient' => $p->getMedication()?->getActiveIngredient(),
                'dosage' => $p->getDose(),
                'frequency' => $p->getFrequency(),
                'startDate' => $p->getStartDate()?->format('Y-m-d'),
                'endDate' => $p->getEndDate()?->format('Y-m-d'),
                'remainingDays' => $p->getEndDate() ? $p->getEndDate()->diff(new \DateTimeImmutable())->days : 999,
                'nextDose' => $nextDoseTime ?? 'Bugün tamamlandı',
                'takenToday' => $takenDoses,
                'totalToday' => $totalDoses,
                'doctor' => 'Dr. Zeynep Arslan', // Mock Data
                'instructions' => 'Tok karnına alınız', // Mock Data
                'barcode' => $p->getMedication()?->getBarcode(),
                'status' => $p->getEndDate() && $p->getEndDate() < new \DateTimeImmutable() ? 'completed' : 'active',
                // Schedule data required for MedicineCalendar.tsx
                'schedules' => array_map(fn(Schedule $s) => [
                    'time' => $s->getTime()->format('H:i'),
                    'taken' => rand(0, 1) === 1, // Mock
                ], $schedules)
            ];
        }, $prescriptions);

        // Return data in the format expected by MyMedicines.tsx and MedicineCalendar.tsx
        return $this->json([
            'medicines' => array_filter($data, fn($d) => $d['status'] === 'active'),
            'completed' => array_filter($data, fn($d) => $d['status'] === 'completed'),
        ]);
    }

    /**
     * Registers a dose taken by the user. (Mock implementation)
     */
    #[Route('/take', name: 'take_dose', methods: ['POST'])]
    public function takeDose(Request $request): JsonResponse
    {
        // In a real application, we would verify the user and create a DoseEvent entity here.

        $data = json_decode($request->getContent(), true);
        $prescriptionId = $data['prescriptionId'] ?? null;

        if (!$prescriptionId) {
            return $this->json(['message' => 'Missing prescription ID.'], 400);
        }

        return $this->json([
            'message' => 'Doz başarıyla kaydedildi.',
            'prescriptionId' => $prescriptionId,
            'takenAt' => (new \DateTimeImmutable())->format('H:i:s'),
        ], 200);
    }
}
