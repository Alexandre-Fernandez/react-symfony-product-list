<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ViewController extends AbstractController
{
    #[Route("", name: "view_index")]
	#[Route("/register", name: "view_register", methods:["GET"])]
	#[Route("/products", name: "view_products", methods:["GET"])]
    public function index(): Response {
		return $this->render("base.html.twig");
    }
}
