# NodePipeline

![new](https://github.com/user-attachments/assets/fe28cfaa-cb85-4e5f-b42b-41d7c4af0d4b)

## Table of Contents
- [About the Project](https://github.com/husamuel/NodePipeline/edit/main/README.md#table-of-contents)
- [Project Structure](#project-structure)
- [CI/CD Architecture](#cicd-architecture)
  - [Continuous Integration (CI) Pipeline](#continuous-integration-ci-pipeline)
  - [Continuous Deployment (CD) Pipeline](#continuous-deployment-cd-pipeline)
- [GitHub Actions Workflows](#github-actions-workflows)
  - [CI Workflow](#ci-workflow)
  - [CD Workflow](#cd-workflow)
- [Why I Used Docker for This Project](#why-i-used-docker-for-this-project)
- [Why I Set Up CI/CD with GitHub Actions](#why-i-set-up-cicd-with-github-actions)
- [Final Thoughts](#final-thoughts)

## 📖 About the Project

**NodePipeline** is a REST API built with Node.js and Express.js that serves as a practical demonstration of CI/CD pipeline implementation using GitHub Actions. The project exemplifies how to automate development processes, from code validation to containerized application deployment.

The application uses express-validator for data validation, Jest and Supertest for automated testing, and ESLint to ensure code quality. The main focus is on implementing automated workflows that guarantee code integrity and quality with every change.

## 📁 Project Structure

```
nodepipeline/
├── Dockerfile               # Docker image definition using multi-stage build
├── package.json             # Project metadata, scripts, and dependencies
├── package-lock.json        
├── README.md               
├── src/
│   ├── index.js             # Entry point for the Express server
│   └── routes/
│       ├── health.js        # Health check route (GET /health)
│       └── users.js         # Example user routes with validation
├── tests/
│   ├── health.test.js       # Unit tests for the /health endpoint
│   └── users.test.js        # Unit tests for the /users routes
└── .github/
    └── workflows/
        ├── ci.yml           # Continuous Integration: linting and tests
        └── cd.yml           # Continuous Deployment: Docker build & push
```

## 🔄 CI/CD Architecture

### Continuous Integration (CI) Pipeline

The CI workflow is automatically triggered on:
- **Pull Requests** to the `main` branch
- **Pushes** to the `main` branch

**CI Pipeline Steps:**

1. **Environment Setup** - Code checkout, Node.js 18.x setup, and dependency caching
2. **Dependencies Installation** - Clean npm install and security vulnerability checks
3. **Quality Assurance** - ESLint code standards verification and security audits
4. **Testing Suite** - Unit/integration tests with Jest/Supertest and coverage reports

### Continuous Deployment (CD) Pipeline

The CD workflow runs exclusively on:
- **Pushes** to the `main` branch (after approved PR merges)

**CD Pipeline Steps:**

1. **Build Preparation** - CI-validated code checkout and GitHub Container Registry setup
2. **Docker Build Process** - Multi-stage build with layer caching and security scanning
3. **Registry Operations** - Authentication, image push with metadata and multiple tags
4. **Deployment Automation** - Automated tagging, cleanup, and deployment notifications

## 🛠️ GitHub Actions Workflows

### CI Workflow

```yaml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - run: npm ci
    - run: npm run lint
    - run: npm test
    - run: npm run test:coverage
```

### CD Workflow

```yaml
name: CD
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          ghcr.io/${{ github.repository }}:latest
          ghcr.io/${{ github.repository }}:${{ github.sha }}
```

## 🐳 Why I Used Docker for This Project

I decided to use Docker in this project to simplify the development and deployment process. Since the application is built with Node.js and Express, containerizing it makes it much easier to ensure it runs exactly the same way in every environment—whether I'm working locally or deploying to a production server.

Some specific advantages for this project:
* **Reproducibility**: With Docker, I can run the app anywhere without worrying about Node.js versions or system dependencies.
* **Multi-stage builds**: The Dockerfile is optimized to install dependencies and build the app in one stage, and then create a minimal final image with only what's needed to run the app.
* **Security**: The container runs as a non-root user, which is a good security practice.
* **Efficiency**: I'm using a lightweight Alpine image to keep the final image small and fast to pull/deploy.
* **Scalability-ready**: If I wanted to scale this service with Kubernetes or any orchestration platform in the future, it's already containerized and ready.

## ⚙️ Why I Set Up CI/CD with GitHub Actions

Setting up CI/CD was one of the main goals of this project. I'm using GitHub Actions to automate my workflows whenever I push code to the main branch.

Here's why it makes sense for this project:
* **Automated testing and linting**: Every time I make changes, GitHub Actions runs ESLint and Jest to catch errors or style issues before anything is deployed.
* **Consistent builds**: The CI workflow ensures that the app builds correctly and passes all tests before continuing to the CD stage.
* **Docker image publishing**: The CD pipeline automatically builds and pushes the Docker image to GitHub Container Registry (`ghcr.io/husamuel/nodepipeline`), tagged by commit SHA or version.
* **Speed and simplicity**: I don't have to manually test, lint, build, and deploy—it's all automated.
* **Learning & practice**: This project serves as a complete demo of a modern, simple, yet professional CI/CD setup for Node.js apps.

## 🧠 Final Thoughts

**NodePipeline** is a practical example of implementing CI/CD in a Node.js app using GitHub Actions and Docker. It automates testing, validation, and deployment, ensuring consistent and reliable delivery with every code change.

This project provides a solid foundation for future scalability and modern DevOps practices, perfect for both learning and real-world applications.
