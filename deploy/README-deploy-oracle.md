# Despliegue en Oracle Cloud Always Free ($0/mes)

Guía para subir **JGTX Web** (ASP.NET Core .NET 10) a una VM gratis de Oracle Cloud
con Docker, Caddy (HTTPS automático Let's Encrypt) y Cloudflare. Sin base de datos:
la app solo sirve el sitio y envía correos por SMTP.

---

## 1. Crear la cuenta y la VM Always Free

1. Regístrate en https://signup.cloud.oracle.com (tarjeta de crédito como validación,
   pero **no te cobran** si te quedas en recursos Always Free). Al terminar el trial,
   la cuenta pasa a "Pay As You Go" gratis mientras uses solo los recursos Always Free.
2. **Home region**: elige la que quieras (no se puede cambiar después; una región UE
   o Brasil suele tener más disponibilidad de Ampere).
3. Menú ☰ → **Compute → Instances → Create instance**:
   - Name: `jgtx-web`
   - Image: **Ubuntu 24.04** (o 22.04)
   - Shape: pulsa **Change shape** → **Ampere → VM.Standard.A1.Flex**
     - OCPU: **4** · RAM: **24 GB** (máximo gratis)
   - Boot volume: **100 GB** (gratis)
   - Claves SSH: dale "Generate a key pair", descarga **ambas** (la privada es
     `ssh_key_private.pem`).
   - **Create** y espera a que pase a estado *Running*.
4. La VM te asigna una **IP pública** (IP pública estática mientras la instancia exista;
   anótala o deja configurado "Reserved public IP" para que no cambie al reiniciar).
5. **Abrir puertos** (crítico, sino no carga nada):
   - VCN → **Security Lists → Default Security List → Add Ingress Rule**:
     - `TCP 80` y `TCP 443` (origen `0.0.0.0/0`).
   - El SSH (22) ya está abierto por defecto.

---

## 2. Conectar por SSH

Desde PowerShell en tu PC:

```powershell
ssh -i C:\ruta\ssh_key_private.pem ubuntu@IP_DE_LA_VM
```

---

## 3. Instalar Docker y arrancar (una vez)

En la VM:

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER
newgrp docker
```

Copia el proyecto a la VM. Si tu repo de git está en GitHub (privado), lo más limpio:

```bash
git clone https://github.com/TU_USUARIO/jgtx-web.git
cd jgtx-web
```

> Si no quieres GitHub: sube manualmente la carpeta del proyecto con `scp -r` o
> WinSCP/FileZilla SFTP.

Prepara las variables (incluye tu key SMTP real):

```bash
cd deploy
cp .env.example .env
nano .env      # edita DOMAIN, IP, SMTP credenciales
```

Levanta todo:

```bash
docker compose up -d --build
```

Comprueba que la app responde:

```bash
curl -I http://localhost
# y el contenedor:
docker compose ps
docker compose logs -f caddy app
```

---

## 4. Dominio y HTTPS

### 4.0 Fase de prueba sin comprar dominio (DuckDNS, gratis)

Antes de pagar un dominio puedes probar con un subdominio gratis:

1. Crea una cuenta en **https://www.duckdns.org** (gratis, sin tarjeta).
2. Activa un subdominio, p. ej. **`jgtx`** → quedaría `jgtx.duckdns.org`.
3. En DuckDNS, pon la **IP pública de tu VM** y guarda (si la VM tiene **IP
   pública reservada**, no hará falta el cliente DDNS; es lo recomendable).
4. En la VM edita `.env`:

   ```bash
   cd deploy && nano .env
   # DOMAIN=jgtx.duckdns.org
   # Site__BaseUrl=https://jgtx.duckdns.org
   ```

5. Reconstruye:

   ```bash
   docker compose up -d --build
   ```

6. La URL de prueba será **`https://jgtx.duckdns.org`** con HTTPS automático
   (Caddy pide el certificado a Let's Encrypt).

> Más adelante, al comprar `jgtx.tech`, solo cambias `DOMAIN` y `Site__BaseUrl`
> en `.env`, apuntas el A record a la misma IP y haces `docker compose up -d`:
> Caddy renueva el certificado solo, sin tocar nada más.

### 4.1 Producción

1. Cloudflare (plan **gratis**): crea una cuenta y añade tu dominio `jgtx.tech`
   (te dan 2 nameservers; cámbialos en tu registrador).
2. **DNS → Records → Add record**: un registro **A** con `@` y otro `www`
   apuntando a la **IP de la VM** (modo proxied ☁️ naranja).
3. Caddy detectará el dominio del `Caddyfile` y pedirá el certificado HTTPS a
   Let's Encrypt solo. **No hace falta abrir puertos extra** ni config nada más.
4. Verifica: `https://jgtx.tech` cargando con candado verde.

> Para `robots.txt`/`sitemap.xml` la app usa `Site__BaseUrl` (ya en `.env`).

---

## 5. Mantenimiento

```bash
cd deploy
docker compose pull && docker compose up -d --build   # actualizar la app
docker compose down && docker compose up -d           # reiniciar limpio
docker compose logs -f app                             # logs de la app
```

Seguridad mínima en la VM (firewall propio, ademas de los Security Lists):

```bash
sudo apt install -y ufw unattended-upgrades
sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp
sudo ufw enable
sudo dpkg-reconfigure --priority=low unattended-upgrades   # parches automáticos
```

---

## 6. Correo (formulario de contacto y newsletter)

La app usa **MailKit/SMTP** (revisa `.env`). Opciones gratuitas recomendadas:

| Servicio | Gratis | SMTP | Notas |
|---|---|---|---|
| **Resend** | 100 emails/día | `smtp.resend.com` puerto 587 | Simple, recomendado |
| **Brevo** | 300 emails/día | `smtp-relay.brevo.com` puerto 587 | Además marketing |
| Gmail SMTP | limitado | `smtp.gmail.com` | App password, no apto para volumen |

En Resend: crea una **API Key**, y en el `.env` pon `Smtp__Host=smtp.resend.com`,
`Smtp__Username=resend`, `Smtp__Password=<tu key>`. Prueba con el formulario
de `/Contact`.

---

## 7. Costos esperados (todo **$0/mes** mientras uses solo Always Free)

- VM Ampere A1: 4 OCPU / 24 GB RAM — gratis
- Boot volume 100 GB — gratis
- 10 TB de salida/mes — gratis
- Cloudflare plan Free (proxy + HTTPS) — gratis
- SMTP Resend/Brevo — gratis
- Certificado TLS — gratis (Let's Encrypt vía Caddy)

> Regla de oro de Oracle: **no migres** ni uses recursos que no estén marcados
> "Always Free" (por ejemplo, volúmenes bloque BD de pago, shapes no-Ampere),
> o la factura subiría. La VM la dejamos con su shape Ampere A1 y disco de arranque,
> que sí son Always Free.