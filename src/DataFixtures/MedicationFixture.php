<?php

namespace App\DataFixtures;

use App\Entity\Medication;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class MedicationFixture extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // 1. Test İlacı: Parol (Tablet)
        $medication1 = new Medication();
        $medication1->setName('Parol');
        $medication1->setActiveIngredient('Paracetamol');
        $medication1->setForm('Tablet');
        $medication1->setStrength('500mg');
        $medication1->setBarcode('8699543097721');
        $manager->persist($medication1);
        $this->addReference('med_parol', $medication1);

        // 2. Test İlacı: Augmentin (Şurup)
        $medication2 = new Medication();
        $medication2->setName('Augmentin');
        $medication2->setActiveIngredient('Amoksisilin + Klavulanik Asit');
        $medication2->setForm('Şurup');
        $medication2->setStrength('400mg/5ml');
        $medication2->setBarcode('8699569080017');
        $manager->persist($medication2);
        $this->addReference('med_augmentin', $medication2);

        // 3. Test İlacı: Ventolin (Sprey/İnhaler)
        $medication3 = new Medication();
        $medication3->setName('Ventolin');
        $medication3->setActiveIngredient('Salbutamol');
        $medication3->setForm('İnhaler');
        $medication3->setStrength('100 mcg/doz');
        // Barkod opsiyonel olduğu için boş bırakılabilir

        $manager->persist($medication3);
        $this->addReference('med_ventolin', $medication3);

        $manager->flush(); // Veritabanına kaydetme
    }
}
