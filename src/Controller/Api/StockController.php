<?php

namespace App\Controller\Api;

use App\Entity\Stock;
use App\Entity\Medication;
use App\Repository\StockRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/stock')]
class StockController extends AbstractController
{
    // ------------------------------------------------------
    //  STOK LİSTELEME (GET /api/stock)
    // ------------------------------------------------------
    #[Route('', methods: ['GET'])]
    public function list(StockRepository $repo): JsonResponse
    {
        $stocks = $repo->findAll();
        $result = [];

        foreach ($stocks as $s) {
            $m = $s->getMedication();

            $result[] = [
                'id' => $s->getId(),
                'currentStock' => $s->getCurrentStock(),
                'minStock' => $s->getMinStock(),
                'maxStock' => $s->getMaxStock(),
                'lastRestock' => $s->getLastRestock()?->format('Y-m-d'),
                'expiryDate' => $s->getExpiryDate()?->format('Y-m-d'),
                'note' => $s->getNote(),

                // 💥 Frontend’in beklediği ilaç bilgileri
                'medication' => [
                    'id' => $m->getId(),
                    'name' => $m->getName(),
                    'barcode' => $m->getBarcode(),
                    'manufacturer' => $m->getManufacturer(),
                    'activeIngredient' => $m->getActiveIngredient(),
                    'price' => $m->getPrice(),

                    // 💥 Eksikti: Frontend expiryDate istiyordu
                    'expiryDate' => $m->getExpiryDate()?->format('Y-m-d'),
                ],
            ];
        }

        return new JsonResponse($result);
    }

    // ------------------------------------------------------
    //  STOK EKLEME (POST /api/stock/add)
    // ------------------------------------------------------
    #[Route('/add', methods: ['POST'])]
    public function add(Request $req, EntityManagerInterface $em, StockRepository $repo): JsonResponse
    {
        $data = json_decode($req->getContent(), true);

        if (!isset($data['medicationId'], $data['amount'])) {
            return new JsonResponse(['error' => 'Eksik veri. (medicationId, amount)'], 400);
        }

        $med = $em->getRepository(Medication::class)->find($data['medicationId']);
        if (!$med) {
            return new JsonResponse(['error' => 'İlaç bulunamadı'], 404);
        }

        $stock = $repo->findOneBy(['medication' => $med]);

        if (!$stock) {
            $stock = new Stock();
            $stock->setMedication($med);
            $stock->setCurrentStock(0);
            $stock->setMinStock($data['minStock'] ?? 5);
            $stock->setMaxStock($data['maxStock'] ?? 500);

            $em->persist($stock);
        }

        $amount = (int)$data['amount'];
        $stock->setCurrentStock($stock->getCurrentStock() + $amount);
        $stock->setLastRestock(new \DateTime());

        if (!empty($data['note'])) {
            $stock->setNote($data['note']);
        }

        $em->flush();

        return new JsonResponse(['message' => 'Stok başarıyla artırıldı']);
    }

    // ------------------------------------------------------
    //  STOK AZALTMA (POST /api/stock/remove)
    // ------------------------------------------------------
    #[Route('/remove', methods: ['POST'])]
    public function remove(Request $req, EntityManagerInterface $em, StockRepository $repo): JsonResponse
    {
        $data = json_decode($req->getContent(), true);

        if (!isset($data['stockId'], $data['amount'])) {
            return new JsonResponse(['error' => 'Eksik veri. (stockId, amount)'], 400);
        }

        $stock = $repo->find($data['stockId']);
        if (!$stock) {
            return new JsonResponse(['error' => 'Stok bulunamadı'], 404);
        }

        $amount = (int)$data['amount'];
        if ($amount <= 0) {
            return new JsonResponse(['error' => 'Miktar 0dan büyük olmalı'], 400);
        }

        if ($stock->getCurrentStock() < $amount) {
            return new JsonResponse(['error' => 'Yetersiz stok'], 400);
        }

        $stock->setCurrentStock($stock->getCurrentStock() - $amount);

        if (!empty($data['note'])) {
            $stock->setNote($data['note']);
        }

        $em->flush();

        return new JsonResponse(['message' => 'Stok başarıyla azaltıldı']);
    }
}
