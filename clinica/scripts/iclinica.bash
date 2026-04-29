#!/usr/bin/env bash
# =========================================================
# ICLINICA
# Despliegue standalone del modulo clinica usando medico-portal
# Ajustado al layout real del repo y al flujo de build reproducible
# =========================================================
set -Eeuo pipefail

REPO_URL="https://github.com/galz35/medico-portal.git"
REPO_BRANCH="main"
APP_DIR="/opt/apps/medico-portal"
WEB_ROOT="/var/www"
DOMINIO="rhclaroni.com"
MODO="${1:-update}"   # fresh | update

NGINX_MAIN_FILE="/etc/nginx/sites-available/planer"
NGINX_SNIPPET="/etc/nginx/snippets/medico_portal_routes.conf"

MOD_NOMBRE="clinica"
MOD_WEB_DIR_NAME="portal-clinica"
MOD_BASE_PUBLICA="/portal/clinica/"
MOD_API_PUBLICA="https://$DOMINIO/api-portal-clinica"
MOD_API_PATH="/api-portal-clinica/"
MOD_PM2_NAME="portal-clinica-api"
MOD_PORT="3022"

URL_PORTAL="https://$DOMINIO/portal"
URL_CLINICA="https://$DOMINIO/portal/clinica"
API_PUBLIC_PORTAL="https://$DOMINIO/api-portal"

JWT_SECRET='fnS8JHYuYjgyKZzHDXvfzwmK0LVcE0S3jq6HFB14wu/rG+In7Lmv24K4KndjDoyRPZLKhPn7j9PAkk/rcWZq7w=='
COOKIE_SECRET_CLINICA='clinica-dev-secret-2026'

MSSQL_HOST="${MSSQL_HOST:-localhost}"
MSSQL_PORT="${MSSQL_PORT:-1433}"
MSSQL_USER="${MSSQL_USER:-sa}"
MSSQL_PASSWORD="${MSSQL_PASSWORD:-TuPasswordFuerte!2026}"
MSSQL_ENCRYPT="${MSSQL_ENCRYPT:-false}"
MSSQL_TRUST_CERT="${MSSQL_TRUST_CERT:-true}"
DB_CLINICA="${DB_CLINICA:-medicoBD}"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT_SSL="465"
SMTP_USER="rrrhh1930@gmail.com"
SMTP_PASSWORD='cqvekscikoptijvq'

MOD_FRONTEND_REL=""
MOD_BACKEND_REL="clinica/api-nest"
MOD_FRONTEND_BUILD_KIND=""

log() {
  echo
  echo "===================================================="
  echo "$1"
  echo "===================================================="
}

fail() {
  echo
  echo "ERROR: $1"
  exit 1
}

validar_comando() {
  command -v "$1" >/dev/null 2>&1 || fail "Falta comando: $1"
}

validar_directorio() {
  [ -d "$1" ] || fail "No existe carpeta: $1"
}

validar_archivo() {
  [ -f "$1" ] || fail "No existe archivo: $1"
}

validar_modo() {
  case "$MODO" in
    fresh|update) ;;
    *)
      fail "Modo invalido: $MODO. Usa 'fresh' o 'update'."
      ;;
  esac
}

