# Utilisez l'image Debian comme base
FROM debian:bullseye-slim

# Mise à jour des paquets
RUN apt-get update && apt-get upgrade -y && apt-get install -y curl

# Supprimer les anciennes installations de Node.js et npm
RUN apt-get remove --purge -y nodejs npm && apt-get autoremove -y

# Installer les dépendances nécessaires
RUN apt-get install -y nodejs libnode72

# Installation de Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs


# Nettoyage du cache APT pour réduire la taille de l'image
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /fastburger

# Copier les fichiers de l'application
COPY . /fastburger

# Exposer le port nécessaire pour votre application Node.js
EXPOSE 3000

# Commande par défaut pour démarrer votre application
CMD ["npm", "start"]
