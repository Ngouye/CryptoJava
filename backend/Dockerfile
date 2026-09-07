# Étape 1 : Construction (Build) avec Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
# Téléchargement des dépendances (mise en cache si le pom.xml ne change pas)
RUN mvn dependency:go-offline -B
COPY src ./src
# Compilation et packaging de l'application
RUN mvn clean package -DskipTests

# Étape 2 : Exécution (Run) avec OpenJDK
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Répertoire pour les fichiers chiffrés (défini par crypto.storage.directory)
RUN mkdir -p /MTDSI
# Copie du jar généré depuis l'étape de construction
COPY --from=builder /app/target/*.jar app.jar
# Exposition du port
EXPOSE 8080
# Commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"]
