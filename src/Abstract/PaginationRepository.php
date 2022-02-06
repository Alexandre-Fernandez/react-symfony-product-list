<?php

namespace App\Abstract;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query;
use Doctrine\Persistence\ManagerRegistry;

abstract class PaginationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, string $entityClass) {
        parent::__construct($registry, $entityClass);
    }
	
	/**
	 * @param  mixed $page begins at 0
	 * @return array ["results" => $results, "isLastPage" => true]
	 * ---- $results is an array of Entity array (["propName" => $prop])
	 */
	protected function getPaginationResult(Query $query, int $page = 0, int $maxResults = 20): array {
		$results = $query
			->setFirstResult($page * $maxResults)
			->setMaxResults($maxResults + 1)
			->getResult(Query::HYDRATE_ARRAY)
		;
		if(count($results) > $maxResults) {
			array_pop($results);
			return ["results" => $results, "isLastPage" => false];
		}
		return ["results" => $results, "isLastPage" => true];
	}
}
