<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

---

```markdown
# Guide d'Exécution du Projet (Pressing LIC)

Ce projet est orchestré avec Docker. Il permet de lancer l'API Laravel et la base de données PostgreSQL dans un environnement identique sur n'importe quel ordinateur.

---

## Prérequis

Assurez-vous d'avoir installé :
* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Démarrage Rapide (Pas à Pas)

### 1. Cloner le projet
```bash
git clone <https://github.com/elmakhtar10/examen-pressing-mohamed-el-makhtar-ba-isi-2026>
cd examen-pressing-mohamed-el-makhtar-ba-isi-2026

```

### 2. Configurer le fichier d'environnement Backend

Créez le fichier `.env` dans le dossier `backend/` :

* **Sur Linux / macOS / Git Bash :**
```bash
cp backend/.env.example backend/.env

```


* **Sur Windows (CMD / PowerShell) :**
```cmd
copy backend\.env.example backend\.env

```



Vérifiez que la configuration de la base de données dans `backend/.env` correspond aux services Docker :

```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=pressing_db
DB_USERNAME=postgres
DB_PASSWORD=password

```

### 3. Lancer les conteneurs Docker

À la racine du projet (`/examen`), exécutez :

```bash
docker compose up -d --build

```

### 4. Initialiser l'application Laravel

Générez la clé d'application, lancez les migrations et alimentez la base de données avec les seeders :

```bash
docker exec -it pressing_backend php artisan key:generate
docker exec -it pressing_backend php artisan migrate:fresh --seed

```

L'API Backend est désormais opérationnelle sur : **`http://localhost:8000`**

---

## 🔑 Identifiants de Test (Gestionnaire)

Le seeder crée automatiquement le compte administrateur suivant :

* **Email :** `admin@pressing.com`
* **Mot de passe :** `password123`

---

## 🛠️ Commandes Utiles au Quotidien

* **Arrêter les conteneurs :**
```bash
docker compose down

```


* **Redémarrer les conteneurs :**
```bash
docker compose restart

```


* **Consulter les logs de l'API Laravel en direct :**
```bash
docker logs -f pressing_backend

```


* **Réinitialiser complètement la base de données (Migrations + Seeders) :**
```bash
docker exec -it pressing_backend php artisan migrate:fresh --seed

```


* **Exécuter une commande Artisan dans le conteneur :**
```bash
docker exec -it pressing_backend php artisan <commande>

```



```

```
