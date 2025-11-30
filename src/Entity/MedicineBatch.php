<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Medication;

#[ORM\Entity]
class MedicineBatch
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;


    #[ORM\ManyToOne(targetEntity: Medication::class)]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private $medication;

    #[ORM\Column(length:100)]
    private ?string $batchNo = null;

    #[ORM\Column(type:"integer")]
    private ?int $quantity = null;

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $expiryDate = null;

    #[ORM\Column(type:"datetime")]
    private ?\DateTimeInterface $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    // GETTERS / SETTERS

    public function getId()
    {
        return $this->id;
    }

    public function getMedication(): ?Medication
    {
        return $this->medication;
    }

    public function setMedication(Medication $medication): self
    {
        $this->medication = $medication;
        return $this;
    }

    public function getBatchNo(): ?string
    {
        return $this->batchNo;
    }

    public function setBatchNo(string $batchNo): self
    {
        $this->batchNo = $batchNo;
        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;
        return $this;
    }

    public function getExpiryDate(): ?\DateTimeInterface
    {
        return $this->expiryDate;
    }

    public function setExpiryDate(\DateTimeInterface $expiryDate): self
    {
        $this->expiryDate = $expiryDate;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $date): self
    {
        $this->createdAt = $date;
        return $this;
    }
}
