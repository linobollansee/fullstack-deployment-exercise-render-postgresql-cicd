# Fullstack Deployment Exercise: Render + PostgreSQL + CI/CD

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
- [Step 4: Create PostgreSQL Database on Render](#step-4-create-postgresql-database-on-render)
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

## Step 4: Create PostgreSQL Database on Render

### 4.1 Create a PostgreSQL Database

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in the details:
   - **Name**: `quote-api-db`
   - **Database**: `quotes` (or your preferred name)
   - **User**: (auto-generated)
   - **Region**: Same as your web service
   - **Instance Type**: **Free**
3. Click **"Create Database"**

### 4.2 Get Database Connection Info

After creation:

1. Go to your database dashboard
2. Scroll to **"Connections"**
3. Copy the **"External Database URL"** - it looks like:
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

---

## Step 6: Set Up Required Environment Variables in Render

### 6.1 Add Environment Variable to Your Web Service

1. Go to your **Web Service** in Render Dashboard
2. Click on the **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add the following:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the PostgreSQL External Database URL from Step 4.2
5. Click **"Save Changes"**

Render will automatically redeploy your service with the new environment variable.

### 6.2 Verify Database Connection

After redeployment:

1. Visit your service URL
2. Try accessing an endpoint like `/quotes` or `/users`
3. Your application should now successfully connect to PostgreSQL

---

## Step 7: Set Up CI/CD Workflow

### 7.1 GitHub Secrets Setup

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

### 7.2 GitHub Actions Workflow File

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

### 7.3 Test Your CI/CD Pipeline

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

