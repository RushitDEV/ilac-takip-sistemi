<?php

namespace App\Controller\Api;

use App\Entity\Medication;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/medication')]
class MedicationController extends AbstractController
{
    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $med = new Medication();
        $med->setName($data['name'] ?? '');
        $med->setDescription($data['description'] ?? null);
        $med->setBarcode($data['barcode'] ?? '');
        $med->setManufacturer($data['manufacturer'] ?? '');
        $med->setType($data['type'] ?? '');
        $med->setImageUrl($data['imageUrl'] ?? null);

        $em->persist($med);
        $em->flush();

        return new JsonResponse([
            'message' => 'İlaç başarıyla eklendi',
            'id'      => $med->getId(),
        ]);
    }

    #[Route('', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $medications = $em->getRepository(Medication::class)->findAll();

        $response = [];

        foreach ($medications as $m) {
            $response[] = [
                'id'           => $m->getId(),
                'name'         => $m->getName(),
                'barcode'      => $m->getBarcode(),
                'type'         => $m->getType(),
                'manufacturer' => $m->getManufacturer(),
                'description'  => $m->getDescription(),
                'imageUrl'     => $m->getImageUrl(),
                'createdAt'    => $m->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];
        }

        return new JsonResponse($response);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function detail(string $id, EntityManagerInterface $em): JsonResponse
    {
        $med = $em->getRepository(Medication::class)->find($id);

        if (!$med) {
            return new JsonResponse(['error' => 'İlaç bulunamadı'], 404);
        }

        return new JsonResponse([
            'id'           => $med->getId(),
            'name'         => $med->getName(),
            'description'  => $med->getDescription(),
            'barcode'      => $med->getBarcode(),
            'type'         => $med->getType(),
            'manufacturer' => $med->getManufacturer(),
            'imageUrl'     => $med->getImageUrl(),
            'createdAt'    => $med->getCreatedAt()?->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(string $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $med = $em->getRepository(Medication::class)->find($id);

        if (!$med) {
            return new JsonResponse(['error' => 'İlaç bulunamadı'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $med->setName($data['name'] ?? $med->getName());
        $med->setDescription($data['description'] ?? $med->getDescription());
        $med->setBarcode($data['barcode'] ?? $med->getBarcode());
        $med->setType($data['type'] ?? $med->getType());
        $med->setManufacturer($data['manufacturer'] ?? $med->getManufacturer());
        $med->setImageUrl($data['imageUrl'] ?? $med->getImageUrl());

        $em->flush();

        return new JsonResponse(['message' => 'İlaç güncellendi']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(string $id, EntityManagerInterface $em): JsonResponse
    {
        $med = $em->getRepository(Medication::class)->find($id);

        if (!$med) {
            return new JsonResponse(['error' => 'İlaç bulunamadı'], 404);
        }

        $em->remove($med);
        $em->flush();

        return new JsonResponse(['message' => 'İlaç silindi']);
    }
}
