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
    #[Route('', name: 'app_api_patient_create', methods: ['POST'])]
    public function create(Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $name = $data['name'] ?? null;
        $surname = $data['surname'] ?? null;
        $tc = $data['tc'] ?? null;
        $gender = $data['gender'] ?? null;
        $birthDate = $data['birthDate'] ?? null;

        if (!$name || !$surname || !$tc) {
            return new JsonResponse(['message' => 'Ad, soyad ve TC zorunludur'], 400);
        }

        // -----------------------------------------
        // 1) USER OLUŞTUR (HASTA LOGİN İÇİN)
        // -----------------------------------------
        $email = $tc . '@hasta.com';
        $rawPassword = substr($tc, -4); // TC'nin son 4 hanesi

        $user = new User();
        $user->setEmail($email);
        $user->setRoles(['ROLE_PATIENT']);
        $user->setPassword($passwordHasher->hashPassword($user, $rawPassword));

        $this->em->persist($user);

        // -----------------------------------------
        // 2) PATIENT OLUŞTUR (KİŞİSEL BİLGİLER)
        // -----------------------------------------
        $patient = new Patient();
        $patient->setName($name);
        $patient->setSurname($surname);
        $patient->setTc($tc);
        $patient->setGender($gender);

        if ($birthDate) {
            try {
                $patient->setBirthDate(new \DateTimeImmutable($birthDate));
            } catch (\Exception $e) {}
        }

        // ➤ USER-PATIENT BAĞLANTISI
        $patient->setUser($user);

        $this->em->persist($patient);
        $this->em->flush();

        return new JsonResponse([
            'message' => 'Hasta oluşturuldu',
            'patientId' => $patient->getId(),
            'loginInfo' => [
                'email' => $email,
                'password' => $rawPassword
            ]
        ], 201);
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
