<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Prescription;

#[ORM\Entity]
class DoseSchedule
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;

    #[ORM\ManyToOne(targetEntity: Prescription::class)]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private $prescription;

    #[ORM\Column(type:"time")]
    private ?\DateTimeInterface $time = null;

    #[ORM\Column(type:"boolean")]
    private ?bool $isRecurring = true;

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

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(\DateTimeInterface $time): self
    {
        $this->time = $time;
        return $this;
    }

    public function isRecurring(): ?bool
    {
        return $this->isRecurring;
    }

    public function setIsRecurring(bool $recurring): self
    {
        $this->isRecurring = $recurring;
        return $this;
    }
}