ruta_segura_para_borrado() {
  case "$1" in
    /opt/apps/*) ;;
    *)
      fail "Ruta insegura para borrado: $1"
      ;;
  esac
}

backup_nginx() {
  sudo mkdir -p /root/backup_chatgpt_nginx
  sudo cp -a /etc/nginx "/root/backup_chatgpt_nginx/nginx_$(date +%F_%H%M%S)"
}

prechecks() {
  log "PRECHECKS"
  validar_modo
  validar_comando git
  validar_comando node
  validar_comando npm
  validar_comando pm2
  validar_comando nginx
  validar_comando sudo
  validar_comando grep
  validar_comando sed
  validar_comando awk
  validar_comando curl
  sudo mkdir -p "$WEB_ROOT"
  sudo mkdir -p /etc/nginx/snippets
  validar_archivo "$NGINX_MAIN_FILE"
  pm2 status || true
  sudo nginx -t
}

repo_tiene_cambios_trackeados() {
  cd "$APP_DIR"
  git update-index -q --refresh || true
  [ -n "$(git status --porcelain --untracked-files=no)" ]
}

preparar_repo() {
  log "PREPARANDO REPO"

  if [ "$MODO" = "fresh" ]; then
    ruta_segura_para_borrado "$APP_DIR"
    sudo rm -rf "$APP_DIR"
  fi

  if [ ! -d "$APP_DIR/.git" ]; then
    sudo mkdir -p "$(dirname "$APP_DIR")"
    sudo git clone -b "$REPO_BRANCH" "$REPO_URL" "$APP_DIR"
    sudo chown -R "$USER":"$USER" "$APP_DIR"
  else
    sudo chown -R "$USER":"$USER" "$APP_DIR"
    cd "$APP_DIR"

    if repo_tiene_cambios_trackeados; then
      git status --short --untracked-files=no || true
      fail "El repo en $APP_DIR tiene cambios trackeados. Limpialos manualmente o ejecuta '$0 fresh'."
    fi

    git fetch origin "$REPO_BRANCH"
    git checkout "$REPO_BRANCH"
    git pull --ff-only origin "$REPO_BRANCH"
  fi
}

resolver_layout_repo() {
  log "RESOLVIENDO LAYOUT DEL REPO"

  if [ -f "$APP_DIR/web/package.json" ]; then
    MOD_FRONTEND_REL="web"
  elif [ -f "$APP_DIR/clinica/web/package.json" ]; then
    MOD_FRONTEND_REL="clinica/web"
  else
    fail "No encontre frontend buildable en '$APP_DIR/web' ni '$APP_DIR/clinica/web'."
  fi

  validar_archivo "$APP_DIR/$MOD_BACKEND_REL/package.json"

  if [ -f "$APP_DIR/$MOD_FRONTEND_REL/vite.config.ts" ] || [ -f "$APP_DIR/$MOD_FRONTEND_REL/vite.config.js" ]; then
    MOD_FRONTEND_BUILD_KIND="vite"
  else
    MOD_FRONTEND_BUILD_KIND="npm-script"
  fi

  echo "Frontend detectado: $MOD_FRONTEND_REL ($MOD_FRONTEND_BUILD_KIND)"
  echo "Backend detectado: $MOD_BACKEND_REL"
}

instalar_dependencias() {
  local dir="$1"

  cd "$dir"

  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install --legacy-peer-deps
  fi
}

remediar_index_publicado() {
  local web_dir="$1"
  local index_file="$web_dir/index.html"

  if [ -f "$index_file" ] && [ ! -f "$web_dir/vite.svg" ]; then
    sudo sed -i '/href="\/vite\.svg"/d' "$index_file"
  fi
}

esperar_http_200() {
  local url="$1"
  shift
  local code=""
  local intento

  for intento in $(seq 1 30); do
    code="$(curl "$@" -sS -o /dev/null -w '%{http_code}' "$url" || true)"
    if [ "$code" = "200" ]; then
      printf '%s' "$code"
      return 0
    fi
    sleep 1
  done

  printf '%s' "$code"
  return 1
}

build_frontend() {
  local frontend_dir="$APP_DIR/$MOD_FRONTEND_REL"
  local web_dir="$WEB_ROOT/$MOD_WEB_DIR_NAME"

  validar_directorio "$frontend_dir"
  validar_archivo "$frontend_dir/package.json"

  log "FRONTEND: $MOD_NOMBRE"
  instalar_dependencias "$frontend_dir"

  cd "$frontend_dir"
  rm -rf dist

  if [ "$MOD_FRONTEND_BUILD_KIND" = "vite" ]; then
    validar_archivo "$frontend_dir/node_modules/vite/bin/vite.js"
    VITE_APP_BASE="$MOD_BASE_PUBLICA" \
    VITE_BASE_PATH="$MOD_BASE_PUBLICA" \
    VITE_API_URL="$MOD_API_PUBLICA" \
    VITE_PORTAL_API_URL="$API_PUBLIC_PORTAL" \
    VITE_PORTAL_URL="$URL_PORTAL" \
    VITE_PUBLIC_URL="https://$DOMINIO" \
    node node_modules/vite/bin/vite.js build --mode production
  else
    VITE_APP_BASE="$MOD_BASE_PUBLICA" \
    VITE_BASE_PATH="$MOD_BASE_PUBLICA" \
    VITE_API_URL="$MOD_API_PUBLICA" \
    VITE_PORTAL_API_URL="$API_PUBLIC_PORTAL" \
    VITE_PORTAL_URL="$URL_PORTAL" \
    VITE_PUBLIC_URL="https://$DOMINIO" \
    npm run build
  fi

  validar_archivo "$frontend_dir/dist/index.html"

  sudo mkdir -p "$web_dir"
  sudo rm -rf "${web_dir:?}"/*
  sudo cp -a "$frontend_dir/dist"/. "$web_dir"/
  remediar_index_publicado "$web_dir"
  sudo chown -R www-data:www-data "$web_dir"
}

exportar_env_backend() {
  export NODE_ENV="production"
  export DB_TYPE="mssql"
  export MSSQL_HOST="$MSSQL_HOST"
  export MSSQL_PORT="$MSSQL_PORT"
  export MSSQL_USER="$MSSQL_USER"
  export MSSQL_PASSWORD="$MSSQL_PASSWORD"
  export MSSQL_DATABASE="$DB_CLINICA"
  export MSSQL_ENCRYPT="$MSSQL_ENCRYPT"
  export MSSQL_TRUST_CERT="$MSSQL_TRUST_CERT"
  export JWT_SECRET="$JWT_SECRET"
  export COOKIE_SECRET="$COOKIE_SECRET_CLINICA"
  export PORT="$MOD_PORT"
  export PORTAL_API_URL="$API_PUBLIC_PORTAL"
  export CORS_ORIGIN="https://$DOMINIO"
  export MAIL_HOST="$SMTP_HOST"
  export MAIL_PORT="$SMTP_PORT_SSL"
  export MAIL_USER="$SMTP_USER"
  export MAIL_PASSWORD="$SMTP_PASSWORD"
  export MAIL_FROM="Clinica Claroni <${SMTP_USER}>"
}

build_backend() {
  local backend_dir="$APP_DIR/$MOD_BACKEND_REL"
  local entry=""

  validar_directorio "$backend_dir"
  validar_archivo "$backend_dir/package.json"

  log "BACKEND: $MOD_NOMBRE"
  instalar_dependencias "$backend_dir"

  cd "$backend_dir"
  npm run build

  if [ -f "dist/main.js" ]; then
    entry="dist/main.js"
  elif [ -f "dist/src/main.js" ]; then
    entry="dist/src/main.js"
  else
    fail "No encontre entrypoint en $backend_dir"
  fi

  exportar_env_backend

  if pm2 describe "$MOD_PM2_NAME" >/dev/null 2>&1; then
    pm2 restart "$MOD_PM2_NAME" --update-env
  else
    pm2 start "$entry" --name "$MOD_PM2_NAME" --cwd "$backend_dir"
  fi
}

snippet_modulo() {
  local local_front_path="$WEB_ROOT/$MOD_WEB_DIR_NAME"

  cat <<SNIPPETEOF
# ---------- $MOD_NOMBRE ----------
location = ${MOD_BASE_PUBLICA%/} {
    return 301 ${MOD_BASE_PUBLICA};
}

location = ${MOD_API_PATH%/} {
    return 301 ${MOD_API_PATH};
}

location $MOD_BASE_PUBLICA {
    alias $local_front_path/;
    index index.html;
    try_files \$uri \$uri/ ${MOD_BASE_PUBLICA}index.html;
}

location $MOD_API_PATH {
    proxy_pass http://127.0.0.1:$MOD_PORT/;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
}
SNIPPETEOF
}

generar_snippet_nginx() {
  log "GENERANDO SNIPPET NGINX"

  sudo touch "$NGINX_SNIPPET"
  sudo chmod 644 "$NGINX_SNIPPET"

  local bloque
  bloque="$(snippet_modulo)"

  if sudo grep -Fq "# ---------- $MOD_NOMBRE ----------" "$NGINX_SNIPPET"; then
    local tmpfile
    tmpfile="$(mktemp)"
    sudo awk -v start="# ---------- $MOD_NOMBRE ----------" '
      BEGIN {skip=0}
      index($0, start)==1 {skip=1; next}
      skip && index($0, "# ---------- ")==1 {skip=0}
      !skip {print}
    ' "$NGINX_SNIPPET" > "$tmpfile"
    sudo mv "$tmpfile" "$NGINX_SNIPPET"
  fi

  printf '%s\n' "$bloque" | sudo tee -a "$NGINX_SNIPPET" >/dev/null
}

agregar_include_nginx() {
  log "AGREGANDO INCLUDE A NGINX"

  if sudo grep -q "include $NGINX_SNIPPET;" "$NGINX_MAIN_FILE"; then
    echo "El include ya existia en $NGINX_MAIN_FILE"
    return 0
  fi

  local tmpfile
  tmpfile="$(mktemp)"

  sudo cp "$NGINX_MAIN_FILE" "${NGINX_MAIN_FILE}.bak_$(date +%F_%H%M%S)"
  sudo awk -v include_line="  include $NGINX_SNIPPET;" '
    BEGIN {
      in_server = 0
      matched_server = 0
      matched_https = 0
      inserted = 0
    }
    /^[[:space:]]*server[[:space:]]*\{/ {
      in_server = 1
      matched_server = 0
      matched_https = 0
    }
    {
      if (in_server && $0 ~ /^[[:space:]]*listen[[:space:]]+443[[:space:]]+ssl[[:space:]]+http2;/) {
        matched_https = 1
      }
      if (in_server && $0 ~ /^[[:space:]]*server_name[[:space:]]+rhclaroni\.com;/) {
        matched_server = 1
      }

      print

      if (!inserted && in_server && matched_server && matched_https && $0 ~ /^[[:space:]]*index[[:space:]]+index\.html;/) {
        print include_line
        inserted = 1
      }

      if (in_server && $0 ~ /^[[:space:]]*}/) {
        in_server = 0
        matched_server = 0
        matched_https = 0
      }
    }
    END {
      if (!inserted) {
        exit 1
      }
    }
  ' "$NGINX_MAIN_FILE" > "$tmpfile" || {
    rm -f "$tmpfile"
    fail "No pude insertar el include de Nginx de forma segura en $NGINX_MAIN_FILE"
  }

  sudo mv "$tmpfile" "$NGINX_MAIN_FILE"
}

validar_final() {
  log "VALIDACION FINAL"

  local api_local_status=""
  local api_public_status=""
  local front_public_status=""

  exportar_env_backend
  pm2 save
  sudo nginx -t
  sudo systemctl reload nginx
  pm2 status "$MOD_PM2_NAME" || true

  api_local_status="$(esperar_http_200 "http://127.0.0.1:$MOD_PORT/docs" || true)"
  api_public_status="$(esperar_http_200 "https://127.0.0.1${MOD_API_PATH}docs" -k -H "Host: $DOMINIO" || true)"
  front_public_status="$(esperar_http_200 "https://127.0.0.1${MOD_BASE_PUBLICA}" -k -H "Host: $DOMINIO" || true)"

  echo
  echo "API local /docs: $api_local_status"
  echo "API publica /docs: $api_public_status"
  echo "Frontend publico: $front_public_status"
  echo "Frontend: $URL_CLINICA"
  echo "API: $MOD_API_PUBLICA"

  [ "$api_local_status" = "200" ] || fail "La API local no respondio 200 en /docs"
  [ "$api_public_status" = "200" ] || fail "La API publicada no respondio 200 en ${MOD_API_PATH}docs"
  [ "$front_public_status" = "200" ] || fail "El frontend publicado no respondio 200 en ${MOD_BASE_PUBLICA}"
}

prechecks
backup_nginx
preparar_repo
resolver_layout_repo
build_frontend
build_backend
generar_snippet_nginx
agregar_include_nginx
validar_final

echo
echo "Modulo $MOD_NOMBRE desplegado correctamente."
