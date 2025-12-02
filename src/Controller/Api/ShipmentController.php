<?php

namespace App\Controller\Api;

use App\Entity\Medication;
use App\Entity\Shipment;
use App\Repository\ShipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/shipment')]
class ShipmentController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(ShipmentRepository $repo): JsonResponse
    {
        $shipments = $repo->findAll();
        $data = [];

        foreach ($shipments as $s) {
            $data[] = [
                'id' => $s->getId(),
                'shipmentCode' => $s->getShipmentCode(),
                'supplier' => $s->getSupplier(),
                'origin' => $s->getOrigin(),
                'destination' => $s->getDestination(),
                'currentLocation' => $s->getCurrentLocation(),
                'quantity' => $s->getQuantity(),
                'status' => $s->getStatus(),
                'estimatedArrival' => $s->getEstimatedArrival()?->format('Y-m-d'),
                'createdAt' => $s->getCreatedAt()->format('Y-m-d H:i'),
                'medication' => [
                    'id' => $s->getMedication()->getId(),
                    'name' => $s->getMedication()->getName(),
                    'barcode' => $s->getMedication()->getBarcode(),
                    'manufacturer' => $s->getMedication()->getManufacturer(),
                ]
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/create', methods: ['POST'])]
    public function create(Request $req, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($req->getContent(), true);

        // ---- ID FORMAT DESTEĞİ ----
        $medicationId = $data['medicationId']
            ?? $data['medication_id']
            ?? null;

        if (!$medicationId) {
            return new JsonResponse(['error' => 'İlaç ID eksik'], 400);
        }

        // ---- İLAÇ KONTROLÜ ----
        $med = $em->getRepository(Medication::class)->find($medicationId);
        if (!$med) {
            return new JsonResponse(['error' => 'İlaç bulunamadı'], 404);
        }

        // ---- ZORUNLU ALAN KONTROLÜ ----
        $required = ['supplier', 'origin', 'destination', 'estimatedArrival', 'quantity'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === "") {
                return new JsonResponse(["error" => "$field eksik"], 400);
            }
        }

        // ---- SEVKIYAT OLUŞTUR ----
        $shipment = new Shipment();
        $shipment->setMedication($med);
        $shipment->setShipmentCode("SHIP-" . strtoupper(substr(md5(uniqid()), 0, 8)));
        $shipment->setSupplier($data['supplier']);
        $shipment->setOrigin($data['origin']);
        $shipment->setDestination($data['destination']);
        $shipment->setCurrentLocation($data['origin']);
        $shipment->setQuantity($data['quantity']);
        $shipment->setStatus("pending");

        try {
            $shipment->setEstimatedArrival(new \DateTime($data['estimatedArrival']));
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Geçersiz tarih formatı'], 400);
        }

        $em->persist($shipment);
        $em->flush();

        return new JsonResponse(['message' => 'Sevkiyat oluşturuldu']);
    }

    #[Route('/{id}/update-status', methods: ['PUT'])]
    public function updateStatus($id, Request $req, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($req->getContent(), true);
        $shipment = $em->getRepository(Shipment::class)->find($id);

        if (!$shipment) {
            return new JsonResponse(['error' => 'Sevkiyat bulunamadı'], 404);
        }

        if (!isset($data['status']) || !in_array($data['status'], ['pending', 'in_transit', 'delivered'])) {
            return new JsonResponse(['error' => 'Geçersiz durum'], 400);
        }

        $shipment->setStatus($data['status']);

        if (isset($data['currentLocation'])) {
            $shipment->setCurrentLocation($data['currentLocation']);
        }

        $em->flush();

        return new JsonResponse(['message' => 'Durum güncellendi']);
    }
}
