<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Medication;

#[ORM\Entity]
class MedicineLifecycle
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;


    #[ORM\ManyToOne(targetEntity: Medication::class)]
    #[ORM\JoinColumn(nullable:false)]
    private $medication;

    #[ORM\Column(length:200)]
    private ?string $stageName = null;

    #[ORM\Column(length:20)]
    private ?string $status = null; // pending | completed

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length:200)]
    private ?string $location = null;

    #[ORM\Column(type:"text", nullable:true)]
    private ?string $details = null;

    #[ORM\Column(length:200)]
    private ?string $responsible = null;

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

    public function getStageName(): ?string
    {
        return $this->stageName;
    }

    public function setStageName(string $stage): self
    {
        $this->stageName = $stage;
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

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): self
    {
        $this->location = $location;
        return $this;
    }

    public function getDetails(): ?string
    {
        return $this->details;
    }

    public function setDetails(?string $details): self
    {
        $this->details = $details;
        return $this;
    }

    public function getResponsible(): ?string
    {
        return $this->responsible;
    }

    public function setResponsible(string $responsible): self
    {
        $this->responsible = $responsible;
        return $this;
    }
}
