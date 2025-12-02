<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Patient
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;

    #[ORM\Column(length: 120)]
    private ?string $name = null;

    #[ORM\Column(length: 120)]
    private ?string $surname = null;

    #[ORM\Column(length: 20, unique: true)]
    private ?string $tc = null;

    #[ORM\Column(length: 10)]
    private ?string $gender = null;

    #[ORM\Column(type: "date")]
    private ?\DateTimeInterface $birthDate = null;

    public function getId(): ?string { return $this->id; }

    public function getName(): ?string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getSurname(): ?string { return $this->surname; }
    public function setSurname(string $surname): self { $this->surname = $surname; return $this; }

    public function getTc(): ?string { return $this->tc; }
    public function setTc(string $tc): self { $this->tc = $tc; return $this; }

    public function getGender(): ?string { return $this->gender; }
    public function setGender(string $gender): self { $this->gender = $gender; return $this; }

    public function getBirthDate(): ?\DateTimeInterface { return $this->birthDate; }
    public function setBirthDate(\DateTimeInterface $birthDate): self { $this->birthDate = $birthDate; return $this; }
}
