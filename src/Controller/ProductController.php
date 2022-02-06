<?php

namespace App\Controller;

use App\Entity\Product;
use App\Manager\EntityManager;
use App\Repository\ProductRepository;
use App\Service\ProductService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/product', name: 'api_product_')]
class ProductController extends AbstractController 
{
	#[Route("", name: "create_product", methods: ["POST"])]
    #[Route("/{id<\d+>}", name: "update_product", methods: ["PUT", "PATCH"])]
	public function updateProduct(
		?Product $product = null, 
		ProductService $productService, 
		EntityManager $entityManager,
	): Response {
		// product from the request body (form/json):
		$requestProduct = $productService->getProductFromRequest(); 
		if($product) $productService->mergeProducts($product, $requestProduct);
		else $product = $requestProduct;
		$errors = $productService->validateEntity($product)["errors"];
		if(empty($errors)) {
			$entityManager->flushEntity($product);
			return $productService->getFlushedProductResponse($product, true);
		}
		return $productService->getValidationErrorsResponse($errors);
    }


	#[Route("", name: "get_products", methods: ["GET"])]
	public function getProducts(
		Request $req,
		ProductService $productService, 
		ProductRepository $productRepo
	): Response {
		$query = $req->query->get("q");
		$page = (int)$req->query->get("p") ?? 0;
		$products = null;
		if($query) $products = $productRepo->findByText($query, $page);
		else $products = $productRepo->findAll($page);
		$productService->addPriceDetails($products["results"]);
		return $this->json($products);
    }

	#[Route("/{id<\d+>}", name: "delete_product", methods: ["DELETE"])]
	public function deleteProduct(?Product $product = null,	EntityManager $entityManager): Response {
		if(!$product) return new Response("No product found for that id.", 404);
		$entityManager->removeEntity($product);
		return new Response();
    }
}