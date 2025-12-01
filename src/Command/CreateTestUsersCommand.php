<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-test-users',
    description: 'Test kullanıcılarını oluşturur.'
)]
class CreateTestUsersCommand extends Command
{
    private EntityManagerInterface $em;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct();
        $this->em = $em;
        $this->passwordHasher = $passwordHasher;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // ECZACI KULLANICI
        $pharmacist = new User();
        $pharmacist->setEmail("admin@ilac.com");
        $pharmacist->setName("Eczacı Admin");
        $pharmacist->setRole("pharmacy"); // DİKKAT!
        $pharmacist->setPassword(
            $this->passwordHasher->hashPassword($pharmacist, "123456")
        );
        $this->em->persist($pharmacist);

        // HASTA KULLANICI
        $patient = new User();
        $patient->setEmail("hasta@ilac.com");
        $patient->setName("Hasta Kullanıcı");
        $patient->setRole("patient"); // Zaten default
        $patient->setPassword(
            $this->passwordHasher->hashPassword($patient, "123456")
        );
        $this->em->persist($patient);

        $this->em->flush();

        $output->writeln("✔ Test kullanıcıları oluşturuldu!");
        return Command::SUCCESS;
    }
}
