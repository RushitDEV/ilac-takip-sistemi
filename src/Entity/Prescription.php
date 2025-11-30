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
    private $patient;

    #[ORM\ManyToOne(targetEntity: Medication::class)]
    #[ORM\JoinColumn(nullable:false)]
    private $medication;

    #[ORM\Column(length:200)]
    private ?string $doctor = null;

    #[ORM\Column(length:50)]
    private ?string $dosage = null;

    #[ORM\Column(length:200)]
    private ?string $purpose = null;

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column(type:"text", nullable:true)]
    private ?string $instructions = null;

    #[ORM\Column(type:"text", nullable:true)]
    private ?string $sideEffects = null;


    // GETTERS / SETTERS

    public function getId()
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

    public function setEndDate(\DateTimeInterface $date): self
    {
        $this->endDate = $date;
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
