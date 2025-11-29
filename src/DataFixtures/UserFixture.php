<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
// KRITIK: Şifreleme servisini kullanmak için bu satırı eklemelisin!
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixture extends Fixture
{
    private $passwordHasher;

    // Symfony, bu yapıcı metot (constructor) sayesinde UserPasswordHasherInterface servisini otomatik olarak buraya enjekte eder.
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // 1. Test Kullanıcısı (Admin Rolü)
        $userAdmin = new User();
        $userAdmin->setEmail('admin@ilac.com');
        $userAdmin->setRoles(['ROLE_ADMIN']);
        $hashedPassword = $this->passwordHasher->hashPassword(
            $userAdmin,
            '123456' // Test şifresi
        );
        $userAdmin->setPassword($hashedPassword);

        // Bu kullanıcının referansını kaydediyoruz ki, PrescriptionFixture dosyasında bu kullanıcıyı kullanabilelim.
        $manager->persist($userAdmin);
        $this->addReference('user_admin', $userAdmin);

        // 2. Normal Test Kullanıcısı (Hasta Rolü)
        $userPatient = new User();
        $userPatient->setEmail('hasta@ilac.com');
        $userPatient->setRoles(['ROLE_USER']);
        $hashedPassword = $this->passwordHasher->hashPassword(
            $userPatient,
            '123456' // Test şifresi
        );
        $userPatient->setPassword($hashedPassword);

        $manager->persist($userPatient);
        $this->addReference('user_patient', $userPatient);

        $manager->flush(); // Veritabanına kaydetme işlemini gerçekleştirir
    }

    // NOT: Bir sonraki fixtürü çalıştırmadan önce bu dosyayı kaydettiğinden emin ol!
}
