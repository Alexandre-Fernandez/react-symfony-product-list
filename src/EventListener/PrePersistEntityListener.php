<?php

namespace App\EventListener;

class PrePersistEntityListener {
	public function prePersist(object $entity): void {
		if(method_exists($entity, "setCreatedAt")) $entity->setCreatedAt(new \DateTimeImmutable());
		if(method_exists($entity, "setUpdatedAt")) $entity->setUpdatedAt(new \DateTimeImmutable());
	}
}