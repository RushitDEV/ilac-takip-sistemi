<?php

namespace App\Entity;

use App\Repository\StockRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StockRepository::class)]
class Stock
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: "stock")]
    #[ORM\JoinColumn(nullable: false)]
    private ?Medication $medication = null;

    #[ORM\Column(type: 'integer')]
    private int $currentStock = 0;

    #[ORM\Column(type: 'integer')]
    private int $minStock = 5;

    #[ORM\Column(type: 'integer')]
    private int $maxStock = 500;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $lastRestock = null;

    #[ORM\Column(type: 'date', nullable: true)]
    private ?\DateTimeInterface $expiryDate = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $note = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMedication(): ?Medication
    {
        return $this->medication;
    }

    public function setMedication(?Medication $medication): self
    {
        $this->medication = $medication;
        return $this;
    }

    public function getCurrentStock(): int
    {
        return $this->currentStock;
    }

    public function setCurrentStock(int $currentStock): self
    {
        $this->currentStock = $currentStock;
        return $this;
    }

    public function getMinStock(): int
    {
        return $this->minStock;
    }

    public function setMinStock(int $minStock): self
    {
        $this->minStock = $minStock;
        return $this;
    }

    public function getMaxStock(): int
    {
        return $this->maxStock;
    }

    public function setMaxStock(int $maxStock): self
    {
        $this->maxStock = $maxStock;
        return $this;
    }

    public function getLastRestock(): ?\DateTimeInterface
    {
        return $this->lastRestock;
    }

    public function setLastRestock(?\DateTimeInterface $lastRestock): self
    {
        $this->lastRestock = $lastRestock;
        return $this;
    }

    public function getExpiryDate(): ?\DateTimeInterface
    {
        return $this->expiryDate;
    }

    public function setExpiryDate(?\DateTimeInterface $expiryDate): self
    {
        $this->expiryDate = $expiryDate;
        return $this;
    }

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(?string $note): self
    {
        $this->note = $note;
        return $this;
    }
}
