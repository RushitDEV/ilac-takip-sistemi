<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Prescription;

#[ORM\Entity]
class PrescriptionDailyLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;


    #[ORM\ManyToOne(targetEntity: Prescription::class)]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private $prescription;

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type:"integer")]
    private ?int $takenCount = 0;

    #[ORM\Column(type:"integer")]
    private ?int $totalCount = 0;

    // GETTERS & SETTERS

    public function getId()
    {
        return $this->id;
    }

    public function getPrescription(): ?Prescription
    {
        return $this->prescription;
    }

    public function setPrescription(Prescription $prescription): self
    {
        $this->prescription = $prescription;
        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;
        return $this;
    }

    public function getTakenCount(): ?int
    {
        return $this->takenCount;
    }

    public function setTakenCount(int $taken): self
    {
        $this->takenCount = $taken;
        return $this;
    }

    public function getTotalCount(): ?int
    {
        return $this->totalCount;
    }

    public function setTotalCount(int $total): self
    {
        $this->totalCount = $total;
        return $this;
    }
}
