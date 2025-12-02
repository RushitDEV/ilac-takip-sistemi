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
        // Toplam ilaç sayısı
        $totalMedicines = $em->getRepository(Medication::class)->count([]);

        // Toplam hasta sayısı
        $totalPatients = $em->getRepository(Patient::class)->count([]);

        // Düşük stok sayısı (NULL güvenli)
        $lowStock = $em->getRepository(Stock::class)
            ->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.currentStock IS NOT NULL')
            ->andWhere('s.minStock IS NOT NULL')
            ->andWhere('s.currentStock <= s.minStock')
            ->getQuery()
            ->getSingleScalarResult();

        // Bugün eklenen ilaç — PostgreSQL uyumlu tarih karşılaştırması
        $today = new \DateTime();
        $todayAdded = $em->getRepository(Medication::class)
            ->createQueryBuilder('m')
            ->select('COUNT(m.id)')
            ->where('m.expiryDate >= :start')
            ->andWhere('m.expiryDate < :end')
            ->setParameter('start', $today->format('Y-m-d 00:00:00'))
            ->setParameter('end', $today->format('Y-m-d 23:59:59'))
            ->getQuery()
            ->getSingleScalarResult();

        return new JsonResponse([
            'totalMedicines' => (int)$totalMedicines,
            'totalPatients' => (int)$totalPatients,
            'lowStock' => (int)$lowStock,
            'todayAdded' => (int)$todayAdded,
            'pendingShipments' => 0,
            'notifications' => 0
        ]);
    }
}
