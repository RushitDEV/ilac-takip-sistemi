<?php

namespace App\Controller\Api;

use App\Entity\Notification;
use App\Entity\Stock;
use App\Entity\Shipment;
use App\Repository\NotificationRepository;
use App\Repository\StockRepository;
use App\Repository\ShipmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/notifications')]
class NotificationController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(NotificationRepository $repo): JsonResponse
    {
        $notifs = $repo->findBy([], ['createdAt' => 'DESC']);
        $data = [];

        foreach ($notifs as $n) {
            $data[] = [
                'id' => $n->getId(),
                'title' => $n->getTitle(),
                'message' => $n->getMessage(),
                'type' => $n->getType(),  // stock, shipment, prescription
                'createdAt' => $n->getCreatedAt()->format('Y-m-d H:i'),
                'isRead' => $n->isRead(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/mark-read/{id}', methods: ['PUT'])]
    public function markRead($id, EntityManagerInterface $em): JsonResponse
    {
        $notif = $em->getRepository(Notification::class)->find($id);
        if (!$notif) return new JsonResponse(['error' => 'Bildirim yok'], 404);

        $notif->setIsRead(true);
        $em->flush();

        return new JsonResponse(['message' => 'Okundu olarak işaretlendi']);
    }

    #[Route('/generate/stock', methods: ['POST'])]
    public function generateStockWarnings(StockRepository $stocks, EntityManagerInterface $em): JsonResponse
    {
        $all = $stocks->findAll();

        foreach ($all as $s) {
            if ($s->getCurrentStock() <= $s->getMinStock()) {

                $notif = new Notification();
                $notif->setTitle("Düşük Stok Uyarısı");
                $notif->setMessage($s->getMedication()->getName() . " stok kritik seviyede!");
                $notif->setType("stock");

                $em->persist($notif);
            }
        }

        $em->flush();
        return new JsonResponse(['message' => 'Stok bildirimleri oluşturuldu']);
    }

    #[Route('/generate/shipment', methods: ['POST'])]
    public function generateShipmentWarnings(ShipmentRepository $shipmentRepo, EntityManagerInterface $em): JsonResponse
    {
        $items = $shipmentRepo->findAll();

        foreach ($items as $s) {
            if ($s->getStatus() === 'delivered') {

                $notif = new Notification();
                $notif->setTitle("Teslim Edilen Sevkiyat");
                $notif->setMessage("Sevkiyat: " . $s->getShipmentCode() . " teslim edildi.");
                $notif->setType("shipment");

                $em->persist($notif);
            }
        }

        $em->flush();
        return new JsonResponse(['message' => 'Sevkiyat bildirimleri oluşturuldu']);
    }
}
