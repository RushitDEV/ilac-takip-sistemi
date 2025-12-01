<?php

namespace App\Controller\Api;

use App\Entity\Medication;
use App\Entity\Stock;
use App\Entity\Shipment;
use App\Entity\Prescription;
use App\Entity\DoseSchedule;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/lifecycle')]
class LifecycleController extends AbstractController
{
    #[Route('/all', methods: ['GET'])]
    public function all(EntityManagerInterface $em): JsonResponse
    {
        $medRepo = $em->getRepository(Medication::class);
        $stockRepo = $em->getRepository(Stock::class);
        $shipmentRepo = $em->getRepository(Shipment::class);
        $presRepo = $em->getRepository(Prescription::class);
        $doseRepo = $em->getRepository(DoseSchedule::class);

        $medications = $medRepo->findAll();
        $result = [];

        foreach ($medications as $m) {

            // STOCK
            $stock = $stockRepo->findOneBy(['medication' => $m]);
            $currentStock = $stock ? $stock->getCurrentStock() : 0;
            $stockStatus = $stock ? (
            $currentStock <= $stock->getMinStock() ? "critical" :
                ($currentStock <= $stock->getMinStock() * 1.5 ? "low" : "good")
            ) : "none";

            // SHIPMENT
            $shipment = $shipmentRepo->findOneBy(['medication' => $m], ['createdAt' => 'DESC']);
            $shipmentStatus = $shipment ? $shipment->getStatus() : 'none';

            // PRESCRIPTIONS
            $prescriptions = $presRepo->findBy(['medication' => $m]);
            $patientCount = count($prescriptions);

            // DOSE STATUS
            $doses = $doseRepo->findBy(['medication' => $m]);
            $taken = 0;
            $total = count($doses);
            foreach ($doses as $d) {
                if ($d->isTaken()) $taken++;
            }

            $result[] = [
                'id' => $m->getId(),
                'name' => $m->getName(),
                'manufacturer' => $m->getManufacturer(),

                'stock' => $currentStock,
                'stockStatus' => $stockStatus,

                'shipmentStatus' => $shipmentStatus,

                'prescriptionCount' => $patientCount,
                'patientCount' => $patientCount,

                'doseTaken' => $taken,
                'doseTotal' => $total
            ];
        }

        return new JsonResponse($result);
    }
}
