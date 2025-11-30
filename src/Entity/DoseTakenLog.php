<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\DoseSchedule;

#[ORM\Entity]
class DoseTakenLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy:"UUID")]
    #[ORM\Column(type:"uuid")]
    private $id;

    #[ORM\ManyToOne(targetEntity: DoseSchedule::class)]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private $schedule;

    #[ORM\Column(type:"date")]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type:"boolean")]
    private ?bool $taken = false;

    // GETTERS & SETTERS

    public function getId()
    {
        return $this->id;
    }

    public function getSchedule(): ?DoseSchedule
    {
        return $this->schedule;
    }

    public function setSchedule(DoseSchedule $schedule): self
    {
        $this->schedule = $schedule;
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

    public function isTaken(): ?bool
    {
        return $this->taken;
    }

    public function setTaken(bool $taken): self
    {
        $this->taken = $taken;
        return $this;
    }
}
