<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Medication;

#[ORM\Entity]
class Shipment
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "UUID")]
    #[ORM\Column(type: "uuid")]
    private $id;

    #[ORM\Column(length: 100)]
    private ?string $shipmentCode;

    #[ORM\ManyToOne(targetEntity: Medication::class)]
    #[ORM\JoinColumn(nullable: false)]
    private $medication;

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
    private ?string $status; // pending, in_transit, delivered

    #[ORM\Column(type: "datetime")]
    private ?\DateTimeInterface $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }
}
