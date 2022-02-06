<?php

namespace App\Service;

use App\Entity\Product;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProductService extends EntityService {
	private const VAT = 1.2;
	private Request $req;

	public function __construct(RequestStack $req, ValidatorInterface $validator) {
		parent::__construct($validator);
		if($req) $this->req = $req->getCurrentRequest();
	}
	
	/**
	 * merges $merged's truthy properties into $source
	 */
	public function mergeProducts(Product $source, Product $merged): void {
		if($merged->getName()) $source->setName($merged->getName());
		if($merged->getPrice()) $source->setPrice($merged->getPrice());
		if($merged->getCreatedAt()) $source->setCreatedAt($merged->getCreatedAt());
	}
	
	/**
	 * ---- POST: get the data from $req->request (multipart/form-data)
	 * ---- OTHER: get the JSON data from $req->getContent()
	 */
	public function getProductFromRequest(?Request $req = null): Product {
		if(!$req) $req = $this ->req;
		$product = new Product();
		switch ($req->getMethod()) {
			case "POST":
				if($req->get("name")) $product->setName($req->get("name"));
				if($req->get("price")) $product->setPrice($req->get("price"));
				break;

			default:
				$body = json_decode($req->getContent());
				if(!$body) return $product;
				if(property_exists($body, "name")) $product->setName($body->name);
				if(property_exists($body, "price")) $product->setPrice($body->price);
		}
		return $product;
	}

	public function getFlushedProductResponse(Product $product, bool $addPriceDetails = false): Response {
		if(!$addPriceDetails) return new JsonResponse([
			"id" => $product->getId(),
			"name" => $product->getName(),
			"price" => $product->getPrice(),
			"createdAt" => $product->getCreatedAt()
		]);
		$this->addPriceDetails($product);
		return new JsonResponse($product);
 	}

	/**
	 * adds price details (vat & grossPrice) to an array of Product products (obtained from repo with Query::HYDRATE_ARRAY)
	 * ---- if fed with a single Product it will transform it to an array as well
	 * @param  array|Product $products an array of Product arrays or a single Product
	 */
	public function addPriceDetails(array|Product &$products) {
		if(!is_array($products)) {
			$vat = $this->getVat($products->getPrice());
			$products = [
				"id" => $products->getId(),
				"name" => $products->getName(),
				"price" => $products->getPrice(),
				"createdAt" => $products->getCreatedAt(),
				"vat" => $vat,
				"grossPrice" => round($products->getPrice(), 2) - $vat
			];
		}
		else foreach($products as &$product) {
			$vat = $this->getVat($product["price"]);
			$product["vat"] = $vat;
			$product["grossPrice"] = round($product["price"], 2) - $vat;
		} 
		
		
	}

	public function getGrossPrice(Product|float $product) {
		$calculate = function(float $price): float { return round($price / self::VAT, 2); };
		if($product instanceof Product) return $calculate($product->getPrice());
		return $calculate($product);
	}

	public function getVat(Product|float $product) {
		$calculate = function(float $price): float { return round($price - ($price / self::VAT), 2); };
		if($product instanceof Product) return $calculate($product->getPrice());
		return $calculate($product);
	}
}