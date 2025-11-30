<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\PrescriptionHistory;
use App\Entity\Medication;

#[ORM\Entity]
class PrescriptionHistoryItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "CUSTOM")]
    #[ORM\CustomIdGenerator(class: "Ramsey\Uuid\Doctrine\UuidGenerator")]
    #[ORM\Column(type: "uuid")]
    private ?string $id = null;


    #[ORM\ManyToOne(targetEntity: PrescriptionHistory::class)]
    #[ORM\JoinColumn(nullable:false, onDelete:"CASCADE")]
    private $history;

    #[ORM\ManyToOne(targetEntity: Medication::class)]
    #[ORM\JoinColumn(nullable:false)]
    private $medication;

    // GETTERS / SETTERS

    public function getId()
    {
        return $this->id;
    }

    public function getHistory(): ?PrescriptionHistory
    {
        return $this->history;
    }

    public function setHistory(PrescriptionHistory $history): self
    {
        $this->history = $history;
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
}
