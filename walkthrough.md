# 📊 Walkthrough: Système de Monitoring (Prometheus & Grafana)

Félicitations, votre application intègre désormais une architecture de monitoring de niveau professionnel ! 🚀

Voici un résumé des modifications effectuées :

## 1. 🛠️ Backend Spring Boot préparé
- **Actuator & Micrometer** : Les dépendances ont été ajoutées au fichier `pom.xml`.
- **Configuration** : Les routes de management (`/actuator/prometheus`) ont été exposées dans `application.properties` et autorisées publiquement dans `SecurityConfig.java`.

## 2. 🗄️ Orchestration Docker
- **Prometheus** : Ajouté au `docker-compose.yml`. Il contacte le backend toutes les 15 secondes pour récupérer l'utilisation de la RAM, du CPU, et les statistiques de la base de données.
- **Grafana** : Ajouté au `docker-compose.yml` pour fournir une interface graphique époustouflante de ces statistiques.

## 3. 🚀 Comment tester ?

Pour appliquer toutes ces nouveautés, exécutez la commande suivante dans votre terminal (à la racine du projet) :

```bash
docker-compose up -d --build
```

### Étape 1 : Vérifier que tout fonctionne
Allez sur [http://localhost:8080/actuator/prometheus](http://localhost:8080/actuator/prometheus). Vous devriez voir une page blanche remplie de lignes de texte brut (ce sont les données pour Prometheus).

### Étape 2 : Configurer Grafana (Interface graphique)
1. Allez sur [http://localhost:3000](http://localhost:3000)
2. Connectez-vous avec `admin` / `admin`. (Il vous demandera de changer le mot de passe).
3. Dans le menu à gauche, allez dans **Connections** -> **Data Sources** -> **Add data source**.
4. Sélectionnez **Prometheus**.
5. Dans le champ URL, écrivez exactement : `http://prometheus:9090`
6. Descendez tout en bas et cliquez sur **Save & Test**. (Un bandeau vert devrait confirmer que ça marche).

### Étape 3 : Importer un superbe tableau de bord
1. Dans le menu à gauche, allez dans **Dashboards** (l'icône avec 4 carrés).
2. Cliquez sur le bouton **New** puis **Import**.
3. Dans la case "*Import via grafana.com*", entrez le numéro **`4701`** (ou `11378`) et cliquez sur *Load*.
4. Tout en bas, sélectionnez votre source de données "Prometheus" et validez.
5. **BOUM !** Vous avez maintenant un tableau de bord en temps réel de votre backend (Mémoire, Threads, CPU, etc.) ! 🎉
