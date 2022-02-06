<?php

namespace App\Service;

use Symfony\Component\Security\Core\User\UserInterface;

class JwtService extends EntityService {
	public function __construct(private $jwtExpirationTime) {
	}
	/**
	 * @param  array $data ["token" => "hash"]
	 * @return array ["message" => "content", "payload" => ["token" => "hash", "expiration" => "unixTime"]]
	 */
	public function getJwtResponseData(UserInterface $user, array $data, ?int $jwtExpirationTime = null) {
		if(!$jwtExpirationTime) $jwtExpirationTime = time() + $this->jwtExpirationTime;
		return [
			"message" => "Welcome " . $user->getUserIdentifier() . " !",
			"payload" => [
				"jwt" => [
					"token" => $data["token"],
					"expiration" => $jwtExpirationTime
				],
				"username" => $user->getUserIdentifier()
			]
		];
	}
}