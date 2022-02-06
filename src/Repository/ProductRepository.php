<?php

namespace App\Repository;

use App\Abstract\PaginationRepository;
use App\Entity\Product;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends PaginationRepository
{
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, Product::class);
    }

	public function findAll(int $page = 0, int $itemsPerPage = 20): array {
		$query = $this->createQueryBuilder("p")
			->select("p.id, p.name, p.price, p.createdAt")
			->getQuery()
		;
		return $this->getPaginationResult($query, $page, $itemsPerPage);
	}

	public function findByText($text, $page = 0, int $itemsPerPage = 20): array {
		$query = $this->createQueryBuilder("p")
			->select("p.id, p.name, p.price, p.createdAt")
			->where("p.name LIKE :name")
			->setParameter("name", "%" . $text . "%")
			->getQuery()
		;
		return $this->getPaginationResult($query, $page, $itemsPerPage);
	}
}
