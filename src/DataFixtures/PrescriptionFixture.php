<?php

namespace App\DataFixtures;

use App\Entity\Prescription;
use App\Entity\User; // User sınıfını ekle
use App\Entity\Medication; // Medication sınıfını ekle
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

// Bu Fixture, UserFixture ve MedicationFixture'dan sonra çalışmalıdır.
class PrescriptionFixture extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // 1. Önce gerekli Entity referanslarını alalım
        // Düzeltildi: Hata mesajına göre sınıf adını ikinci argüman olarak ekledik.
        $userPatient = $this->getReference('user_patient', User::class);
        $medParol = $this->getReference('med_parol', Medication::class);
        $medAugmentin = $this->getReference('med_augmentin', Medication::class);

        // Şu anki tarihi kullanalım
        $today = new \DateTimeImmutable();
        $inTwoWeeks = (new \DateTimeImmutable())->modify('+2 weeks');
        $oneMonthAgo = (new \DateTimeImmutable())->modify('-1 month');


        // Reçete 1: Hasta kullanıcının Parol reçetesi
        $prescription1 = new Prescription();
        $prescription1->setPatient($userPatient);
        $prescription1->setMedication($medParol);
        $prescription1->setDose('1 Tablet');
        $prescription1->setFrequency('Günde 2 kez');
        $prescription1->setStartDate($today);
        $prescription1->setEndDate($inTwoWeeks);
        $manager->persist($prescription1);
        $this->addReference('pres_parol_active', $prescription1); // Schedule için referans

        // Reçete 2: Hasta kullanıcının Augmentin reçetesi (Geçmişte kaldı)
        $prescription2 = new Prescription();
        $prescription2->setPatient($userPatient);
        $prescription2->setMedication($medAugmentin);
        $prescription2->setDose('5 ml');
        $prescription2->setFrequency('Günde 3 kez');
        $prescription2->setStartDate($oneMonthAgo);
        $prescription2->setEndDate($oneMonthAgo->modify('+7 days')); // 7 gün sürmüş
        $manager->persist($prescription2);

        $manager->flush();
    }

    /**
     * Hangi Fixtures'ın önce yüklenmesi gerektiğini belirtir.
     */
    public function getDependencies(): array
    {
        return [
            UserFixture::class,
            MedicationFixture::class,
        ];
    }
}
