#!/bin/bash

# Paramètres par défaut du conteneur
export VITE_APP_ROOT_API=${VITE_APP_ROOT_API:='https://acces.licencesnationales.fr/v1/api/'}
export VITE_APP_RECAPTCHA_KEY_SITE=${VITE_APP_RECAPTCHA_KEY_SITE:='6LcjHroaAAAAAOhO6sd_1ooz5LfcyRPoYirqxsFt'}
export VITE_APP_VERSION=${VITE_APP_VERSION:='front'}
export =${VITE_ENV:='production'}


# Remplace les placeholders dans le code généré en prod
# LN_PLACEHOLDER_VUE_APP_RECAPTCHA_KEY_SITE
# LN_PLACEHOLDER_VUE_APP_ROOT_API
# LN_PLACEHOLDER_VERSION
# LN_PLACEHOLDER_ENV
# On va remplacer les placeholders depuis les JS originales
echo "-> Remplacement des placeholders venant du .env de vuejs dans la destination /usr/share/nginx/html/"
echo "-> VITE_APP_ROOT_API=${VITE_APP_ROOT_API}"
echo "-> VITE_APP_RECAPTCHA_KEY_SITE=${VITE_APP_RECAPTCHA_KEY_SITE}"
echo "-> VITE_APP_VERSION=${VITE_APP_VERSION}"
echo "-> VITE_ENV=${VITE_ENV}"
rm -rf /usr/share/nginx/html/
cp -rf /usr/share/nginx/html.orig/ /usr/share/nginx/html/
sed -i "s#LN_PLACEHOLDER_VUE_APP_ROOT_API#${VITE_APP_ROOT_API}#g" /usr/share/nginx/html/assets/*
sed -i "s#LN_PLACEHOLDER_VUE_APP_RECAPTCHA_KEY_SITE#${VITE_APP_RECAPTCHA_KEY_SITE}#g" /usr/share/nginx/html/assets/*
sed -i "s#LN_PLACEHOLDER_VERSION#${VITE_APP_VERSION}#g" /usr/share/nginx/html/assets/*
sed -i "s#LN_PLACEHOLDER_ENV#${VITE_ENV}#g" /usr/share/nginx/html/assets/*



# execute nginx (cf CMD dans Dockerfile)
exec "$@"
