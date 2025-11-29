<?php

namespace App\Entity;

use App\Repository\ScheduleRepository;
use Doctrine\ORM\Mapping as ORM;
use DateTimeImmutable; // DateTimeImmutable kullanmak için ekle

#[ORM\Entity(repositoryClass: ScheduleRepository::class)]
class Schedule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // KRİTİK GÜNCELLEME 1: type'ı time_immutable olarak değiştiriyoruz
    #[ORM\Column(type: 'time_immutable')]
    private ?\DateTimeImmutable $time = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $days = null;

    #[ORM\ManyToOne(inversedBy: 'schedules')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Prescription $prescription = null;

    // DoseEvent için ilişki eklenmeli
    #[ORM\OneToMany(targetEntity: DoseEvent::class, mappedBy: 'schedule', orphanRemoval: true)]
    private $doseEvents;

    public function __construct()
    {
        $this->doseEvents = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTime(): ?\DateTimeImmutable
    {
        return $this->time;
    }

    // KRİTİK GÜNCELLEME 2: setTime metodunu DateTimeImmutable kabul edecek şekilde değiştiriyoruz
    public function setTime(\DateTimeImmutable $time): static
    {
        $this->time = $time;

        return $this;
    }

    public function getDays(): ?string
    {
        return $this->days;
    }

    public function setDays(?string $days): static
    {
        $this->days = $days;

        return $this;
    }

    public function getPrescription(): ?Prescription
    {
        return $this->prescription;
    }

    public function setPrescription(?Prescription $prescription): static
    {
        $this->prescription = $prescription;

        return $this;
    }

    /**
     * @return Collection<int, DoseEvent>
     */
    public function getDoseEvents(): \Doctrine\Common\Collections\Collection
    {
        return $this->doseEvents;
    }

    public function addDoseEvent(DoseEvent $doseEvent): static
    {
        if (!$this->doseEvents->contains($doseEvent)) {
            $this->doseEvents->add($doseEvent);
            $doseEvent->setSchedule($this);
        }

        return $this;
    }

    public function removeDoseEvent(DoseEvent $doseEvent): static
    {
        if ($this->doseEvents->removeElement($doseEvent)) {
            // set the owning side to null (unless already changed)
            if ($doseEvent->getSchedule() === $this) {
                $doseEvent->setSchedule(null);
            }
        }

        return $this;
    }
}
