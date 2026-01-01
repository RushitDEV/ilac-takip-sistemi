<?php

namespace App\Controller\Api;

use App\Entity\Medication;
use App\Repository\MedicationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/lifecycle')]
class LifecycleController extends AbstractController
{
    #[Route('/all', methods: ['GET'])]
    public function all(MedicationRepository $medRepo): JsonResponse
    {
        // Optimizasyon: İlaçları, stoklarını, sevkiyatlarını ve reçetelerini tek sorguda çekiyoruz
        $medications = $medRepo->createQueryBuilder('m')
            ->leftJoin('m.stock', 's')->addSelect('s')
            ->leftJoin('m.shipments', 'sh')->addSelect('sh')
            ->leftJoin('m.prescriptions', 'p')->addSelect('p')
            ->getQuery()
            ->getResult();

        $result = [];

        foreach ($medications as $m) {
            $stock = $m->getStock();
            $currentStock = $stock ? $stock->getCurrentStock() : 0;

            // Stok durumu hesaplama (Hafızada yapılıyor, DB'ye gidilmiyor)
            $stockStatus = $stock ? (
            $currentStock <= $stock->getMinStock() ? "critical" :
                ($currentStock <= $stock->getMinStock() * 1.5 ? "low" : "good")
            ) : "none";

            // Son sevkiyat bilgisi
            $lastShipment = $m->getShipments()->last() ?: null;

            $result[] = [
                'id' => $m->getId(),
                'name' => $m->getName(),
                'manufacturer' => $m->getManufacturer(),
                'stock' => $currentStock,
                'stockStatus' => $stockStatus,
                'shipmentStatus' => $lastShipment ? $lastShipment->getStatus() : 'none',
                'prescriptionCount' => $m->getPrescriptions()->count(),
                'patientCount' => $m->getPrescriptions()->count(),
                'doseTaken' => 0, // Bu kısım detay sayfasında hesaplanmalı
                'doseTotal' => 0
            ];
        }

        return new JsonResponse($result);
    }
}
