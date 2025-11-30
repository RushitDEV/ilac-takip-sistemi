<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class MedicineInteraction
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy:"UUID")]
    #[ORM\Column(type:"uuid")]
    private $id;

    #[ORM\Column(length:200)]
    private ?string $medicine1 = null;

    #[ORM\Column(length:200)]
    private ?string $medicine2 = null;

    #[ORM\Column(length:20)]
    private ?string $severity = null; // low | medium | high

    #[ORM\Column(type:"text")]
    private ?string $warning = null;

    // GETTERS / SETTERS

    public function getId()
    {
        return $this->id;
    }

    public function getMedicine1(): ?string
    {
        return $this->medicine1;
    }

    public function setMedicine1(string $medicine): self
    {
        $this->medicine1 = $medicine;
        return $this;
    }

    public function getMedicine2(): ?string
    {
        return $this->medicine2;
    }

    public function setMedicine2(string $medicine): self
    {
        $this->medicine2 = $medicine;
        return $this;
    }

    public function getSeverity(): ?string
    {
        return $this->severity;
    }

    public function setSeverity(string $severity): self
    {
        $this->severity = $severity;
        return $this;
    }

    public function getWarning(): ?string
    {
        return $this->warning;
    }

    public function setWarning(string $warning): self
    {
        $this->warning = $warning;
        return $this;
    }
}
