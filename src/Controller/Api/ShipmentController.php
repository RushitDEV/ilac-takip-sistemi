<?php

namespace App\Controller\Api;

use App\Repository\ShipmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/shipment')]
class ShipmentController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(ShipmentRepository $repo): JsonResponse
    {
        // Optimizasyon: Medication bilgilerini JOIN ile çek
        $shipments = $repo->createQueryBuilder('s')
            ->innerJoin('s.medication', 'm')
            ->addSelect('m')
            ->orderBy('s.createdAt', 'DESC')
            ->getQuery()
            ->getResult();

        $data = array_map(fn($s) => [
            'id' => $s->getId(),
            'shipmentCode' => $s->getShipmentCode(),
            'status' => $s->getStatus(),
            'quantity' => $s->getQuantity(),
            'medicationName' => $s->getMedication()->getName(),
            'estimatedArrival' => $s->getEstimatedArrival()?->format('Y-m-d'),
        ], $shipments);

        return new JsonResponse($data);
    }
}
