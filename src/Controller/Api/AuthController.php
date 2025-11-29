<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/auth', name: 'api_auth_')]
class AuthController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    // Bağımlılık Enjeksiyonu
    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * Kullanıcı girişi için mock API.
     */
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return $this->json(['message' => 'E-posta ve şifre gerekli.'], 400);
        }

        // Kullanıcıyı bul
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            return $this->json(['message' => 'Geçersiz kimlik bilgileri.'], 401);
        }

        // Şifre kontrolü
        if (!$this->passwordHasher->isPasswordValid($user, $password)) {
            return $this->json(['message' => 'Geçersiz kimlik bilgileri.'], 401);
        }

        // ✅ DÜZELTME: Gerçek user verisini döndür
        return $this->json([
            'token' => 'mock_jwt_token_' . bin2hex(random_bytes(16)),
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),  // ✅ Array olarak döner
            ],
        ]);
    }

    /**
     * Oturumu kapatma.
     */
    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        return $this->json(['message' => 'Oturum başarıyla kapatıldı.']);
    }
}
