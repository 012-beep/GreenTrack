# GreenTrack Deployment Guide

This guide provides step-by-step instructions for deploying GreenTrack to various hosting platforms.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended)

Vercel provides the easiest deployment experience for React applications.

#### Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy "greentrack"? [Y/n] y
# ? Which scope do you want to deploy to? [Use arrows to navigate]
# ? Found project "greentrack". Link to it? [Y/n] y
# ? In which directory is your code located? ./
```

#### Via GitHub Integration
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "New Project"
5. Import your GreenTrack repository
6. Configure build settings (auto-detected)
7. Click "Deploy"

**Build Settings:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Netlify

#### Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy

# For production deployment
netlify deploy --prod --dir=dist
```

#### Via Git Integration
1. Push code to GitHub/GitLab/Bitbucket
2. Visit [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### 3. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

**Firebase Configuration:**
- Public directory: `dist`
- Configure as SPA: `Yes`
- Set up automatic builds: `Optional`

### 4. GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

**Note**: Update `vite.config.ts` for GitHub Pages:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Replace with your repository name
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

## 🔧 Environment Configuration

### Environment Variables

Create `.env` file for production:

```bash
# API Configuration
VITE_API_URL=https://your-api-url.com
VITE_AI_SERVICE_URL=https://your-ai-service.com

# Firebase Configuration (if using Firebase)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Build Optimization

Update `vite.config.ts` for production:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
        }
      }
    }
  }
});
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}
```

### Docker Commands

```bash
# Build the image
docker build -t greentrack .

# Run the container
docker run -p 80:80 greentrack

# Run with environment variables
docker run -p 80:80 -e VITE_API_URL=https://api.example.com greentrack
```

## ☁️ Cloud Platform Deployment

### AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Install AWS CLI
# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://greentrack-app

# Upload files
aws s3 sync dist/ s3://greentrack-app --delete

# Enable website hosting
aws s3 website s3://greentrack-app --index-document index.html --error-document index.html
```

### Google Cloud Storage

```bash
# Build the project
npm run build

# Install Google Cloud SDK
# Authenticate
gcloud auth login

# Create bucket
gsutil mb gs://greentrack-app

# Upload files
gsutil -m cp -r dist/* gs://greentrack-app

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://greentrack-app

# Enable website configuration
gsutil web set -m index.html -e index.html gs://greentrack-app
```

## 🔍 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm install --save-dev @rollup/plugin-visualizer

# Add to vite.config.ts
import { visualizer } from '@rollup/plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    })
  ],
});

# Build and analyze
npm run build
```

### CDN Configuration

For better performance, serve static assets from CDN:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

## 🛡️ Security Considerations

### HTTPS Enforcement

Most hosting platforms provide HTTPS by default. For custom deployments:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # ... rest of configuration
}
```

### Content Security Policy

Add CSP headers for security:

```typescript
// Add to index.html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
">
```

## 📊 Monitoring & Analytics

### Basic Analytics Setup

```typescript
// Add to main.tsx
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  // Your config
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

### Error Monitoring

Consider integrating error monitoring services:
- Sentry
- LogRocket
- Bugsnag

## 🚨 Troubleshooting

### Common Issues

**1. Blank page after deployment**
- Check browser console for errors
- Verify base URL in vite.config.ts
- Ensure all routes are properly configured

**2. 404 errors on refresh**
- Configure server for SPA routing
- Add fallback to index.html

**3. Environment variables not working**
- Ensure variables start with `VITE_`
- Check environment variable configuration on hosting platform

**4. Build failures**
- Check Node.js version compatibility
- Clear node_modules and reinstall dependencies
- Review build logs for specific errors

### Debug Commands

```bash
# Check build output
npm run build && npx serve dist

# Analyze bundle
npm run build -- --mode analyze

# Check for TypeScript errors
npx tsc --noEmit
```

## 📝 Post-Deployment Checklist

- [ ] Test all features in production environment
- [ ] Verify responsive design on different devices
- [ ] Test camera functionality on mobile devices
- [ ] Check performance with Lighthouse
- [ ] Verify all external links work
- [ ] Test user authentication flow
- [ ] Verify analytics tracking
- [ ] Set up monitoring and alerting
- [ ] Configure backup and recovery procedures
- [ ] Update DNS records if using custom domain

---

For additional support with deployment, please refer to the specific platform documentation or create an issue in the repository.