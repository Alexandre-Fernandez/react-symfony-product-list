<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
	#[Assert\NotNull(message: "Please provide a product name.")]
	#[Assert\Length(min: 1, max: 100, 
		minMessage: "Please provide a product name.",
		maxMessage: "The product name cannot be more than {{ limit }} characters long."
	)]
    private $name;

    #[ORM\Column(type: 'float')]
	#[Assert\NotNull(message: "Please provide a product price.")]
	#[Assert\GreaterThan(0, message: "Nothing is free in life.")]
    private $price;

    #[ORM\Column(type: 'datetime_immutable')]
    private $createdAt;

	public function __construct(?string $name = null, ?float $price = null) {
		if($name) $this->name = $name;
		if($price) $this->price = $price;
	}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
