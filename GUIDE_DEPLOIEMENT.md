# ðŸ“˜ Guide Complet d'Administration Docker (ProjectCryptoJava)

Ce document rassemble toutes les commandes et explications nÃ©cessaires pour gÃ©rer, surveiller et modifier votre application complÃ¨te (Frontend, Backend, Base de donnÃ©es) fonctionnant sous Docker.

---

## 1. ðŸš€ DÃ©marrer et ArrÃªter l'Application

L'ensemble de votre projet est orchestrÃ© par le fichier `docker-compose.yml`.

### DÃ©marrer tout le projet
```bash
docker-compose up -d --build
```
> **Explication :** 
> - `up` : DÃ©marre tous les conteneurs (MySQL, Backend, Frontend).
> - `-d` (detached) : Fait tourner l'application en arriÃ¨re-plan (vous rend la main sur votre terminal).
> - `--build` : Force Docker Ã  recompiler les images si vous avez modifiÃ© le code source (Java ou React).

### ArrÃªter l'application (sans perdre les donnÃ©es)
```bash
docker-compose down
```

### ArrÃªter l'application ET effacer la base de donnÃ©es (Remise Ã  zÃ©ro)
```bash
docker-compose down -v
```
> **Attention :** L'option `-v` supprime les "volumes" Docker. Cela effacera toutes les donnÃ©es de votre base MySQL et les fichiers de cryptographie sauvegardÃ©s.

---

## 2. ðŸŒ� Comment accÃ©der Ã  l'application depuis votre navigateur ?

* **Le Frontend (Interface Graphique) :**
  ðŸ‘‰ Ouvrez `http://localhost`
* **Le Backend (L'API Spring Boot) :**
  ðŸ‘‰ Accessible via `http://localhost:8080/api` (direct) OU `http://localhost/api` (via le proxy Nginx).
* **La Base de DonnÃ©es (MySQL) :**
  ðŸ‘‰ Accessible sur le port `3306` (HÃ´te: `localhost`, User: `root`, Mot de passe: `password`).

---

## 3. ðŸ”� Voir les Logs (Journaux de bord)

Si une partie de l'application plante, la premiÃ¨re chose Ã  faire est de regarder ses logs.

### Voir les logs du Backend (Spring Boot)
```bash
docker logs crypto_backend -f
```
> *(Le `-f` permet de voir les logs s'afficher en temps rÃ©el. Faites `Ctrl+C` pour quitter).*

### Voir les logs du Frontend (Nginx/React)
```bash
docker logs crypto_frontend -f
```

### Voir les logs de la Base de donnÃ©es (MySQL)
```bash
docker logs crypto_mysql -f
```

---

## 4. ðŸšª Entrer Ã  l'intÃ©rieur des conteneurs

Vous pouvez "rentrer" dans n'importe quel conteneur comme si c'Ã©tait une petite machine Linux virtuelle.

### Entrer dans le Backend (Spring Boot / Java)
```bash
docker exec -it crypto_backend /bin/sh
```
> **Ã€ l'intÃ©rieur :**
> - Votre fichier compilÃ© se trouve ici : `/app/app.jar`
> - Les fichiers chiffrÃ©s que l'application gÃ©nÃ¨re se trouvent dans : `/MTDSI`

### Entrer dans le Frontend (Nginx)
```bash
docker exec -it crypto_frontend /bin/sh
```
> **Ã€ l'intÃ©rieur :**
> - Les fichiers React (HTML/CSS/JS) finaux sont dans : `/usr/share/nginx/html`
> - La configuration de Nginx (le routage) est dans : `/etc/nginx/conf.d/default.conf`

### Entrer dans la Base de DonnÃ©es (MySQL)
```bash
docker exec -it crypto_mysql mysql -u root -ppassword
```
> **Ã€ l'intÃ©rieur (Ligne de commande SQL) :**
> - `USE crypto_tdsi_db;` (SÃ©lectionner la base)
> - `SHOW TABLES;` (Voir les tables)
> - `SELECT * FROM users;` (Voir les utilisateurs)
> *(Tapez `exit` pour quitter).*

---

## 5. âš™ï¸� Comment modifier la configuration ?

### A. Modifier les variables d'environnement (Mots de passe, URLs)
Tout est centralisÃ© dans le fichier **`docker-compose.yml`** situÃ© Ã  la racine du projet.
* Pour changer le mot de passe de la base de donnÃ©es, modifiez la ligne `MYSQL_ROOT_PASSWORD` dans la section `mysql` ET `SPRING_DATASOURCE_PASSWORD` dans la section `backend`.
* *N'oubliez pas de redÃ©marrer avec `docker-compose up -d` aprÃ¨s une modification.*

### B. Modifier le routage Nginx (Frontend)
Le fichier qui gÃ¨re les redirections de `/api` vers le backend est : **`frontend/nginx.conf`**.
Si vous modifiez ce fichier, vous devez reconstruire l'image du frontend :
```bash
docker-compose up -d --build frontend
```

### C. Modifier le fichier application.properties (Backend)
Dans Docker, il n'est gÃ©nÃ©ralement pas nÃ©cessaire de modifier directement le fichier `backend/src/main/resources/application.properties`. 
Il est prÃ©fÃ©rable d'**Ã©craser les valeurs directement depuis le fichier `docker-compose.yml`** dans la section `environment` du backend.
Par exemple, pour modifier le port du backend, on ajouterait `- SERVER_PORT=9090` dans le `docker-compose.yml`.

---

## 6. 🧹 Nettoyer le système (En cas de problème grave)

Si Docker se comporte bizarrement ou si vous voulez repartir sur des bases totalement saines (attention, supprime tout le cache Docker et toutes vos images/conteneurs) :
```bash
docker system prune -a --volumes
```

---

## 7. 📊 Monitoring avec Prometheus et Grafana

Le projet inclut désormais un système de monitoring complet.

### Accéder aux outils :
- **Prometheus** (Collecte des métriques) : [http://localhost:9090](http://localhost:9090)
- **Grafana** (Tableaux de bord) : [http://localhost:3000](http://localhost:3000)

### Configurer Grafana la première fois :
1. Allez sur `http://localhost:3000`
2. Identifiant : `admin` / Mot de passe : `admin`
3. Allez dans **Connections > Data sources > Add data source**.
4. Choisissez **Prometheus**.
5. Dans l'URL, mettez `http://prometheus:9090` et sauvegardez.
6. Allez dans **Dashboards > Import** et entrez l'ID `4701` ou `11378` (dashboards Spring Boot populaires) pour avoir un beau tableau de bord instantanément !