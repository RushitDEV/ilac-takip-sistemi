<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;

#[ORM\Entity]
class Notification
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "UUID")]
    #[ORM\Column(type: "uuid")]
    private $id;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private $user;

    #[ORM\Column(length: 50)]
    private ?string $type = null;
    // info | warning | alert | medicine | stock | system

    #[ORM\Column(length: 200)]
    private ?string $title = null;

    #[ORM\Column(type: "text")]
    private ?string $message = null;

    #[ORM\Column(type: "boolean")]
    private bool $isUnread = true;

    #[ORM\Column(type: "datetime")]
    private \DateTimeInterface $createdAt;


    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->isUnread = true;
    }

    // ========== GETTERS & SETTERS ==========

    public function getId()
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
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

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;
        return $this;
    }

    public function isUnread(): bool
    {
        return $this->isUnread;
    }

    public function setUnread(bool $unread): self
    {
        $this->isUnread = $unread;
        return $this;
    }

    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $date): self
    {
        $this->createdAt = $date;
        return $this;
    }
}
