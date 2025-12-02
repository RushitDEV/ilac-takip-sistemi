<?php

namespace App\Controller\Api;

use App\Entity\Patient;
use App\Repository\PatientRepository;
use App\Repository\PrescriptionRepository;
use App\Repository\DoseScheduleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/patient-tracking')]
class PatientTrackingController extends AbstractController
{
    // -------------------------------------------------
    //  TÜM HASTALARI GETİR
    // -------------------------------------------------
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
                'gender' => $p->getGender(),
                'birthDate' => $p->getBirthDate()?->format('Y-m-d'),
            ];
        }

        return new JsonResponse($data);
    }

    // -------------------------------------------------
    //  HASTANIN TÜM REÇETELERİ
    // -------------------------------------------------
    #[Route('/{patientId}/prescriptions', methods: ['GET'])]
    public function listPrescriptions(
        string $patientId,
        PrescriptionRepository $repo
    ): JsonResponse {

        $prescriptions = $repo->findBy(['patient' => $patientId]);

        $result = [];

        foreach ($prescriptions as $pr) {

            $medication = $pr->getMedication();
            $totalDose = $pr->getTotalDose() ?? 0;
            $usedDose = $pr->getUsedDose() ?? 0;
            $remainingDose = max(0, $totalDose - $usedDose);

            $result[] = [
                'id' => $pr->getId(),
                'createdAt' => $pr->getCreatedAt()?->format('Y-m-d'),
                'doctor' => $pr->getDoctorName() ?? "Doktor Bilinmiyor",

                'medicationName' => $medication?->getName() ?? "İlaç Belirtilmemiş",
                'totalDose' => $totalDose,
                'remainingDose' => $remainingDose,
                'usedDose' => $usedDose,
            ];
        }

        return new JsonResponse($result);
    }

    // -------------------------------------------------
    //  BİR REÇETENİN TÜM DOZ PROGRAMI
    // -------------------------------------------------
    #[Route('/prescription/{id}/doses', methods: ['GET'])]
    public function getDoses(
        string $id,
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
                    'name' => $d->getMedication()?->getName() ?? "İlaç Yok",
                    'activeIngredient' => $d->getMedication()?->getActiveIngredient() ?? ""
                ]
            ];
        }

        return new JsonResponse($data);
    }
}
