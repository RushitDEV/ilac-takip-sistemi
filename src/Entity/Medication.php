<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Stock;

#[ORM\Entity]
class Medication
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "AUTO")]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 100)]
    private string $barcode;

    #[ORM\Column(length: 255)]
    private string $manufacturer;

    #[ORM\Column(length: 255)]
    private string $activeIngredient;

    #[ORM\Column(type: "float")]
    private float $price = 0;

    #[ORM\Column(type: "date", nullable: true)]
    private ?\DateTimeInterface $expiryDate = null;

    // --- EN ÖNEMLİ DÜZELTME ---
    #[ORM\OneToOne(mappedBy: "medication", cascade: ["persist", "remove"])]
    private ?Stock $stock = null;
    // --------------------------------

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }
    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getBarcode(): string
    {
        return $this->barcode;
    }
    public function setBarcode(string $barcode): self
    {
        $this->barcode = $barcode;
        return $this;
    }

    public function getManufacturer(): string
    {
        return $this->manufacturer;
    }
    public function setManufacturer(string $manufacturer): self
    {
        $this->manufacturer = $manufacturer;
        return $this;
    }

    public function getActiveIngredient(): string
    {
        return $this->activeIngredient;
    }
    public function setActiveIngredient(string $a): self
    {
        $this->activeIngredient = $a;
        return $this;
    }

    public function getPrice(): float
    {
        return $this->price;
    }
    public function setPrice(float $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getExpiryDate(): ?\DateTimeInterface
    {
        return $this->expiryDate;
    }
    public function setExpiryDate(?\DateTimeInterface $d): self
    {
        $this->expiryDate = $d;
        return $this;
    }

    public function getStock(): ?Stock
    {
        return $this->stock;
    }
    public function setStock(?Stock $stock): self
    {
        $this->stock = $stock;
        return $this;
    }
}
