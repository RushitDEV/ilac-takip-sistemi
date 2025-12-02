<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Patient;
use App\Entity\Medication;

#[ORM\Entity]
class Prescription
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable:false)]
    private ?Patient $patient = null;

    #[ORM\ManyToOne(targetEntity: Medication::class)]
    #[ORM\JoinColumn(nullable:false)]
    private ?Medication $medication = null;

    #[ORM\Column(length:200)]
    private ?string $doctor = null;

    #[ORM\Column(length:50)]
    private ?string $dosage = null;

    #[ORM\Column(length:200)]
    private ?string $purpose = null;

    #[ORM\Column(length:50)]
    private ?string $frequency = null;

    #[ORM\Column(type:"integer")]
    private int $totalDose = 0;

    #[ORM\Column(type:"integer")]
    private int $usedDose = 0;

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type:"date", nullable:true)]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column(type:"datetime")]
    private \DateTimeInterface $createdAt;

    #[ORM\Column(type:"text", nullable:true)]
    private ?string $instructions = null;

    #[ORM\Column(type:"text", nullable:true)]
    private ?string $sideEffects = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    // GETTERS / SETTERS

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(Patient $patient): self
    {
        $this->patient = $patient;
        return $this;
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

    public function getDoctor(): ?string
    {
        return $this->doctor;
    }

    public function setDoctor(string $doctor): self
    {
        $this->doctor = $doctor;
        return $this;
    }

    public function getDosage(): ?string
    {
        return $this->dosage;
    }

    public function setDosage(string $dosage): self
    {
        $this->dosage = $dosage;
        return $this;
    }

    public function getPurpose(): ?string
    {
        return $this->purpose;
    }

    public function setPurpose(string $purpose): self
    {
        $this->purpose = $purpose;
        return $this;
    }

    public function getFrequency(): ?string
    {
        return $this->frequency;
    }

    public function setFrequency(string $frequency): self
    {
        $this->frequency = $frequency;
        return $this;
    }

    public function getTotalDose(): int
    {
        return $this->totalDose;
    }

    public function setTotalDose(int $dose): self
    {
        $this->totalDose = $dose;
        return $this;
    }

    public function getUsedDose(): int
    {
        return $this->usedDose;
    }

    public function setUsedDose(int $dose): self
    {
        $this->usedDose = $dose;
        return $this;
    }

    public function getRemainingDose(): int
    {
        return max(0, $this->totalDose - $this->usedDose);
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $date): self
    {
        $this->startDate = $date;
        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeInterface $date): self
    {
        $this->endDate = $date;
        return $this;
    }

    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $d): self
    {
        $this->createdAt = $d;
        return $this;
    }

    public function getInstructions(): ?string
    {
        return $this->instructions;
    }

    public function setInstructions(?string $instructions): self
    {
        $this->instructions = $instructions;
        return $this;
    }

    public function getSideEffects(): ?string
    {
        return $this->sideEffects;
    }

    public function setSideEffects(?string $sideEffects): self
    {
        $this->sideEffects = $sideEffects;
        return $this;
    }
}
