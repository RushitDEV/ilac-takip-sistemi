<?php

namespace App\Controller\Api;

use App\Entity\Medication;
use App\Entity\Patient;
use App\Entity\Stock;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/dashboard')]
class DashboardController extends AbstractController
{
    #[Route('/stats', methods: ['GET'])]
    public function stats(EntityManagerInterface $em): JsonResponse
    {
        // Optimizasyon: Native SQL kullanarak tek bir sorguda tüm sayımları yapıyoruz.
        // Bu yöntem, her bir count için ayrı ayrı DB bağlantısı kurma maliyetini ortadan kaldırır.
        $connection = $em->getConnection();

        $sql = "
            SELECT
                (SELECT COUNT(id) FROM medication) as total_medicines,
                (SELECT COUNT(id) FROM patient) as total_patients,
                (SELECT COUNT(id) FROM stock WHERE current_stock <= min_stock) as low_stock_count,
                (SELECT COUNT(id) FROM medication WHERE expiry_date >= :start AND expiry_date <= :end) as today_added
        ";

        $today = new \DateTime();
        $params = [
            'start' => $today->format('Y-m-d 00:00:00'),
            'end'   => $today->format('Y-m-d 23:59:59')
        ];

        // Sorguyu çalıştır ve sonucu ilişkisel dizi olarak al
        $stats = $connection->executeQuery($sql, $params)->fetchAssociative();

        return new JsonResponse([
            'totalMedicines'   => (int)($stats['total_medicines'] ?? 0),
            'totalPatients'    => (int)($stats['total_patients'] ?? 0),
            'lowStock'         => (int)($stats['low_stock_count'] ?? 0),
            'todayAdded'       => (int)($stats['today_added'] ?? 0),
            'pendingShipments' => 0,
            'notifications'    => 0
        ]);
    }
}
