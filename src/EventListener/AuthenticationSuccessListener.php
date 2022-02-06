<?php

namespace App\EventListener;

use App\Service\JwtService;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

class AuthenticationSuccessListener 
{
	public function __construct(private JwtService $jwtService) {
	}

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $e) {
		$e->setData(
			$this->jwtService->getJwtResponseData($e->getUser(), $e->getData())
		);
    }
}