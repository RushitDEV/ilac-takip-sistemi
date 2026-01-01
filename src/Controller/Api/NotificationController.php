<?php

namespace App\Controller\Api;

use App\Entity\Notification;
use App\Repository\NotificationRepository;
use App\Repository\StockRepository;
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
        // Optimizasyon: Sadece gerekli alanları çek ve limit koy
        $notifs = $repo->findBy([], ['createdAt' => 'DESC'], 50);
        $data = array_map(fn($n) => [
            'id' => $n->getId(),
            'title' => $n->getTitle(),
            'message' => $n->getMessage(),
            'type' => $n->getType(),
            'createdAt' => $n->getCreatedAt()->format('Y-m-d H:i'),
            'isRead' => $n->isRead(),
        ], $notifs);

        return new JsonResponse($data);
    }

    #[Route('/generate/stock', methods: ['POST'])]
    public function generateStockWarnings(StockRepository $stocks, EntityManagerInterface $em): JsonResponse
    {
        // Sadece stoğu bitenleri tek seferde filtrele
        $criticalStocks = $stocks->createQueryBuilder('s')
            ->join('s.medication', 'm')
            ->where('s.currentStock <= s.minStock')
            ->getQuery()
            ->getResult();

        foreach ($criticalStocks as $s) {
            $notif = new Notification();
            $notif->setTitle("Düşük Stok Uyarısı");
            $notif->setMessage($s->getMedication()->getName() . " stok kritik seviyede!");
            $notif->setType("stock");
            $em->persist($notif);
        }

        $em->flush(); // Toplu kayıt (Batch insert)
        return new JsonResponse(['message' => 'Stok bildirimleri oluşturuldu']);
    }
}
