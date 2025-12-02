# Fullstack Deployment Exercise: Render + PostgreSQL + CI/CD

## 🌍 Language / Sprache

- [English Version](#english-version)
- [Deutsche Version](#deutsche-version)

---

# English Version

A comprehensive guide to deploying a fullstack NestJS + React application to Render with PostgreSQL database and automated CI/CD using GitHub Actions.

This application includes:

- **Backend**: NestJS REST API with TypeORM
- **Frontend**: React TypeScript application with Vite
- **Database**: PostgreSQL
- **Deployment**: Dockerized multi-stage build
- **CI/CD**: Automated GitHub Actions pipeline

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Step 1: Push Your Code to GitHub](#step-1-push-your-code-to-github)
- [Step 2: Create and Push Docker Image to Docker Hub](#step-2-create-and-push-docker-image-to-docker-hub)
- [Step 3: Deploy on Render](#step-3-deploy-on-render)
- [Step 4: Set Up Internal PostgreSQL Database on Render](#step-4-set-up-internal-postgresql-database-on-render)
- [Step 5: Connect Your Application to PostgreSQL](#step-5-connect-your-application-to-postgresql)
- [Step 6: Set Up CI/CD Workflow](#step-6-set-up-cicd-workflow)
- [Testing Your Deployment](#testing-your-deployment)

---

## Prerequisites

Before you begin, make sure you have:

- A GitHub account
- A Docker Hub account
- A Render account (free tier works)
- Git installed on your computer
- Docker installed on your computer
- Node.js installed (v18 or higher)

---

## Local Development

### Setup

1. **Clone the repository** (or use your existing project):

   ```powershell
   git clone <your-repo-url>
   cd fullstack-deployment-exercise-render-postgresql-cicd
   ```

2. **Install backend dependencies**:

   ```powershell
   npm install
   ```

3. **Install frontend dependencies**:

   ```powershell
   cd frontend
   npm install
   cd ..
   ```

4. **Create a `.env` file** (copy from `.env.example`):

   ```powershell
   copy .env.example .env
   ```

   Update the `DATABASE_URL` with your PostgreSQL connection string.

### Running Locally

**Option 1: Run backend and frontend separately (recommended for development)**

Terminal 1 - Backend:

```powershell
npm run start:dev
```

Terminal 2 - Frontend:

```powershell
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and will proxy API requests to the backend at `http://localhost:3000`.

**Option 2: Run as production (serve frontend from backend)**

```powershell
# Build frontend
cd frontend
npm run build
cd ..

# Build and start backend
npm run build
npm start
```

Visit `http://localhost:3000` to see the application.

---

## Step 1: Push Your Code to GitHub

### 1.1 Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Name your repository (e.g., `quote-api-render`)
5. Choose **Public** or **Private**
6. Click **"Create repository"**

### 1.2 Push Your Local Code to GitHub

In your project directory, run:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace** `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

---

## Step 2: Create and Push Docker Image to Docker Hub

### 2.1 Dockerfile

The project includes a multi-stage Dockerfile that:

1. Builds the React frontend
2. Builds the NestJS backend
3. Creates a production image with both frontend and backend

The Dockerfile is already configured in your project root.

### 2.2 Create a .dockerignore File

Create a `.dockerignore` file to exclude unnecessary files:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
dist
frontend/node_modules
frontend/dist
```

### 2.3 Build and Push to Docker Hub

```powershell
# Log in to Docker Hub
docker login

# Build your Docker image
docker build -t YOUR_DOCKERHUB_USERNAME/nestjs-app:latest .

# Push to Docker Hub
docker push YOUR_DOCKERHUB_USERNAME/nestjs-app:latest
```

**Replace** `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username.

---

## Step 3: Deploy on Render

### 3.1 Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Choose **"Deploy an existing image from a registry"**
4. Click **"Next"**

### 3.2 Configure Your Service

Fill in the following details:

- **Image URL**: `docker.io/YOUR_DOCKERHUB_USERNAME/nestjs-app:latest`
- **Name**: `quote-api` (or any name you prefer)
- **Region**: Choose the closest to you
- **Instance Type**: **Free** (for testing)

### 3.3 Advanced Settings

Scroll down to **Advanced** settings:

- **Port**: `3000`
- **Health Check Path**: `/` (optional)

Click **"Create Web Service"**

### 3.4 Get Your Deploy Hook URL

1. Go to your service's **Settings** tab
2. Scroll down to **Deploy Hook**
3. Click **"Create Deploy Hook"**
4. Copy the URL - you'll need this for CI/CD

### 3.5 Verify Manual Deployment

Once Render finishes deploying:

1. Click on your service URL (e.g., `https://quote-api-xxxx.onrender.com`)
2. You should see your application running (it might show an error about database connection - that's expected at this stage)

---

## Step 4: Set Up Internal PostgreSQL Database on Render

### 4.1 Add Internal PostgreSQL Database to Your Web Service

Render provides an internal PostgreSQL database that can be directly attached to your web service:

1. In Render Dashboard, go to your **Web Service**
2. Click on the **"Environment"** tab
3. Scroll down and click **"Add Database"**
4. Select **"PostgreSQL"**
5. Render will automatically create an internal database and add the `DATABASE_URL` environment variable

Alternatively, you can create a standalone PostgreSQL database and connect it:

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in the details:
   - **Name**: `quote-api-db`
   - **Database**: `quotes` (or your preferred name)
   - **User**: (auto-generated)
   - **Region**: Same as your web service
   - **Instance Type**: **Free**
3. Click **"Create Database"**

### 4.2 Get Database Connection Info

The `DATABASE_URL` environment variable will be automatically set when using Render's internal database. If you created a standalone database:

1. Go to your database dashboard
2. Scroll to **"Connections"**
3. Copy the **"Internal Database URL"** (preferred for services on Render) - it looks like:
   ```
   postgresql://user:password@host:5432/database
   ```

---

## Step 5: Connect Your Application to PostgreSQL

### 5.1 Update Your Code

Your `app.module.ts` should already be configured for PostgreSQL:

```typescript
TypeOrmModule.forRoot({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [Quote, User],
  synchronize: true,
});
```

### 5.2 Install PostgreSQL Driver

Make sure you have the `pg` package installed:

```powershell
npm install pg
```

### 5.3 Update package.json

Ensure your `package.json` includes `pg`:

```json
"dependencies": {
  "pg": "^8.16.3",
  // ... other dependencies
}
```

Commit and push these changes:

```powershell
git add .
git commit -m "Add PostgreSQL driver"
git push
```

### 5.4 Environment Variables

When using Render's internal PostgreSQL database, the `DATABASE_URL` environment variable is automatically configured. You don't need to manually add it.

If you created a standalone database, add the database URL:

1. Go to your **Web Service** in Render Dashboard
2. Click on the **"Environment"** tab
3. The `DATABASE_URL` should already be present if you used "Add Database"
4. Or click **"Add Environment Variable"** and add:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL from Step 4.2

### 5.5 Verify Database Connection

After deployment:

1. Visit your service URL
2. Try accessing an endpoint like `/quotes` or `/users`
3. Your application should now successfully connect to PostgreSQL

---

## Step 6: Set Up CI/CD Workflow

### 6.1 GitHub Secrets Setup

Go to your GitHub repository:

1. Click **"Settings"** → **"Secrets and variables"** → **"Actions"**
2. Click **"New repository secret"** and add:

   **Secret 1:**

   - Name: `DOCKER_HUB_USERNAME`
   - Value: Your Docker Hub username

   **Secret 2:**

   - Name: `DOCKER_HUB_ACCESS_TOKEN`
   - Value: Your Docker Hub access token
     - Get this from Docker Hub → Account Settings → Security → New Access Token

   **Secret 3:**

   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: The deploy hook URL from Step 3.4

### 6.2 GitHub Actions Workflow File

The workflow file at `.github/workflows/cd.yml` is already configured:

```yaml
name: Build and deploy to render

on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "24"

      - name: Install dependencies
        run: npm ci

      - name: Build NestJS project
        run: npm run build

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/nestjs-app:latest
          platforms: linux/amd64

      - name: Trigger Render deploy
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

### 6.3 Test Your CI/CD Pipeline

Make a small change to your code:

```powershell
# Make a change (e.g., update a comment or add a console.log)
git add .
git commit -m "Test CI/CD pipeline"
git push
```

Then:

1. Go to your GitHub repository → **"Actions"** tab
2. You should see your workflow running
3. Wait for it to complete (green checkmark)
4. Go to your Render dashboard - you should see a new deployment starting
5. Once complete, visit your Render URL to see the changes

---

## Testing Your Deployment

### Test the React Frontend

Visit your Render URL in a browser:

```
https://your-app.onrender.com
```

You should see the React application with:

- A form to add new quotes
- A list of all quotes
- Delete buttons for each quote

### Test Endpoints with HTTP Requests

Use the `api-tests.http` file or tools like Postman to test the API directly:

**Get all quotes:**

```http
GET https://your-app.onrender.com/quotes
```

**Create a quote:**

```http
POST https://your-app.onrender.com/quotes
Content-Type: application/json

{
  "text": "Hello from production!",
  "author": "Your Name"
}
```

**Get all users:**

```http
GET https://your-app.onrender.com/users
```

---

## Troubleshooting

### Issue: Application won't start on Render

**Solution:**

- Check Render logs (Logs tab in your service)
- Ensure `PORT` environment variable is set to `3000`
- Verify Docker image was pushed successfully to Docker Hub

### Issue: Database connection fails

**Solution:**

- Verify `DATABASE_URL` environment variable is set correctly in Render
- Ensure PostgreSQL database is running (check Render dashboard)
- Check that `ssl: { rejectUnauthorized: false }` is in your TypeORM config

### Issue: CI/CD pipeline fails

**Solution:**

- Check GitHub Actions logs for specific errors
- Verify all three GitHub secrets are set correctly
- Ensure Dockerfile exists in repository root
- Check that Docker Hub credentials are valid

### Issue: Changes not deploying automatically

**Solution:**

- Verify GitHub webhook is triggering (Actions tab)
- Check that deploy hook URL is correct in GitHub secrets
- Ensure main branch is the one being pushed to

---

## Additional Notes

### Free Tier Limitations

Render's free tier:

- Spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Database has storage limits

### Security Recommendations for Production

1. Change `synchronize: true` to `false` in production
2. Use migrations instead of auto-sync
3. Set up proper environment variable management
4. Enable CORS with specific origins
5. Add rate limiting and authentication

---

## Conclusion

You now have a fully automated deployment pipeline! Every push to the `main` branch will:

1. ✅ Build your NestJS application
2. ✅ Create a Docker image
3. ✅ Push to Docker Hub
4. ✅ Deploy to Render automatically
5. ✅ Connect to PostgreSQL database

Happy deploying! 🚀

---
---

# Deutsche Version

Eine umfassende Anleitung zur Bereitstellung einer Fullstack-Anwendung (NestJS + React) auf Render mit PostgreSQL-Datenbank und automatisiertem CI/CD über GitHub Actions.

Diese Anwendung umfasst:

- **Backend**: NestJS REST API mit TypeORM
- **Frontend**: React TypeScript-Anwendung mit Vite
- **Datenbank**: PostgreSQL
- **Deployment**: Dockerisierter Multi-Stage-Build
- **CI/CD**: Automatisierte GitHub Actions Pipeline

## Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Schritt 1: Code zu GitHub pushen](#schritt-1-code-zu-github-pushen)
- [Schritt 2: Docker-Image erstellen und zu Docker Hub pushen](#schritt-2-docker-image-erstellen-und-zu-docker-hub-pushen)
- [Schritt 3: Auf Render bereitstellen](#schritt-3-auf-render-bereitstellen)
- [Schritt 4: Interne PostgreSQL-Datenbank auf Render einrichten](#schritt-4-interne-postgresql-datenbank-auf-render-einrichten)
- [Schritt 5: Anwendung mit PostgreSQL verbinden](#schritt-5-anwendung-mit-postgresql-verbinden)
- [Schritt 6: CI/CD-Workflow einrichten](#schritt-6-cicd-workflow-einrichten)
- [Deployment testen](#deployment-testen)

---

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie Folgendes haben:

- Ein GitHub-Konto
- Ein Docker Hub-Konto
- Ein Render-Konto (Free-Tier funktioniert)
- Git auf Ihrem Computer installiert
- Docker auf Ihrem Computer installiert
- Node.js installiert (v18 oder höher)

---

## Lokale Entwicklung

### Einrichtung

1. **Repository klonen** (oder verwenden Sie Ihr bestehendes Projekt):

   ```powershell
   git clone <ihre-repo-url>
   cd fullstack-deployment-exercise-render-postgresql-cicd
   ```

2. **Backend-Abhängigkeiten installieren**:

   ```powershell
   npm install
   ```

3. **Frontend-Abhängigkeiten installieren**:

   ```powershell
   cd frontend
   npm install
   cd ..
   ```

4. **`.env`-Datei erstellen** (von `.env.example` kopieren):

   ```powershell
   copy .env.example .env
   ```

   Aktualisieren Sie die `DATABASE_URL` mit Ihrer PostgreSQL-Verbindungszeichenfolge.

### Lokal ausführen

**Option 1: Backend und Frontend separat ausführen (empfohlen für Entwicklung)**

Terminal 1 - Backend:

```powershell
npm run start:dev
```

Terminal 2 - Frontend:

```powershell
cd frontend
npm run dev
```

Das Frontend ist unter `http://localhost:5173` verfügbar und leitet API-Anfragen an das Backend unter `http://localhost:3000` weiter.

**Option 2: Als Produktion ausführen (Frontend vom Backend aus bereitstellen)**

```powershell
# Frontend bauen
cd frontend
npm run build
cd ..

# Backend bauen und starten
npm run build
npm start
```

Besuchen Sie `http://localhost:3000`, um die Anwendung zu sehen.

---

## Schritt 1: Code zu GitHub pushen

### 1.1 GitHub-Repository erstellen

1. Gehen Sie zu [GitHub](https://github.com) und melden Sie sich an
2. Klicken Sie auf das **"+"**-Symbol in der oberen rechten Ecke
3. Wählen Sie **"New repository"**
4. Benennen Sie Ihr Repository (z.B. `quote-api-render`)
5. Wählen Sie **Public** oder **Private**
6. Klicken Sie auf **"Create repository"**

### 1.2 Lokalen Code zu GitHub pushen

Führen Sie in Ihrem Projektverzeichnis aus:

```powershell
# Git initialisieren (falls noch nicht geschehen)
git init

# Alle Dateien hinzufügen
git add .

# Änderungen committen
git commit -m "Initial commit"

# GitHub-Repository als Remote hinzufügen
git remote add origin https://github.com/IHR_BENUTZERNAME/IHR_REPO_NAME.git

# Zu GitHub pushen
git branch -M main
git push -u origin main
```

**Ersetzen** Sie `IHR_BENUTZERNAME` und `IHR_REPO_NAME` durch Ihren tatsächlichen GitHub-Benutzernamen und Repository-Namen.

---

## Schritt 2: Docker-Image erstellen und zu Docker Hub pushen

### 2.1 Dockerfile

Das Projekt enthält ein Multi-Stage-Dockerfile, das:

1. Das React-Frontend baut
2. Das NestJS-Backend baut
3. Ein Produktions-Image mit Frontend und Backend erstellt

Das Dockerfile ist bereits im Projektverzeichnis konfiguriert.

### 2.2 .dockerignore-Datei erstellen

Erstellen Sie eine `.dockerignore`-Datei, um unnötige Dateien auszuschließen:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
dist
frontend/node_modules
frontend/dist
```

### 2.3 Zu Docker Hub bauen und pushen

```powershell
# Bei Docker Hub anmelden
docker login

# Docker-Image bauen
docker build -t IHR_DOCKERHUB_BENUTZERNAME/nestjs-app:latest .

# Zu Docker Hub pushen
docker push IHR_DOCKERHUB_BENUTZERNAME/nestjs-app:latest
```

**Ersetzen** Sie `IHR_DOCKERHUB_BENUTZERNAME` durch Ihren Docker Hub-Benutzernamen.

---

## Schritt 3: Auf Render bereitstellen

### 3.1 Neuen Web-Service erstellen

1. Gehen Sie zum [Render Dashboard](https://dashboard.render.com/)
2. Klicken Sie auf **"New +"** → **"Web Service"**
3. Wählen Sie **"Deploy an existing image from a registry"**
4. Klicken Sie auf **"Next"**

### 3.2 Service konfigurieren

Füllen Sie folgende Details aus:

- **Image URL**: `docker.io/IHR_DOCKERHUB_BENUTZERNAME/nestjs-app:latest`
- **Name**: `quote-api` (oder einen beliebigen Namen)
- **Region**: Wählen Sie die nächstgelegene
- **Instance Type**: **Free** (zum Testen)

### 3.3 Erweiterte Einstellungen

Scrollen Sie zu den **Advanced**-Einstellungen:

- **Port**: `3000`
- **Health Check Path**: `/` (optional)

Klicken Sie auf **"Create Web Service"**

### 3.4 Deploy Hook URL erhalten

1. Gehen Sie zur **Settings**-Registerkarte Ihres Services
2. Scrollen Sie zu **Deploy Hook**
3. Klicken Sie auf **"Create Deploy Hook"**
4. Kopieren Sie die URL - Sie benötigen diese für CI/CD

### 3.5 Manuelle Bereitstellung überprüfen

Sobald Render die Bereitstellung abgeschlossen hat:

1. Klicken Sie auf Ihre Service-URL (z.B. `https://quote-api-xxxx.onrender.com`)
2. Sie sollten Ihre Anwendung sehen (es kann ein Datenbankverbindungsfehler angezeigt werden - das ist an dieser Stelle zu erwarten)

---

## Schritt 4: Interne PostgreSQL-Datenbank auf Render einrichten

### 4.1 Interne PostgreSQL-Datenbank zu Ihrem Web-Service hinzufügen

Render bietet eine interne PostgreSQL-Datenbank, die direkt an Ihren Web-Service angehängt werden kann:

1. Gehen Sie im Render Dashboard zu Ihrem **Web Service**
2. Klicken Sie auf die **"Environment"**-Registerkarte
3. Scrollen Sie nach unten und klicken Sie auf **"Add Database"**
4. Wählen Sie **"PostgreSQL"**
5. Render erstellt automatisch eine interne Datenbank und fügt die `DATABASE_URL`-Umgebungsvariable hinzu

Alternativ können Sie eine eigenständige PostgreSQL-Datenbank erstellen und verbinden:

1. Klicken Sie im Render Dashboard auf **"New +"** → **"PostgreSQL"**
2. Füllen Sie die Details aus:
   - **Name**: `quote-api-db`
   - **Database**: `quotes` (oder Ihr bevorzugter Name)
   - **User**: (automatisch generiert)
   - **Region**: Gleiche wie Ihr Web-Service
   - **Instance Type**: **Free**
3. Klicken Sie auf **"Create Database"**

### 4.2 Datenbankverbindungsinformationen erhalten

Die `DATABASE_URL`-Umgebungsvariable wird automatisch gesetzt, wenn Sie Renders interne Datenbank verwenden. Wenn Sie eine eigenständige Datenbank erstellt haben:

1. Gehen Sie zu Ihrem Datenbank-Dashboard
2. Scrollen Sie zu **"Connections"**
3. Kopieren Sie die **"Internal Database URL"** (bevorzugt für Services auf Render) - sie sieht so aus:
   ```
   postgresql://user:password@host:5432/database
   ```

---

## Schritt 5: Anwendung mit PostgreSQL verbinden

### 5.1 Code aktualisieren

Ihre `app.module.ts` sollte bereits für PostgreSQL konfiguriert sein:

```typescript
TypeOrmModule.forRoot({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [Quote, User],
  synchronize: true,
});
```

### 5.2 PostgreSQL-Treiber installieren

Stellen Sie sicher, dass das `pg`-Paket installiert ist:

```powershell
npm install pg
```

### 5.3 package.json aktualisieren

Stellen Sie sicher, dass Ihre `package.json` `pg` enthält:

```json
"dependencies": {
  "pg": "^8.16.3",
  // ... andere Abhängigkeiten
}
```

Änderungen committen und pushen:

```powershell
git add .
git commit -m "Add PostgreSQL driver"
git push
```

### 5.4 Umgebungsvariablen

Bei Verwendung der internen PostgreSQL-Datenbank von Render wird die `DATABASE_URL`-Umgebungsvariable automatisch konfiguriert. Sie müssen sie nicht manuell hinzufügen.

Wenn Sie eine eigenständige Datenbank erstellt haben, fügen Sie die Datenbank-URL hinzu:

1. Gehen Sie zu Ihrem **Web Service** im Render Dashboard
2. Klicken Sie auf die **"Environment"**-Registerkarte
3. Die `DATABASE_URL` sollte bereits vorhanden sein, wenn Sie "Add Database" verwendet haben
4. Oder klicken Sie auf **"Add Environment Variable"** und fügen Sie hinzu:
   - **Key**: `DATABASE_URL`
   - **Value**: Fügen Sie die Internal Database URL aus Schritt 4.2 ein

### 5.5 Datenbankverbindung überprüfen

Nach der Bereitstellung:

1. Besuchen Sie Ihre Service-URL
2. Versuchen Sie, einen Endpunkt wie `/quotes` oder `/users` aufzurufen
3. Ihre Anwendung sollte sich nun erfolgreich mit PostgreSQL verbinden

---

## Schritt 6: CI/CD-Workflow einrichten

### 6.1 GitHub Secrets einrichten

Gehen Sie zu Ihrem GitHub-Repository:

1. Klicken Sie auf **"Settings"** → **"Secrets and variables"** → **"Actions"**
2. Klicken Sie auf **"New repository secret"** und fügen Sie hinzu:

   **Secret 1:**

   - Name: `DOCKER_HUB_USERNAME`
   - Value: Ihr Docker Hub-Benutzername

   **Secret 2:**

   - Name: `DOCKER_HUB_ACCESS_TOKEN`
   - Value: Ihr Docker Hub Access Token
     - Erhalten Sie dies von Docker Hub → Account Settings → Security → New Access Token

   **Secret 3:**

   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: Die Deploy Hook URL aus Schritt 3.4

### 6.2 GitHub Actions Workflow-Datei

Die Workflow-Datei unter `.github/workflows/cd.yml` ist bereits konfiguriert:

```yaml
name: Build and deploy to render

on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "24"

      - name: Install dependencies
        run: npm ci

      - name: Build NestJS project
        run: npm run build

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/nestjs-app:latest
          platforms: linux/amd64

      - name: Trigger Render deploy
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

### 6.3 CI/CD-Pipeline testen

Nehmen Sie eine kleine Änderung an Ihrem Code vor:

```powershell
# Änderung vornehmen (z.B. einen Kommentar aktualisieren)
git add .
git commit -m "Test CI/CD pipeline"
git push
```

Dann:

1. Gehen Sie zu Ihrem GitHub-Repository → **"Actions"**-Registerkarte
2. Sie sollten Ihren laufenden Workflow sehen
3. Warten Sie, bis er abgeschlossen ist (grünes Häkchen)
4. Gehen Sie zu Ihrem Render-Dashboard - Sie sollten eine neue Bereitstellung sehen
5. Sobald abgeschlossen, besuchen Sie Ihre Render-URL, um die Änderungen zu sehen

---

## Deployment testen

### React-Frontend testen

Besuchen Sie Ihre Render-URL in einem Browser:

```
https://ihre-app.onrender.com
```

Sie sollten die React-Anwendung sehen mit:

- Einem Formular zum Hinzufügen neuer Zitate
- Einer Liste aller Zitate
- Löschen-Buttons für jedes Zitat

### Endpunkte mit HTTP-Anfragen testen

Verwenden Sie die `api-tests.http`-Datei oder Tools wie Postman, um die API direkt zu testen:

**Alle Zitate abrufen:**

```http
GET https://ihre-app.onrender.com/quotes
```

**Zitat erstellen:**

```http
POST https://ihre-app.onrender.com/quotes
Content-Type: application/json

{
  "text": "Hallo aus der Produktion!",
  "author": "Ihr Name"
}
```

**Alle Benutzer abrufen:**

```http
GET https://ihre-app.onrender.com/users
```

---

## Fehlerbehebung

### Problem: Anwendung startet nicht auf Render

**Lösung:**

- Überprüfen Sie Render-Logs (Logs-Tab in Ihrem Service)
- Stellen Sie sicher, dass die `PORT`-Umgebungsvariable auf `3000` gesetzt ist
- Überprüfen Sie, ob das Docker-Image erfolgreich zu Docker Hub gepusht wurde

### Problem: Datenbankverbindung schlägt fehl

**Lösung:**

- Überprüfen Sie, ob die `DATABASE_URL`-Umgebungsvariable korrekt in Render gesetzt ist
- Stellen Sie sicher, dass die PostgreSQL-Datenbank läuft (Render Dashboard prüfen)
- Überprüfen Sie, dass `ssl: { rejectUnauthorized: false }` in Ihrer TypeORM-Konfiguration vorhanden ist

### Problem: CI/CD-Pipeline schlägt fehl

**Lösung:**

- Überprüfen Sie GitHub Actions-Logs auf spezifische Fehler
- Überprüfen Sie, ob alle drei GitHub Secrets korrekt gesetzt sind
- Stellen Sie sicher, dass das Dockerfile im Repository-Root existiert
- Überprüfen Sie, ob Docker Hub-Anmeldedaten gültig sind

### Problem: Änderungen werden nicht automatisch bereitgestellt

**Lösung:**

- Überprüfen Sie, ob der GitHub-Webhook ausgelöst wird (Actions-Tab)
- Überprüfen Sie, ob die Deploy Hook URL in GitHub Secrets korrekt ist
- Stellen Sie sicher, dass der main-Branch derjenige ist, zu dem gepusht wird

---

## Zusätzliche Hinweise

### Free-Tier-Einschränkungen

Renders Free-Tier:

- Schaltet sich nach 15 Minuten Inaktivität ab
- Erste Anfrage nach dem Abschalten kann 30-60 Sekunden dauern
- Datenbank hat Speicherlimits

### Sicherheitsempfehlungen für Produktion

1. Ändern Sie `synchronize: true` zu `false` in der Produktion
2. Verwenden Sie Migrationen anstelle von Auto-Sync
3. Richten Sie eine ordnungsgemäße Verwaltung von Umgebungsvariablen ein
4. Aktivieren Sie CORS mit spezifischen Origins
5. Fügen Sie Rate Limiting und Authentifizierung hinzu

---

## Fazit

Sie haben jetzt eine vollautomatische Deployment-Pipeline! Jeder Push zum `main`-Branch wird:

1. ✅ Ihre NestJS-Anwendung bauen
2. ✅ Ein Docker-Image erstellen
3. ✅ Zu Docker Hub pushen
4. ✅ Automatisch zu Render deployen
5. ✅ Mit PostgreSQL-Datenbank verbinden

Viel Erfolg beim Deployen! 🚀

1. ✅ Build your NestJS application
2. ✅ Create a Docker image
3. ✅ Push to Docker Hub
4. ✅ Deploy to Render automatically
5. ✅ Connect to PostgreSQL database

Happy deploying! 🚀

