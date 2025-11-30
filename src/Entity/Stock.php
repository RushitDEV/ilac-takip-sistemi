<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Medication;

#[ORM\Entity]
class Stock
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;



    #[ORM\ManyToOne(targetEntity: Medication::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private $medication;

    #[ORM\Column(type: "integer")]
    private ?int $currentStock;

    #[ORM\Column(type: "integer")]
    private ?int $minStock;

    #[ORM\Column(type: "integer")]
    private ?int $maxStock;

    #[ORM\Column(type: "date", nullable: true)]
    private ?\DateTimeInterface $lastRestock;

    // --- GETTERS & SETTERS START ---

    public function getId()
    {
        return $this->id;
    }

    public function getMedication(): ?Medication
    {
        return $this->medication;
    }

    public function setMedication(?Medication $medication): self
    {
        $this->medication = $medication;
        return $this;
    }

    public function getCurrentStock(): ?int
    {
        return $this->currentStock;
    }

    public function setCurrentStock(int $value): self
    {
        $this->currentStock = $value;
        return $this;
    }

    public function getMinStock(): ?int
    {
        return $this->minStock;
    }

    public function setMinStock(int $value): self
    {
        $this->minStock = $value;
        return $this;
    }

    public function getMaxStock(): ?int
    {
        return $this->maxStock;
    }

    public function setMaxStock(int $value): self
    {
        $this->maxStock = $value;
        return $this;
    }

    public function getLastRestock(): ?\DateTimeInterface
    {
        return $this->lastRestock;
    }

    public function setLastRestock(?\DateTimeInterface $date): self
    {
        $this->lastRestock = $date;
        return $this;
    }

    // --- GETTERS & SETTERS END ---
}
