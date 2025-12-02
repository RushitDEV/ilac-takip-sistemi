<?php

namespace App\Controller\Api;

use App\Entity\Patient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/patient')]
class PatientController extends AbstractController
{
    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $patient = new Patient();
        $patient->setName($data['name']);
        $patient->setSurname($data['surname']);
        $patient->setTc($data['tc']);
        $patient->setGender($data['gender']);
        $patient->setBirthDate(new \DateTime($data['birthDate']));

        $em->persist($patient);
        $em->flush();

        return new JsonResponse([
            'message' => 'Hasta kaydedildi',
            'id' => $patient->getId()
        ]);
    }

    #[Route('', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $patients = $em->getRepository(Patient::class)->findAll();
        $response = [];

        foreach ($patients as $p) {
            $response[] = [
                'id' => $p->getId(),
                'name' => $p->getName(),
                'surname' => $p->getSurname(),
                'tc' => $p->getTc(),
                'gender' => $p->getGender(),
                'birthDate' => $p->getBirthDate()->format('Y-m-d')
            ];
        }

        return new JsonResponse($response);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function detail(string $id, EntityManagerInterface $em): JsonResponse
    {
        $p = $em->getRepository(Patient::class)->find($id);

        if (!$p) {
            return new JsonResponse(['error' => 'Hasta bulunamadı'], 404);
        }

        return new JsonResponse([
            'id' => $p->getId(),
            'name' => $p->getName(),
            'surname' => $p->getSurname(),
            'tc' => $p->getTc(),
            'gender' => $p->getGender(),
            'birthDate' => $p->getBirthDate()->format('Y-m-d')
        ]);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(string $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $p = $em->getRepository(Patient::class)->find($id);

        if (!$p) {
            return new JsonResponse(['error' => 'Hasta bulunamadı'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $p->setName($data['name'] ?? $p->getName());
        $p->setSurname($data['surname'] ?? $p->getSurname());
        $p->setTc($data['tc'] ?? $p->getTc());
        $p->setGender($data['gender'] ?? $p->getGender());
        if (isset($data['birthDate']))
            $p->setBirthDate(new \DateTime($data['birthDate']));

        $em->flush();

        return new JsonResponse(['message' => 'Hasta güncellendi']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(string $id, EntityManagerInterface $em): JsonResponse
    {
        $p = $em->getRepository(Patient::class)->find($id);

        if (!$p) {
            return new JsonResponse(['error' => 'Hasta bulunamadı'], 404);
        }

        $em->remove($p);
        $em->flush();

        return new JsonResponse(['message' => 'Hasta silindi']);
    }
}
