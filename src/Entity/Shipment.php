<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Medication;

#[ORM\Entity]
class Shipment
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;

    #[ORM\Column(length: 100)]
    private ?string $shipmentCode;

    #[ORM\ManyToOne(targetEntity: Medication::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Medication $medication = null;

    #[ORM\Column(length: 200)]
    private ?string $supplier;

    #[ORM\Column(length: 200)]
    private ?string $origin;

    #[ORM\Column(length: 200)]
    private ?string $destination;

    #[ORM\Column(length: 200)]
    private ?string $currentLocation;

    #[ORM\Column(type: "integer")]
    private ?int $quantity;

    #[ORM\Column(type: "date", nullable: true)]
    private ?\DateTimeInterface $estimatedArrival;

    #[ORM\Column(length: 20)]
    private ?string $status;

    #[ORM\Column(type: "datetime")]
    private ?\DateTimeInterface $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    // GETTERS - SETTERS

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getShipmentCode(): ?string
    {
        return $this->shipmentCode;
    }

    public function setShipmentCode(string $code): self
    {
        $this->shipmentCode = $code;
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

    public function getSupplier(): ?string
    {
        return $this->supplier;
    }

    public function setSupplier(string $supplier): self
    {
        $this->supplier = $supplier;
        return $this;
    }

    public function getOrigin(): ?string
    {
        return $this->origin;
    }

    public function setOrigin(string $origin): self
    {
        $this->origin = $origin;
        return $this;
    }

    public function getDestination(): ?string
    {
        return $this->destination;
    }

    public function setDestination(string $dest): self
    {
        $this->destination = $dest;
        return $this;
    }

    public function getCurrentLocation(): ?string
    {
        return $this->currentLocation;
    }

    public function setCurrentLocation(string $loc): self
    {
        $this->currentLocation = $loc;
        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $qty): self
    {
        $this->quantity = $qty;
        return $this;
    }

    public function getEstimatedArrival(): ?\DateTimeInterface
    {
        return $this->estimatedArrival;
    }

    public function setEstimatedArrival(?\DateTimeInterface $date): self
    {
        $this->estimatedArrival = $date;
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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }
}
