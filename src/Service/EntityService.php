<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class EntityService {
	public function __construct(private ValidatorInterface $validator) {
	}

	/**
	 * @return array [strtolower((new \ReflectionClass($entity))->getShortName()) => $entity, "errors" => $errors] 
	 * ---- $entity's index name will be the lowercase $entity class name
	 * ---- $errors is an array of error strings
	 */
	public function validateEntity(object $entity): array {
		$errors = [];
		foreach($this->validator->validate($entity) as $error) {
			$errors[$error->GetpropertyPath()]=$error->getMessage();
		}
		return [
			strtolower((new \ReflectionClass($entity))->getShortName()) => $entity, 
			"errors" => $errors
		];
	}
	
	/**
	 * @param  array $errors an array of error strings, obtainable from EntityService->validateEntity
	 */
	public function getValidationErrorsResponse(array $errors): Response {
		// using regular Response because JsonResponse replaces some $errors with htmlentities:
		return new Response(json_encode($errors), 400); 
	}

	public function isEmpty(object $entity): bool {
		foreach($entity as $property) {
			if($property) return false ;
		}
		return true;
	}
}