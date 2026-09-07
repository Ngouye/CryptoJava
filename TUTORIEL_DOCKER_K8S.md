# 🐳 Tutoriel Complet : Conteneurisation (Docker) et Orchestration (Kubernetes)

Ce document explique en détail comment l'application "ProjectCryptoJava" a été conteneurisée avec Docker, orchestrée localement avec Docker Compose, et préparée pour le déploiement en production avec Kubernetes.

---

## 🐋 Partie 1 : Conteneurisation avec Docker

La conteneurisation permet d'emballer notre code avec tout son environnement (Java, Node.js, Nginx) pour garantir qu'il s'exécute de la même manière partout. Nous utilisons des builds **Multi-Stage** (en plusieurs étapes) pour garder nos images Docker très légères et sécurisées.

### 1.1 Le Backend (Spring Boot)
Le fichier `backend/Dockerfile` est responsable de la création de l'image du serveur Java.

**Le code du `Dockerfile` :**
```dockerfile
# Étape 1 : Construction (Builder)
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Exécution (Runtime)
FROM eclipse-temurin:17-jre
WORKDIR /app
# Création du dossier requis par l'application
RUN mkdir -p /MTDSI 
# Récupération du .jar depuis l'étape 1
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```
*💡 **Explication** : L'étape 1 utilise une image lourde contenant Maven pour compiler le code. L'étape 2 prend uniquement le fichier `.jar` généré et le met dans une image Java légère. Cela évite d'avoir le code source et Maven dans l'image finale de production.*

### 1.2 Le Frontend (React)
Le fichier `frontend/Dockerfile` suit la même logique : compiler le JavaScript, puis le servir avec Nginx.

**Le code du `Dockerfile` :**
```dockerfile
# Étape 1 : Construction (Builder)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur Web (Nginx)
FROM nginx:alpine
# Copie la configuration personnalisée (Proxy vers le backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copie les fichiers compilés de React
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
*💡 **Explication** : Le code React est compilé en simples fichiers HTML/JS/CSS statiques. L'image finale ne contient que le serveur web Nginx qui va distribuer ces fichiers au navigateur de l'utilisateur.*

---

## 🐙 Partie 2 : Orchestration Locale avec Docker Compose

Pour le développement local, `docker-compose.yml` permet de lancer l'ensemble de l'architecture (Frontend, Backend, BDD, Monitoring) avec **une seule commande**.

**Aperçu de l'architecture dans `docker-compose.yml` :**
- **mysql** : Lance une base de données MySQL 8.0. Un `volume` permet de ne pas perdre les données si le conteneur s'arrête.
- **backend** : Construit l'image depuis `backend/Dockerfile`. Il attend que `mysql` soit prêt (`depends_on`). Il reçoit l'URL de connexion à la base via les variables d'environnement. Un `volume` relie le dossier de votre ordinateur au dossier `/MTDSI` du conteneur.
- **frontend** : Construit l'image depuis `frontend/Dockerfile`. Il expose le port 80.
- **prometheus / grafana** : (Voir `TUTORIEL_MONITORING.md`).

**Commandes utiles :**
- `docker-compose up -d --build` : Construit les images et lance tout en arrière-plan.
- `docker-compose down` : Arrête et supprime tous les conteneurs du projet.
- `docker logs crypto_backend` : Affiche les logs en direct du backend.

---

## ☸️ Partie 3 : Déploiement en Production avec Kubernetes (K8s)

Kubernetes est conçu pour la haute disponibilité en production (sur le cloud : AWS, GCP, OVH). Les fichiers se trouvent dans le dossier `k8s/`.

Dans Kubernetes, nous définissons des **Deployments** (pour gérer les conteneurs/Pods) et des **Services** (pour gérer le réseau).

### 3.1 La Base de Données (MySQL)
- **`mysql-secret.yaml`** : Stocke le mot de passe root de manière sécurisée (encodé en Base64).
- **`mysql-pvc.yaml`** : Demande un espace de stockage persistant de 5 Go au Cloud Provider pour les données MySQL.
- **`mysql-deployment.yaml`** : Gère le Pod MySQL. Il s'assure qu'il y a toujours 1 instance en cours d'exécution. Il attache le stockage persistant et lit le mot de passe depuis le `Secret`.
- **`mysql-service.yaml`** : Crée un nom de domaine interne (`mysql-service`) pour que le backend puisse trouver la base de données.

### 3.2 Le Backend (Spring Boot)
**Le fichier `backend-deployment.yaml` :**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
spec:
  replicas: 2 # 🚀 Fait tourner 2 instances du backend en parallèle (Load Balancing)
  selector:
    matchLabels:
      app: backend
  template:
    # ... configuration du pod ...
        env:
        - name: SPRING_DATASOURCE_URL
          value: "jdbc:mysql://mysql-service:3306/crypto_tdsi_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: mysql-root-password
```
*💡 **Explication** : En production, on lance `replicas: 2` (ou plus) instances du backend. Si un serveur plante, l'autre prend le relais immédiatement. L'URL de la base de données pointe vers le nom du Service K8s : `mysql-service`.*

### 3.3 Le Frontend (React + Nginx)
- **`frontend-deployment.yaml`** : Lance les conteneurs Nginx (ici aussi `replicas: 2`).
- **`frontend-service.yaml`** : 
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: LoadBalancer # 🌍 Ouvre l'application sur Internet !
  ports:
    - port: 80
      targetPort: 80
  selector:
    app: frontend
```
*💡 **Explication** : Le type `LoadBalancer` dit au fournisseur Cloud de créer une vraie adresse IP publique. C'est cette IP que vous donnerez à vos utilisateurs pour accéder à l'application.*

### 3.4 Les Commandes de Déploiement Kubernetes
Si vous disposez d'un cluster Kubernetes (Minikube ou Cloud), voici les commandes pour tout déployer :

1. **Créer le Secret et le Stockage :**
   ```bash
   kubectl apply -f k8s/mysql-secret.yaml
   kubectl apply -f k8s/mysql-pvc.yaml
   ```
2. **Déployer la Base de Données :**
   ```bash
   kubectl apply -f k8s/mysql-deployment.yaml
   kubectl apply -f k8s/mysql-service.yaml
   ```
3. **Déployer le Backend :**
   ```bash
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/backend-service.yaml
   ```
4. **Déployer le Frontend :**
   ```bash
   kubectl apply -f k8s/frontend-deployment.yaml
   kubectl apply -f k8s/frontend-service.yaml
   ```
5. **Vérifier l'état de l'application :**
   ```bash
   kubectl get pods
   kubectl get services
   ```
*(L'adresse IP publique apparaîtra sous la colonne "EXTERNAL-IP" du `frontend-service`).*
