<?php

namespace App\Controller;

use App\Manager\EntityManager;
use App\Service\EntityService;
use App\Service\JwtService;
use App\Service\UserService;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RegistrationController extends AbstractController 
{
	#[Route("/register", "app_register", methods: ["POST"])]
    public function register(
		UserService $userService, 
		EntityService $entityService, 
		EntityManager $entityManager, 
		JWTTokenManagerInterface $jwt,
		JwtService $jwtService
	): Response {
		extract(// User $user, array $errors
			$entityService->validateEntity($userService->getUserFromRequest())
		); 
		if(empty($errors)) {
			$userService->hashUserPassword($user);
			$entityManager->flushEntity($user);
			$data = ["token" => $jwt->create($user)];
			return new JsonResponse($jwtService->getJwtResponseData($user, $data));
		}
		return $entityService->getValidationErrorsResponse($errors);
    }
}