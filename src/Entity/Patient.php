<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;

#[ORM\Entity]
class Patient
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "UUID")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;

    #[ORM\OneToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?User $user = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $tcNo = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(type: "integer", nullable: true)]
    private ?int $age = null;

    // ========== GETTER & SETTER METOTLARI ==========

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getTcNo(): ?string
    {
        return $this->tcNo;
    }

    public function setTcNo(?string $tcNo): self
    {
        $this->tcNo = $tcNo;
        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;
        return $this;
    }

    public function getAge(): ?int
    {
        return $this->age;
    }

    public function setAge(?int $age): self
    {
        $this->age = $age;
        return $this;
    }
}
