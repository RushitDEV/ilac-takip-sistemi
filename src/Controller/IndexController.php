<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class IndexController extends AbstractController
{
    /**
     * React uygulamasını yükleyen ana Controller.
     * Bu rota, /api/ ile başlamayan tüm yolları yakalar.
     */
    #[Route('/{reactRouting}', name: 'index', requirements: ['reactRouting' => '^(?!api\/).+'], defaults: ['reactRouting' => null])]
    public function index(): Response
    {
        // React uygulamasının yükleneceği Twig şablonunu döndürür.
        return $this->render('base.html.twig', [
            'controller_name' => 'IndexController',
        ]);
    }
}
