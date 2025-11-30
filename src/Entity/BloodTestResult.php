<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Patient;

#[ORM\Entity]
class BloodTestResult
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;


    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable:false)]
    private $patient;

    #[ORM\Column(length:100)]
    private ?string $testName = null;

    #[ORM\Column(type:"decimal", precision:10, scale:2)]
    private ?string $value = null;

    #[ORM\Column(length:50)]
    private ?string $unit = null;

    #[ORM\Column(length:50)]
    private ?string $normalRange = null;

    #[ORM\Column(length:20)]
    private ?string $status = null; // normal | high | low

    #[ORM\Column(length:20)]
    private ?string $trend = null; // up | down | stable

    #[ORM\Column(type:"date")]
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

    public function getTestName(): ?string
    {
        return $this->testName;
    }

    public function setTestName(string $testName): self
    {
        $this->testName = $testName;
        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(string $value): self
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

    public function getNormalRange(): ?string
    {
        return $this->normalRange;
    }

    public function setNormalRange(string $normalRange): self
    {
        $this->normalRange = $normalRange;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getTrend(): ?string
    {
        return $this->trend;
    }

    public function setTrend(string $trend): self
    {
        $this->trend = $trend;
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
