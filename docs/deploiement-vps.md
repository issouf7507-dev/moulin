# Déploiement du site Moulin Sako sur le VPS (GitHub Actions + Nginx)

VPS `168.231.106.21`, utilisateur `admin_marabu`. Même méthode que GD Gestion, en plus simple : le site est une **SPA Vite
statique**. Pas d'API, pas de base de données, pas de PM2.

| Dépôt GitHub             | Domaine                  | Sur le VPS                                                          |
| ------------------------ | ------------------------ | ------------------------------------------------------------------- |
| `issouf7507-dev/moulin`  | `moulin.marabu.services` | `dist/` copié dans `/home/admin_marabu/apps/moulin/front`, servi par **Nginx** |

**Déclencheur** : un push sur `main` (ou _Actions → Deploy → Run workflow_) lance
`.github/workflows/deploy.yml` : lint, build, puis rsync de `dist/` sur le VPS et vérification que le site
répond 200.

Ce qui tourne déjà sur le VPS n'est pas touché : les noms sont propres au moulin (`apps/moulin`,
`snippets/moulin-headers.conf`).

---

## 1. Préparer le VPS (une seule fois)

### 1.1 Dossier et droits

```bash
# en tant que admin_marabu
mkdir -p ~/apps/moulin/front
chmod o+x /home/admin_marabu /home/admin_marabu/apps /home/admin_marabu/apps/moulin
chmod 755 /home/admin_marabu/apps/moulin/front
sudo -u www-data ls /home/admin_marabu/apps/moulin/front && echo "Nginx OK"
```

### 1.2 DNS

Zone `marabu.services` : un enregistrement **A** `moulin` → `168.231.106.21`.

Vérifier avant certbot : `dig +short moulin.marabu.services` doit renvoyer `168.231.106.21`.

### 1.3 Nginx

Deux fichiers (copiés aussi dans le dépôt, `deploy/nginx/`).

**En-têtes de sécurité** : `/etc/nginx/snippets/moulin-headers.conf`

```bash
sudo nano /etc/nginx/snippets/moulin-headers.conf
```

```nginx
# /etc/nginx/snippets/moulin-headers.conf
# Inclus dans chaque location qui sert des fichiers : un add_header dans un location
# annule tous ceux hérités du server.
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
# Scripts : uniquement ceux du site. Styles et polices : le site + Google Fonts (index.html).
# 'unsafe-inline' sur les styles : attributs style de React et animations GSAP.
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;
```

**Site** : `/etc/nginx/sites-available/moulin.marabu.services`

```bash
sudo nano /etc/nginx/sites-available/moulin.marabu.services
```

```nginx
# /etc/nginx/sites-available/moulin.marabu.services
# Version HTTP : certbot --nginx ajoute ensuite le bloc 443 et la redirection.
server {
    listen 80;
    listen [::]:80;
    server_name moulin.marabu.services;

    root /home/admin_marabu/apps/moulin/front;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    # Fichiers cachés (.git, .env…) : jamais servis. .well-known reste accessible pour certbot.
    location ~ /\.(?!well-known/) {
        deny all;
    }

    # Assets Vite (nom avec hash) : cache long
    location /assets/ {
        include snippets/moulin-headers.conf;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        try_files $uri =404;
    }

    # Le reste (index.html, favicon…) : jamais mis en cache
    location / {
        include snippets/moulin-headers.conf;
        add_header Cache-Control "no-cache" always;
        try_files $uri $uri/ /index.html;
    }
}
```

⚠️ Piège Nginx : un `add_header` dans un `location` **annule** tous ceux hérités du `server`. D'où le
snippet inclus dans chaque `location`.

**Activer le site** :

```bash
sudo ln -s /etc/nginx/sites-available/moulin.marabu.services /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

- Erreur sur `[::]:80` → le VPS n'a pas d'IPv6 : retirer la ligne `listen [::]:80;`.
- Erreur `"gzip" directive is duplicate` → gzip est déjà réglé dans `nginx.conf` : retirer les deux lignes
  `gzip` du site.
- Pare-feu : rien à ouvrir (80 et 443 le sont déjà).

### 1.4 HTTPS

```bash
sudo certbot --nginx -d moulin.marabu.services
```

---

## 2. Clé SSH de déploiement

Clé dédiée (avec ou sans passphrase : voir `SSH_PASSPHRASE`, section 3) :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_moulin -C "ci-deploy-moulin" -N ""
ssh-copy-id -i ~/.ssh/deploy_moulin.pub admin_marabu@168.231.106.21
ssh -i ~/.ssh/deploy_moulin admin_marabu@168.231.106.21 'echo ok'
```

Une clé déjà autorisée pour `admin_marabu` sur ce VPS peut aussi servir.

## 3. Secrets GitHub

_Settings → Secrets and variables → Actions_ du dépôt `issouf7507-dev/moulin`, ou avec `gh` :

```bash
gh secret set SSH_PRIVATE_KEY -R issouf7507-dev/moulin < ~/.ssh/deploy_moulin
gh secret set SSH_HOST -R issouf7507-dev/moulin --body 168.231.106.21
gh secret set SSH_USER -R issouf7507-dev/moulin --body admin_marabu
# seulement si SSH n'est pas sur le port 22 :
gh secret set SSH_PORT -R issouf7507-dev/moulin --body 22
# seulement si la clé a une passphrase (saisie masquée) :
gh secret set SSH_PASSPHRASE -R issouf7507-dev/moulin
```

| Secret            | Valeur                                                               |
| ----------------- | -------------------------------------------------------------------- |
| `SSH_PRIVATE_KEY` | contenu complet de la clé **privée** (lignes `BEGIN`/`END` incluses) |
| `SSH_HOST`        | `168.231.106.21`                                                     |
| `SSH_USER`        | `admin_marabu`                                                       |
| `SSH_PORT`        | port SSH (`22` par défaut ; facultatif)                              |
| `SSH_PASSPHRASE`  | facultatif, seulement si la clé a une passphrase                     |

---

## 4. Premier déploiement

1. VPS prêt : sections 1.1 à 1.4.
2. Secrets GitHub (section 3).
3. Push sur `main` → **Deploy**.
4. Vérifier :

```bash
curl -sI https://moulin.marabu.services | grep -iE 'HTTP/|strict-transport|content-security'
```

Puis ouvrir le site et regarder la console du navigateur : aucune erreur `Content-Security-Policy`.

**Revenir en arrière** : `git revert` du commit fautif sur `main` puis push.

## 5. Dépannage

| Symptôme                                         | Cause probable                                                                          |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `Clé SSH refusée` (étape Préparer SSH)           | `SSH_PASSPHRASE` absente ou fausse pour une clé protégée                                |
| `Permission denied (publickey)`                  | clé privée mal collée, ou clé publique absente de `~/.ssh/authorized_keys` de `admin_marabu` |
| `/home/admin_marabu/apps/moulin/front absent`      | section 1.1 pas faite                                                                   |
| « Vérifier que le site répond » échoue           | DNS, Nginx (`sudo nginx -t`) ou HTTPS pas encore en place (1.2 à 1.4)                   |
| Page blanche / 403                               | droits des dossiers (1.1) ou `root` Nginx incorrect                                     |
| Polices ou styles bloqués (console)              | ressource externe non autorisée : compléter `snippets/moulin-headers.conf`              |
| Ancienne version affichée                        | `index.html` en cache : vérifier `Cache-Control: no-cache` sur `/`                      |
