<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

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

        $user = new User();
        $user->setName($data['name'] ?? null);
        $user->setEmail($data['email']);
        $user->setRole('patient');
        $user->setPassword(
            $passwordHasher->hashPassword($user, $data['password'])
        );

        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            'message' => 'Kayıt başarılı',
        ]);
    }

    #[Route('/login', methods: ['POST'])]
    public function login(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwt
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        $user = $em->getRepository(User::class)->findOneBy([
            'email' => $data['email']
        ]);

        if (!$user) {
            return new JsonResponse(['message' => 'Kullanıcı bulunamadı'], 404);
        }

        if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
            return new JsonResponse(['message' => 'Şifre hatalı'], 401);
        }

        // JWT token oluştur
        $token = $jwt->create($user);

        // ROLE DÖNÜŞÜMÜ
        $roles = $user->getRole() === 'pharmacy'
            ? ['ROLE_ADMIN']
            : ['ROLE_USER'];

        return new JsonResponse([
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'name' => $user->getName(),
                'roles' => $roles
            ]
        ]);
    }
}
