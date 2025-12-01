<?php

namespace App\Controller\Api;

use App\Repository\MedicationRepository;
use App\Repository\PatientRepository;
use App\Repository\ShipmentRepository;
use App\Repository\NotificationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/dashboard')]
class DashboardController extends AbstractController
{
    #[Route('/stats', methods: ['GET'])]
    public function stats(
        MedicationRepository $medRepo,
        PatientRepository $patientRepo,
        ShipmentRepository $shipmentRepo,
        NotificationRepository $notificationRepo,
        EntityManagerInterface $em
    ): JsonResponse {

        // Toplam ilaç sayısı
        $totalMedicines = $medRepo->count([]);

        // Toplam mevcut stok miktarı
        $totalStock = $em->getConnection()->fetchOne("
            SELECT SUM(current_stock) FROM stock
        ");

        // Düşük stok (min_stock üst sınır)
        $lowStock = $em->getConnection()->fetchOne("
            SELECT COUNT(*) FROM stock
            WHERE current_stock < min_stock
        ");

        // Bugün eklenen ilaçlar
        $todayAdded = $em->getConnection()->fetchOne("
            SELECT COUNT(*) FROM medication
            WHERE DATE(created_at) = CURRENT_DATE
        ");

        // Hasta sayısı
        $totalPatients = $patientRepo->count([]);

        // Bekleyen sevkiyat
        $pendingShipments = $shipmentRepo->count(['status' => 'pending']);

        // Bildirim sayısı
        $notificationCount = $notificationRepo->count([]);

        return new JsonResponse([
            'totalMedicines' => (int)$totalMedicines,
            'totalStock' => (int)$totalStock,
            'lowStock' => (int)$lowStock,
            'todayAdded' => (int)$todayAdded,
            'totalPatients' => (int)$totalPatients,
            'pendingShipments' => (int)$pendingShipments,
            'notifications' => (int)$notificationCount
        ]);
    }
}
