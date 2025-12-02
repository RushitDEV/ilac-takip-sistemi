<?php

namespace App\Controller\Api;

use App\Repository\MedicationRepository;
use App\Repository\StockRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/dashboard')]
class DashboardController extends AbstractController
{
    public function __construct(
        private StockRepository      $stockRepo,
        private MedicationRepository $medicationRepo,
    ) {}

    // -------------------------------------------------
    //  DASHBOARD İSTATİSTİKLERİ
    //  Frontend: GET /api/dashboard/stats
    // -------------------------------------------------
    #[Route('/stats', name: 'app_api_dashboard_stats', methods: ['GET'])]
    public function stats(): JsonResponse
    {
        $em = $this->stockRepo->getEntityManager();

        // Toplam stok (kutu)
        $totalStock = (int)$this->stockRepo->createQueryBuilder('s')
            ->select('COALESCE(SUM(s.currentStock), 0)')
            ->getQuery()
            ->getSingleScalarResult();

        // Düşük / kritik stok sayısı
        $lowStockCount = (int)$this->stockRepo->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->where('s.currentStock <= s.minStock * 1.5')
            ->getQuery()
            ->getSingleScalarResult();

        // Toplam stok değeri (₺)
        $totalValue = (float)$em->createQuery(
            'SELECT COALESCE(SUM(s.currentStock * m.price), 0)
             FROM App\Entity\Stock s
             JOIN s.medication m'
        )->getSingleScalarResult();

        // İlaç çeşidi
        $medicationCount = $this->medicationRepo->count([]);

        return new JsonResponse([
            'totalStock'      => $totalStock,
            'lowStockCount'   => $lowStockCount,
            'totalValue'      => $totalValue,
            'medicationCount' => $medicationCount,
        ]);
    }
}
