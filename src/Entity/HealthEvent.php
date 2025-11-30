<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Patient;

#[ORM\Entity]
class HealthEvent
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy:"UUID")]
    #[ORM\Column(type:"uuid")]
    private $id;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable:false)]
    private $patient;

    #[ORM\Column(length:50)]
    private ?string $type = null;
    // test | prescription | medicine | visit | completed

    #[ORM\Column(length:200)]
    private ?string $title = null;

    #[ORM\Column(type:"text")]
    private ?string $description = null;

    #[ORM\Column(length:200, nullable:true)]
    private ?string $location = null;

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $desc): self
    {
        $this->description = $desc;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): self
    {
        $this->location = $location;
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
