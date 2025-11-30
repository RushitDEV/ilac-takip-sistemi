<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Patient;

#[ORM\Entity]
class PrescriptionHistory
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy:"UUID")]
    #[ORM\Column(type:"uuid")]
    private $id;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable:false)]
    private $patient;

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length:200)]
    private ?string $doctor = null;

    #[ORM\Column(length:200)]
    private ?string $hospital = null;

    #[ORM\Column(type:"text")]
    private ?string $diagnosis = null;

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

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;
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

    public function getHospital(): ?string
    {
        return $this->hospital;
    }

    public function setHospital(string $hospital): self
    {
        $this->hospital = $hospital;
        return $this;
    }

    public function getDiagnosis(): ?string
    {
        return $this->diagnosis;
    }

    public function setDiagnosis(string $diagnosis): self
    {
        $this->diagnosis = $diagnosis;
        return $this;
    }
}
