<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[
    OA\Info(
        version: "1.0.0",
        description: "Documentation interactive de l'API du système de gestion de Pressing LIC.",
        title: "API Pressing LIC Documentation"
    ),
    OA\Server(
        url: "http://localhost:8000/api",
        description: "Serveur Local API"
    ),
    OA\SecurityScheme(
        securityScheme: "bearerAuth",
        type: "http",
        name: "Authorization",
        in: "header",
        bearerFormat: "JWT",
        scheme: "bearer"
    )
]

abstract class Controller
{
    //
}
