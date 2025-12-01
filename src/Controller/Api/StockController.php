<?php

namespace App\Controller\Api;

use App\Entity\Medication;
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
    #[Route('', methods: ['GET'])]
    public function list(StockRepository $repo): JsonResponse
    {
        $stocks = $repo->findAll();
        $result = [];

        foreach ($stocks as $s) {
            $result[] = [
                'id' => $s->getId(),
                'currentStock' => $s->getCurrentStock(),
                'minStock' => $s->getMinStock(),
                'maxStock' => $s->getMaxStock(),
                'lastRestock' => $s->getLastRestock()?->format('Y-m-d'),
                'medication' => [
                    'id' => $s->getMedication()->getId(),
                    'name' => $s->getMedication()->getName(),
                    'barcode' => $s->getMedication()->getBarcode(),
                    'manufacturer' => $s->getMedication()->getManufacturer(),
                    'activeIngredient' => $s->getMedication()->getActiveIngredient(),
                ]
            ];
        }

        return new JsonResponse($result);
    }

    #[Route('/add', methods: ['POST'])]
    public function add(Request $req, EntityManagerInterface $em, StockRepository $repo): JsonResponse
    {
        $data = json_decode($req->getContent(), true);

        $med = $em->getRepository(Medication::class)->find($data['medicationId']);
        if (!$med) return new JsonResponse(['error' => 'İlaç bulunamadı'], 404);

        $stock = $repo->findOneBy(['medication' => $med]);

        if (!$stock) {
            $stock = new Stock();
            $stock->setMedication($med);
            $stock->setCurrentStock(0);
            $stock->setMinStock($data['minStock'] ?? 10);
            $stock->setMaxStock($data['maxStock'] ?? 100);
            $em->persist($stock);
        }

        $amount = (int)$data['amount'];
        $stock->setCurrentStock($stock->getCurrentStock() + $amount);
        $stock->setLastRestock(new \DateTime());

        $em->flush();

        return new JsonResponse(['message' => 'Stok artırıldı']);
    }

    #[Route('/remove', methods: ['POST'])]
    public function remove(Request $req, EntityManagerInterface $em, StockRepository $repo): JsonResponse
    {
        $data = json_decode($req->getContent(), true);

        $stock = $repo->find($data['stockId']);
        if (!$stock) return new JsonResponse(['error' => 'Stok bulunamadı'], 404);

        $amount = (int)$data['amount'];

        if ($stock->getCurrentStock() < $amount) {
            return new JsonResponse(['error' => 'Yetersiz stok'], 400);
        }

        $stock->setCurrentStock($stock->getCurrentStock() - $amount);
        $em->flush();

        return new JsonResponse(['message' => 'Stok azaltıldı']);
    }
}
