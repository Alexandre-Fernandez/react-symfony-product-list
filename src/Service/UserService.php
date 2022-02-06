<?php

namespace App\Service;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserService extends EntityService {
	private Request $req;

	public function __construct(
		private UserPasswordHasherInterface $hasher,
		RequestStack $req,
		ValidatorInterface $validator
	) {
		parent::__construct($validator);
		if($req) $this->req = $req->getCurrentRequest();
	}

	public function hashUserPassword(User $user): void {
		$user->setPassword(
			$this->hasher->hashPassword($user, $user->getPassword())
		);
	}

	public function getUserFromRequest(?Request $req = null): User {
		if(!$req) $req = $this->req;
		$user = new User(
			$req->get("name"),
			$req->get("email"),
			$req->get("password")
		);
		return $user;
	}
}