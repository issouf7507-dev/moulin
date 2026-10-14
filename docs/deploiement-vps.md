# Déploiement du site Moulin Sako sur le VPS (GitHub Actions + Nginx)

Même VPS (`168.231.106.21`) et même méthode que GD Gestion, en plus simple : le site est une **SPA Vite
statique**. Pas d'API, pas de base de données, pas de PM2.

| Dépôt GitHub             | Domaine                  | Sur le VPS                                                          |
| ------------------------ | ------------------------ | ------------------------------------------------------------------- |
| `issouf7507-dev/moulin`  | `moulin.marabu.services` | `dist/` copié dans `/home/dev-issouf/apps/moulin/front`, servi par **Nginx** |

**Déclencheur** : un push sur `main` (ou _Actions → Deploy → Run workflow_) lance
`.github/workflows/deploy.yml` : lint, build, puis rsync de `dist/` sur le VPS et vérification que le site
répond 200.

Ce qui tourne déjà sur le VPS n'est pas touché : les noms sont propres au moulin (`apps/moulin`,
`snippets/moulin-headers.conf`).

---

## 1. Préparer le VPS (une seule fois)

### 1.1 Dossier et droits

```bash
# en tant que dev-issouf
mkdir -p ~/apps/moulin/front
chmod o+x /home/dev-issouf /home/dev-issouf/apps /home/dev-issouf/apps/moulin
chmod 755 /home/dev-issouf/apps/moulin/front
sudo -u www-data ls /home/dev-issouf/apps/moulin/front && echo "Nginx OK"
```

### 1.2 DNS

Zone `marabu.services` : un enregistrement **A** `moulin` → `168.231.106.21`.

Vérifier avant certbot : `dig +short moulin.marabu.services` doit renvoyer `168.231.106.21`.

### 1.3 Nginx

Les deux fichiers sont dans le dépôt (`deploy/nginx/`). Depuis ta machine :

```bash
scp deploy/nginx/moulin-headers.conf deploy/nginx/moulin.marabu.services dev-issouf@168.231.106.21:/tmp/
```

Puis sur le VPS :

```bash
sudo mv /tmp/moulin-headers.conf /etc/nginx/snippets/
sudo mv /tmp/moulin.marabu.services /etc/nginx/sites-available/
sudo chown root:root /etc/nginx/snippets/moulin-headers.conf /etc/nginx/sites-available/moulin.marabu.services
sudo ln -s /etc/nginx/sites-available/moulin.marabu.services /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Si le VPS n'a pas d'IPv6, retirer la ligne `listen [::]:80;`. Pare-feu : rien à ouvrir (80 et 443 le sont
déjà).

### 1.4 HTTPS

```bash
sudo certbot --nginx -d moulin.marabu.services
```

---

## 2. Clé SSH de déploiement

Clé dédiée, sans passphrase (le workflow n'en gère pas) :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_moulin -C "ci-deploy-moulin" -N ""
ssh-copy-id -i ~/.ssh/deploy_moulin.pub dev-issouf@168.231.106.21
ssh -i ~/.ssh/deploy_moulin dev-issouf@168.231.106.21 'echo ok'
```

(On peut aussi réutiliser la clé de GD Gest / GD Gestion : même VPS, même utilisateur.)

## 3. Secrets GitHub

_Settings → Secrets and variables → Actions_ du dépôt `issouf7507-dev/moulin`, ou avec `gh` :

```bash
gh secret set SSH_PRIVATE_KEY -R issouf7507-dev/moulin < ~/.ssh/deploy_moulin
gh secret set SSH_HOST -R issouf7507-dev/moulin --body 168.231.106.21
gh secret set SSH_USER -R issouf7507-dev/moulin --body dev-issouf
# seulement si SSH n'est pas sur le port 22 :
gh secret set SSH_PORT -R issouf7507-dev/moulin --body 22
```

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
| `Permission denied (publickey)`                  | clé privée mal collée, ou clé publique absente de `~/.ssh/authorized_keys` de `dev-issouf` |
| `/home/dev-issouf/apps/moulin/front absent`      | section 1.1 pas faite                                                                   |
| « Vérifier que le site répond » échoue           | DNS, Nginx (`sudo nginx -t`) ou HTTPS pas encore en place (1.2 à 1.4)                   |
| Page blanche / 403                               | droits des dossiers (1.1) ou `root` Nginx incorrect                                     |
| Polices ou styles bloqués (console)              | ressource externe non autorisée : compléter `snippets/moulin-headers.conf`              |
| Ancienne version affichée                        | `index.html` en cache : vérifier `Cache-Control: no-cache` sur `/`                      |
