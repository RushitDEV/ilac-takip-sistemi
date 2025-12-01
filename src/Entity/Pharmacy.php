<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;

#[ORM\Entity]
class Pharmacy
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;

    #[ORM\Column(length: 150)]
    private ?string $name;

    #[ORM\Column(length: 255)]
    private ?string $address;

    #[ORM\Column(length: 20)]
    private ?string $phone;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $taxNumber;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $pharmacyCode;

    #[ORM\OneToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner;

    public function getId() { return $this->id; }
    public function getName() { return $this->name; }
    public function setName($v) { $this->name = $v; return $this; }

    public function getAddress() { return $this->address; }
    public function setAddress($v) { $this->address = $v; return $this; }

    public function getPhone() { return $this->phone; }
    public function setPhone($v) { $this->phone = $v; return $this; }

    public function getTaxNumber() { return $this->taxNumber; }
    public function setTaxNumber($v) { $this->taxNumber = $v; return $this; }

    public function getPharmacyCode() { return $this->pharmacyCode; }
    public function setPharmacyCode($v) { $this->pharmacyCode = $v; return $this; }

    public function getOwner() { return $this->owner; }
    public function setOwner(User $u) { $this->owner = $u; return $this; }
}
