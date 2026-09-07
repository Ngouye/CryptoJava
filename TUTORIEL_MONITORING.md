# 📊 Tutoriel Complet : Intégration de Prometheus et Grafana

Ce document explique étape par étape comment nous avons intégré un système de monitoring professionnel (Prometheus + Grafana) dans l'application Spring Boot existante.

---

## 🏗️ Étape 1 : Préparer le Backend Java (Spring Boot)

Pour que Prometheus puisse lire les statistiques de l'application (mémoire, CPU, requêtes), nous devons exposer ces métriques. Nous utilisons **Spring Boot Actuator** et **Micrometer**.

### 1.1 Ajouter les dépendances dans `pom.xml`
Ouvrez le fichier `backend/pom.xml` et ajoutez ces deux dépendances dans la balise `<dependencies>` :

```xml
<!-- Expose les points de terminaison de monitoring (santé, infos) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Formate les métriques au format lisible par Prometheus -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

### 1.2 Configurer l'application (`application.properties`)
Ouvrez le fichier `backend/src/main/resources/application.properties` et ajoutez ces lignes à la fin :

```properties
# --------------------------------------------------------------------
# Actuator / Prometheus Monitoring
# --------------------------------------------------------------------
# Active les routes web pour health, info et prometheus
management.endpoints.web.exposure.include=health,info,prometheus

# Autorise spécifiquement le scraping de Prometheus
management.endpoint.prometheus.enabled=true

# (TRÈS IMPORTANT) Ajoute le tag "application" à toutes les métriques. 
# Requis par de nombreux tableaux de bord Grafana.
management.metrics.tags.application=${spring.application.name}
```

### 1.3 Autoriser l'accès dans Spring Security
Puisque le projet utilise JWT, l'accès à la route `/actuator/prometheus` sera bloqué par défaut (Erreur 403 ou 401). 
Ouvrez `backend/src/main/java/sn/ucad/tdsi/crypto/config/SecurityConfig.java` et autorisez cette route :

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // ... autres configurations (cors, csrf) ...
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            // AJOUTER CETTE LIGNE : Autorise Prometheus à lire les métriques
            .requestMatchers("/actuator/**").permitAll() 
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        // ... suite du code ...
```

---

## ⚙️ Étape 2 : Configurer Prometheus

Prometheus a besoin d'un fichier de configuration pour savoir *qui* surveiller (dans notre cas, le backend).

Créez un fichier nommé `prometheus.yml` à la racine du projet (au même niveau que `docker-compose.yml`) avec ce contenu :

```yaml
global:
  scrape_interval: 15s      # Fréquence de récupération des métriques
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'spring-boot-backend'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['backend:8080'] # Pointe vers le conteneur backend dans le réseau Docker
```

---

## 🐳 Étape 3 : Orchestration avec Docker Compose

Il faut maintenant dire à Docker de lancer les conteneurs Prometheus et Grafana en même temps que le backend et la base de données.

Ouvrez le fichier `docker-compose.yml` et ajoutez ces deux services tout en bas :

```yaml
  prometheus:
    image: prom/prometheus:latest
    container_name: crypto_prometheus
    ports:
      - "9090:9090"
    volumes:
      # Injecte notre configuration dans le conteneur
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    depends_on:
      - backend

  grafana:
    image: grafana/grafana:latest
    container_name: crypto_grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
```

---

## 🚀 Étape 4 : Déploiement et Lancement

Une fois le code et la configuration modifiés, il faut recompiler l'application et relancer les conteneurs Docker.

Ouvrez votre terminal (PowerShell ou Bash) à la racine du projet et tapez la commande suivante :

```bash
docker-compose up -d --build
```

**Ce que fait cette commande :**
1. `--build` force Maven à recompiler le `.jar` du backend (qui inclut maintenant Actuator).
2. Construit l'image Docker du backend.
3. Télécharge les images officielles de Prometheus et Grafana.
4. Lance tous les conteneurs en arrière-plan (`-d`).

---

## 📈 Étape 5 : Configuration Finale dans l'Interface Graphique

Maintenant que tout tourne, il faut relier Grafana à Prometheus et afficher les graphiques.

### 5.1 Ajouter la source de données
1. Ouvrez **http://localhost:3000** dans le navigateur.
2. Identifiants par défaut : **admin** / **admin**.
3. Allez dans *Connections* -> *Data sources* -> *Add data source*.
4. Sélectionnez **Prometheus**.
5. Dans l'URL, écrivez : `http://prometheus:9090` *(C'est le nom du conteneur sur le réseau Docker)*.
6. Cliquez sur **Save & Test**.

### 5.2 Importer le tableau de bord
1. Allez dans le menu *Dashboards* -> *New* -> *Import*.
2. Tapez l'identifiant **`11378`** (ou `4701`) et cliquez sur **Load**.
3. En bas, dans le menu déroulant "Prometheus", sélectionnez la source de données créée à l'étape précédente.
4. Cliquez sur **Import**.

### 5.3 Simuler du trafic
Pour voir les graphiques de requêtes HTTP s'activer, ouvrez votre frontend React sur **http://localhost**, connectez-vous, et naviguez dans l'application. Retournez sur Grafana, et les graphiques de la section "I/O Overview" (Entrées/Sorties) vont monter en flèche !

---
🎉 **Terminé ! L'application est maintenant supervisée de bout en bout de manière professionnelle.**
