<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Shipment;

#[ORM\Entity]
class ShipmentStage
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy:"UUID")]
    #[ORM\Column(type:"uuid")]
    private $id;

    #[ORM\ManyToOne(targetEntity: Shipment::class)]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private $shipment;

    #[ORM\Column(length:200)]
    private ?string $stageName = null;

    #[ORM\Column(type:"boolean")]
    private ?bool $completed = false;

    #[ORM\Column(type:"date", nullable:true)]
    private ?\DateTimeInterface $date = null;

    // GETTERS & SETTERS

    public function getId()
    {
        return $this->id;
    }

    public function getShipment(): ?Shipment
    {
        return $this->shipment;
    }

    public function setShipment(Shipment $shipment): self
    {
        $this->shipment = $shipment;
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

    public function isCompleted(): ?bool
    {
        return $this->completed;
    }

    public function setCompleted(bool $completed): self
    {
        $this->completed = $completed;
        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): self
    {
        $this->date = $date;
        return $this;
    }
}
