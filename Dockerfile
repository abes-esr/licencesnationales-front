# Phase de compilation de l'appli vuejs
FROM node:25.2.1 AS build-image
WORKDIR /build
# Copie des fichiers de l'application
COPY . .
# Installation des dépendances
RUN npm ci
# Compilation de l'application
RUN npm run build
# Suppression des dépendances de développement pour alléger l'image finale
RUN npm prune --omit=dev

# Serveur web (nginx) pour exec l'appli vuejs
FROM nginx:1.29.4 AS front-image
COPY --from=build-image /build/dist/ /usr/share/nginx/html.orig/
# Copie de la configuration personnalisée
COPY ./docker/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/docker-entrypoint.sh /docker-entrypoint.sh

# Exécution de l'application
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
