<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Medication
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "UUID")]
    #[ORM\Column(type:"uuid")]
    private $id;

    #[ORM\Column(length: 50, unique: true)]
    private ?string $barcode = null;

    #[ORM\Column(length: 200)]
    private ?string $name = null;

    #[ORM\Column(length: 200)]
    private ?string $activeIngredient = null;

    #[ORM\Column(length: 200)]
    private ?string $manufacturer = null;

    #[ORM\Column(type:"date", nullable:true)]
    private ?\DateTimeInterface $expiryDate = null;

    #[ORM\Column(type:"decimal", precision:10, scale:2)]
    private ?string $price = null;

    #[ORM\Column(type:"datetime")]
    private ?\DateTimeInterface $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    // GETTERS & SETTERS

    public function getId()
    {
        return $this->id;
    }

    public function getBarcode(): ?string
    {
        return $this->barcode;
    }

    public function setBarcode(?string $barcode): self
    {
        $this->barcode = $barcode;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getActiveIngredient(): ?string
    {
        return $this->activeIngredient;
    }

    public function setActiveIngredient(string $active): self
    {
        $this->activeIngredient = $active;
        return $this;
    }

    public function getManufacturer(): ?string
    {
        return $this->manufacturer;
    }

    public function setManufacturer(string $manufacturer): self
    {
        $this->manufacturer = $manufacturer;
        return $this;
    }

    public function getExpiryDate(): ?\DateTimeInterface
    {
        return $this->expiryDate;
    }

    public function setExpiryDate(?\DateTimeInterface $expiry): self
    {
        $this->expiryDate = $expiry;
        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }
}
