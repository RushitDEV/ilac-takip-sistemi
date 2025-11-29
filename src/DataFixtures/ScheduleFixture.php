<?php

namespace App\DataFixtures;

use App\Entity\Schedule;
use App\Entity\Prescription; // KRİTİK EKLENTİ (getReference metodu için)
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ScheduleFixture extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Önce aktif olan Parol reçetesini alalım
        // KRİTİK DÜZELTME: İkinci argüman olarak sınıfı ekliyoruz (eski Doctrine sürümü için)
        $activePrescription = $this->getReference('pres_parol_active', Prescription::class);

        // Zamanlama 1: Sabah 08:00
        $schedule1 = new Schedule();
        $schedule1->setPrescription($activePrescription);
        $schedule1->setTime(\DateTimeImmutable::createFromFormat('H:i', '08:00')); // Saati oluşturma
        $schedule1->setDays('Her gün'); // Veya "Pazartesi, Çarşamba, Cuma"
        $manager->persist($schedule1);
        $this->addReference('schedule_parol_sabah', $schedule1); // DoseEvent için referans

        // Zamanlama 2: Akşam 20:00
        $schedule2 = new Schedule();
        $schedule2->setPrescription($activePrescription);
        $schedule2->setTime(\DateTimeImmutable::createFromFormat('H:i', '20:00'));
        $schedule2->setDays('Her gün');
        $manager->persist($schedule2);
        $this->addReference('schedule_parol_aksam', $schedule2);

        $manager->flush();
    }

    /**
     * PrescriptionFixture'ın bu Fixture'dan önce yüklenmesini sağlar.
     */
    public function getDependencies(): array
    {
        return [
            PrescriptionFixture::class,
        ];
    }
}
