<?php

namespace App\Controller\Api;

use App\Repository\PatientRepository;
use App\Repository\PrescriptionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/patient-tracking')]
class PatientTrackingController extends AbstractController
{
    #[Route('/patients', methods: ['GET'])]
    public function listPatients(PatientRepository $repo): JsonResponse
    {
        // Gereksiz ilişkileri yüklemeden sadece listeyi dön
        $patients = $repo->findAll();
        $data = array_map(fn($p) => [
            'id' => $p->getId(),
            'name' => $p->getName(),
            'surname' => $p->getSurname(),
            'tc' => $p->getTc(),
            'birthDate' => $p->getBirthDate()?->format('Y-m-d'),
        ], $patients);

        return new JsonResponse($data);
    }

    #[Route('/{patientId}/prescriptions', methods: ['GET'])]
    public function listPrescriptions(string $patientId, PrescriptionRepository $repo): JsonResponse
    {
        // Optimizasyon: İlaç bilgisini Join ile getir
        $prescriptions = $repo->createQueryBuilder('p')
            ->innerJoin('p.medication', 'm')
            ->addSelect('m')
            ->where('p.patient = :pid')
            ->setParameter('pid', $patientId)
            ->getQuery()
            ->getResult();

        $result = array_map(fn($pr) => [
            'id' => $pr->getId(),
            'createdAt' => $pr->getCreatedAt()?->format('Y-m-d'),
            'medicationName' => $pr->getMedication()->getName(),
            'totalDose' => $pr->getTotalDose(),
            'usedDose' => $pr->getUsedDose() ?? 0,
            'remainingDose' => max(0, $pr->getTotalDose() - ($pr->getUsedDose() ?? 0)),
        ], $prescriptions);

        return new JsonResponse($result);
    }
}
