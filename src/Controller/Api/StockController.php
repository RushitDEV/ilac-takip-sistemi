<?php

namespace App\Controller\Api;

use App\Entity\Stock;
use App\Repository\StockRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/stock')]
class StockController extends AbstractController
{
    // -------------------------------------------------------
    //  STOK LİSTELEME  (GET /api/stock)
    // -------------------------------------------------------
    #[Route('', methods: ['GET'])]
    public function list(StockRepository $repo): JsonResponse
    {
        $stocks = $repo->findAll();
        $result = [];

        foreach ($stocks as $s) {
            $med = $s->getMedication();

            $result[] = [
                'id' => $s->getId(),
                'currentStock' => $s->getCurrentStock(),
                'minStock' => $s->getMinStock(),
                'maxStock' => $s->getMaxStock(),
                'lastRestock' => $s->getLastRestock()?->format('Y-m-d'),

                // FRONTEND'İN BEKLEDİĞİ MEDICATION ALANI
                'medication' => [
                    'id' => $med->getId(),
                    'name' => $med->getName(),
                    'barcode' => $med->getBarcode(),
                    'manufacturer' => $med->getManufacturer(),
                    'activeIngredient' => $med->getActiveIngredient(),
                    'price' => $med->getPrice(), // Toplam değer hesabı için
                ],
            ];
        }

        return new JsonResponse($result);
    }

    // -------------------------------------------------------
    //  STOK ARTTIRMA  (POST /api/stock/add)
    //  FRONTEND: STOCK_ADD → { stockId, amount, note }
    // -------------------------------------------------------
    #[Route('/add', methods: ['POST'])]
    public function add(Request $req, EntityManagerInterface $em, StockRepository $repo): JsonResponse
    {
        $data = json_decode($req->getContent(), true);

        // stockId kontrolü
        if (empty($data['stockId'])) {
            return new JsonResponse(['error' => 'stockId gerekli'], 400);
        }

        $stock = $repo->find($data['stockId']);
        if (!$stock) {
            return new JsonResponse(['error' => 'Stok bulunamadı'], 404);
        }

        $amount = (int)($data['amount'] ?? 0);
        if ($amount <= 0) {
            return new JsonResponse(['error' => 'Geçersiz miktar'], 400);
        }

        // Not alanını şimdilik loglamıyoruz, istersen ileride StockMovement tablosuna ekleriz
        // $note = $data['note'] ?? null;

        $stock->setCurrentStock($stock->getCurrentStock() + $amount);
        $stock->setLastRestock(new \DateTime());

        $em->flush();

        return new JsonResponse(['message' => 'Stok artırıldı']);
    }

    // -------------------------------------------------------
    //  STOK AZALTMA  (POST /api/stock/remove)
    //  FRONTEND: STOCK_REMOVE → { stockId, amount, note }
    // -------------------------------------------------------
    #[Route('/remove', methods: ['POST'])]
    public function remove(Request $req, EntityManagerInterface $em, StockRepository $repo): JsonResponse
    {
        $data = json_decode($req->getContent(), true);

        if (empty($data['stockId'])) {
            return new JsonResponse(['error' => 'stockId gerekli'], 400);
        }

        $stock = $repo->find($data['stockId']);
        if (!$stock) {
            return new JsonResponse(['error' => 'Stok bulunamadı'], 404);
        }

        $amount = (int)($data['amount'] ?? 0);
        if ($amount <= 0) {
            return new JsonResponse(['error' => 'Geçersiz miktar'], 400);
        }

        if ($stock->getCurrentStock() < $amount) {
            return new JsonResponse(['error' => 'Yetersiz stok'], 400);
        }

        $stock->setCurrentStock($stock->getCurrentStock() - $amount);
        $em->flush();

        return new JsonResponse(['message' => 'Stok azaltıldı']);
    }
}
