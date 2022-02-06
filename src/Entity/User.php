<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: "email", message: "The e-mail {{ value }} is already being used.")]
#[UniqueEntity(fields: "name", message: "The username {{ value }} is already being used.")]
class User implements UserInterface, PasswordAuthenticatedUserInterface {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 100, unique: true)]
	#[Assert\NotNull(message: "Please provide an username.")]
	#[Assert\Length(min: 1, max: 100, 
		minMessage: "Please provide an username.",
		maxMessage: "Your username cannot be more than {{ limit }} characters long."
	)]
    private $name;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
	#[Assert\NotNull(message: "Please provide an user e-mail.")]
	#[Assert\Email(message: "Please provide a valid e-mail.")]
    private $email;

    #[ORM\Column(type: 'string')]
	#[Assert\NotNull(message: "Please provide an user password.")]
	#[Assert\Length(min: 6, max: 255, 
		minMessage: "Your password must be atleast {{ limit }} characters long.",
		maxMessage: "Your password length cannot be more than {{ limit }} characters long."
	)]
    private $password;

    #[ORM\Column(type: 'json')]
    private $roles = [];

    #[ORM\Column(type: 'datetime_immutable')]
    private $createdAt;

	public function __construct(?string $name = null, ?string $email = null, ?string $password = null) {
		if($name) $this->name = $name;
		if($email) $this->email = $email;
		if($password) $this->password = $password;
	}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

	// used by lexik/jwt-authentication-bundle to retrieve the User
	public function getUsername(): ?string {
		return $this->email;
	}

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->name;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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
