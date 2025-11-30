<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Patient;

#[ORM\Entity]
class VitalSign
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable:false)]
    private $patient;

    #[ORM\Column(length:30)]
    private ?string $type = null;
    // blood_pressure, pulse, oxygen

    #[ORM\Column(type:"integer", nullable:true)]
    private ?int $systolic = null;

    #[ORM\Column(type:"integer", nullable:true)]
    private ?int $diastolic = null;

    #[ORM\Column(type:"decimal", precision:10, scale:2, nullable:true)]
    private ?string $value = null;

    #[ORM\Column(length:20)]
    private ?string $unit = null;

    #[ORM\Column(type:"datetime")]
    private ?\DateTimeInterface $date = null;


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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getSystolic(): ?int
    {
        return $this->systolic;
    }

    public function setSystolic(?int $value): self
    {
        $this->systolic = $value;
        return $this;
    }

    public function getDiastolic(): ?int
    {
        return $this->diastolic;
    }

    public function setDiastolic(?int $value): self
    {
        $this->diastolic = $value;
        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): self
    {
        $this->value = $value;
        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(string $unit): self
    {
        $this->unit = $unit;
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
}
