<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    #[Route('/register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse([
                'error' => 'Geçersiz veri'
            ], 400);
        }

        // Email tekrar kontrolü
        $existing = $em->getRepository(User::class)->findOneBy([
            'email' => $data['email']
        ]);

        if ($existing) {
            return new JsonResponse([
                'error' => 'Bu email zaten kayıtlı'
            ], 409);
        }

        $user = new User();
        $user->setName($data['name'] ?? null);
        $user->setEmail($data['email']);
        $user->setRole('patient');

        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            'message' => 'Kayıt başarılı',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'role' => $user->getRole()
            ]
        ]);
    }

    #[Route('/login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // JWT login firewall otomatik token döner.
        return new JsonResponse([
            'message' => 'Login başarılı'
        ]);
    }
}
