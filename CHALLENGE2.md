# Deploying a Static React Frontend with a NestJS Backend

## Overview

In this setup:

- We build the **React app** into static files (`index.html`, `bundle.js`, etc.)
- These files are served by the **NestJS backend** using its built-in static file serving
- This creates a **unified full-stack application** with a single deployment

## Prerequisites

- A working **NestJS** backend
- A **React** frontend (e.g., created with Create React App)


# Step 1: Build the React App

Navigate to your React app and build it:

```npm run build```

This generates a ```build//dist/``` folder with static HTML, CSS, and JS files.

## Step 2: Serve React with NestJS
Move or copy the React build into the NestJS public directory:

Then configure **NestJS** to serve static assets.

### **Install serve-static** :

```npm install --save @nestjs/serve-static```

In **`app.module.ts`:**

```
import {Module} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        // Other modules...
    ],
})
export class AppModule {
}
```

Make sure the `public/` folder contains your built React app.

## 🚀 Step 4: Deploy the Combined App
You now have a **single NestJS server** serving both:

- Your **backend API**
- Your **frontend React app**

## Option 1: Manual Deployment

Deploy your application manually to a server.

- Build the NestJS app:
- Build your docker image.
- Push your Docker image.
- Restart the render deployment.

## Option 2: Automated Deployment

- Adjust you CD/Dockerfile to build both the NestJS and React apps and copy the React build into the NestJS public directory.