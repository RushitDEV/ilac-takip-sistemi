<?php

namespace App\Controller\Api;

use App\Entity\Medication;
use App\Entity\Stock;
use App\Repository\MedicationRepository;
use App\Repository\StockRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/medication')]
class MedicationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private MedicationRepository   $medicationRepo,
        private StockRepository        $stockRepo,
    ) {}

    // -------------------------------------------------
    //  İLAÇ LİSTELE
    //  Frontend: GET /api/medication
    // -------------------------------------------------
    #[Route('', name: 'app_api_medication_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        // İlaçları stokla birlikte çek
        $medications = $this->medicationRepo->createQueryBuilder('m')
            ->leftJoin('m.stock', 's')
            ->addSelect('s')
            ->getQuery()
            ->getResult();

        $result = [];

        /** @var Medication $m */
        foreach ($medications as $m) {
            /** @var Stock|null $stock */
            $stock = $m->getStock();

            $result[] = [
                'id'               => $m->getId(),
                'name'             => $m->getName(),
                'barcode'          => $m->getBarcode(),
                'manufacturer'     => $m->getManufacturer(),
                'activeIngredient' => $m->getActiveIngredient(),
                'price'            => $m->getPrice(),
                'expiryDate'       => $m->getExpiryDate()?->format('Y-m-d'),

                // stok bilgileri (yoksa 0 / null)
                'stock' => [
                    'id'           => $stock?->getId(),
                    'currentStock' => $stock?->getCurrentStock() ?? 0,
                    'minStock'     => $stock?->getMinStock() ?? 5,
                    'maxStock'     => $stock?->getMaxStock() ?? 500,
                    'lastRestock'  => $stock?->getLastRestock()?->format('Y-m-d H:i'),
                    'expiryDate'   => $stock?->getExpiryDate()?->format('Y-m-d'),
                    'note'         => $stock?->getNote(),
                ],
            ];
        }

        return new JsonResponse($result);
    }

    // -------------------------------------------------
    //  İLAÇ OLUŞTUR
    //  Frontend: POST /api/medication
    // -------------------------------------------------
    #[Route('', name: 'app_api_medication_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $name             = $data['name']             ?? null;
        $barcode          = $data['barcode']          ?? null;
        $manufacturer     = $data['manufacturer']     ?? null;
        $activeIngredient = $data['activeIngredient'] ?? null;
        $price            = $data['price']            ?? null;
        $expiryDate       = $data['expiryDate']       ?? null;

        if (!$name || !$barcode) {
            return new JsonResponse(['message' => 'İlaç adı ve barkod zorunludur'], 400);
        }

        $med = new Medication();
        $med->setName($name);
        $med->setBarcode($barcode);
        $med->setManufacturer($manufacturer);
        $med->setActiveIngredient($activeIngredient);
        $med->setPrice((float)($price ?? 0));

        if (!empty($expiryDate)) {
            try {
                $med->setExpiryDate(new \DateTimeImmutable($expiryDate));
            } catch (\Exception) {
                // tarih parse edilemezse boş bırak
            }
        }

        $this->em->persist($med);
        $this->em->flush();

        return new JsonResponse([
            'id'      => $med->getId(),
            'message' => 'İlaç kaydedildi',
        ], 201);
    }

    // -------------------------------------------------
    //  İLAÇ DETAY
    // -------------------------------------------------
    #[Route('/{id}', name: 'app_api_medication_detail', methods: ['GET'])]
    public function detail(int $id): JsonResponse
    {
        $med = $this->medicationRepo->find($id);
        if (!$med) {
            return new JsonResponse(['message' => 'İlaç bulunamadı'], 404);
        }

        $stock = $med->getStock();

        return new JsonResponse([
            'id'               => $med->getId(),
            'name'             => $med->getName(),
            'barcode'          => $med->getBarcode(),
            'manufacturer'     => $med->getManufacturer(),
            'activeIngredient' => $med->getActiveIngredient(),
            'price'            => $med->getPrice(),
            'expiryDate'       => $med->getExpiryDate()?->format('Y-m-d'),
            'stock'            => $stock ? [
                'id'           => $stock->getId(),
                'currentStock' => $stock->getCurrentStock(),
                'minStock'     => $stock->getMinStock(),
                'maxStock'     => $stock->getMaxStock(),
                'lastRestock'  => $stock->getLastRestock()?->format('Y-m-d H:i'),
                'expiryDate'   => $stock->getExpiryDate()?->format('Y-m-d'),
                'note'         => $stock->getNote(),
            ] : null,
        ]);
    }

    // -------------------------------------------------
    //  İLAÇ GÜNCELLE
    // -------------------------------------------------
    #[Route('/{id}', name: 'app_api_medication_update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $med = $this->medicationRepo->find($id);
        if (!$med) {
            return new JsonResponse(['message' => 'İlaç bulunamadı'], 404);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        if (isset($data['name'])) {
            $med->setName($data['name']);
        }
        if (isset($data['barcode'])) {
            $med->setBarcode($data['barcode']);
        }
        if (isset($data['manufacturer'])) {
            $med->setManufacturer($data['manufacturer']);
        }
        if (isset($data['activeIngredient'])) {
            $med->setActiveIngredient($data['activeIngredient']);
        }
        if (isset($data['price'])) {
            $med->setPrice((float)$data['price']);
        }
        if (array_key_exists('expiryDate', $data)) {
            if ($data['expiryDate']) {
                try {
                    $med->setExpiryDate(new \DateTimeImmutable($data['expiryDate']));
                } catch (\Exception) {
                }
            } else {
                $med->setExpiryDate(null);
            }
        }

        $this->em->flush();

        return new JsonResponse(['message' => 'İlaç güncellendi']);
    }

    // -------------------------------------------------
    //  İLAÇ SİL
    // -------------------------------------------------
    #[Route('/{id}', name: 'app_api_medication_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $med = $this->medicationRepo->find($id);
        if (!$med) {
            return new JsonResponse(['message' => 'İlaç bulunamadı'], 404);
        }

        // stok varsa önce onu sil
        $stock = $this->stockRepo->findOneBy(['medication' => $med]);
        if ($stock) {
            $this->em->remove($stock);
        }

        $this->em->remove($med);
        $this->em->flush();

        return new JsonResponse(['message' => 'İlaç silindi']);
    }
}
