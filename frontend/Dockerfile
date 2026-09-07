# Étape 1 : Construction de l'application React/Vite
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : Serveur web Nginx
FROM nginx:alpine
# Copie des fichiers buildés depuis l'étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html
# Remplacement de la configuration Nginx par défaut
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
