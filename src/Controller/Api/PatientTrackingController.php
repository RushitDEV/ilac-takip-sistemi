<?php

namespace App\Controller\Api;

use App\Entity\Patient;
use App\Entity\Prescription;
use App\Entity\DoseSchedule;
use App\Repository\PatientRepository;
use App\Repository\PrescriptionRepository;
use App\Repository\DoseScheduleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/patient-tracking')]
class PatientTrackingController extends AbstractController
{
    #[Route('/patients', methods: ['GET'])]
    public function listPatients(PatientRepository $repo): JsonResponse
    {
        $patients = $repo->findAll();
        $data = [];

        foreach ($patients as $p) {
            $data[] = [
                'id' => $p->getId(),
                'name' => $p->getName(),
                'surname' => $p->getSurname(),
                'tc' => $p->getTc(),
                'birthDate' => $p->getBirthDate()?->format('Y-m-d'),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/{patientId}/prescriptions', methods: ['GET'])]
    public function listPrescriptions(
        $patientId,
        PrescriptionRepository $repo
    ): JsonResponse {
        $prescriptions = $repo->findBy(['patient' => $patientId]);

        $data = [];

        foreach ($prescriptions as $pr) {
            $data[] = [
                'id' => $pr->getId(),
                'createdAt' => $pr->getCreatedAt()?->format('Y-m-d'),
                'doctor' => $pr->getDoctorName(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/prescription/{id}/doses', methods: ['GET'])]
    public function getDoses(
        $id,
        DoseScheduleRepository $repo
    ): JsonResponse {
        $doses = $repo->findBy(['prescription' => $id]);

        $data = [];

        foreach ($doses as $d) {
            $data[] = [
                'id' => $d->getId(),
                'time' => $d->getTime()?->format('H:i'),
                'status' => $d->isTaken() ? 'taken' : 'pending',
                'medication' => [
                    'name' => $d->getMedication()->getName(),
                    'activeIngredient' => $d->getMedication()->getActiveIngredient()
                ]
            ];
        }

        return new JsonResponse($data);
    }
}
