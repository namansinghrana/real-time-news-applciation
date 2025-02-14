# Real-Time News Application

## Overview
This is a real-time news application built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to view the latest news articles in real-time.

## Features
- Real-time updates of news articles
- User authentication and authorization
- Responsive design

## Installation
To run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/real-time-news-application.git
    ```

2. Navigate to the project directory:
    ```bash
    cd real-time-news-application
    ```

3. Install the dependencies for both the server and client:
    ```bash
    cd server
    npm install
    cd ../client
    npm install
    ```

4. Create a `.env` file in the `server` directory and add your environment variables:
    ```env
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

5. Start the development server:
    ```bash
    cd server
    npm run dev
    cd ../client
    npm start
    ```

## Usage
Once the server and client are running, you can access the application at `http://localhost:3000`.

## Deployment
To deploy this application, you can use platforms like Heroku, Vercel, or Netlify. Follow their documentation for deployment instructions.

# Real-Time News Application Deployment

## Introduction
This document explains how to deploy the Real-Time News Application using Docker and Kubernetes. This guide will help you understand the deployment process and showcase it to recruiters.

## Docker Deployment

### Step 1: Build the Docker Image
First, navigate to the project directory and build the Docker image using the following command:
```sh
docker build -t real-time-news-app .
```
![Docker Build](./images/docker-build.png)

### Step 2: Run the Docker Container
Run the Docker container using the following command:
```sh
docker run -p 3000:3000 real-time-news-app
```
![Docker Run](./images/docker-run.png)

## Kubernetes Deployment

### Step 1: Create Kubernetes Deployment and Service Files
Create a deployment file `deployment.yaml` and a service file `service.yaml` with the following content:

#### deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: real-time-news-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: real-time-news-app
  template:
    metadata:
      labels:
        app: real-time-news-app
    spec:
      containers:
      - name: real-time-news-app
        image: real-time-news-app:latest
        ports:
        - containerPort: 3000
```

#### service.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: real-time-news-app-service
spec:
  selector:
    app: real-time-news-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

### Step 2: Apply the Kubernetes Files
Apply the deployment and service files to your Kubernetes cluster using the following commands:
```sh
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```
![Kubernetes Apply](./images/kubernetes-apply.png)

## Conclusion
This guide provided a step-by-step process to deploy the Real-Time News Application using Docker and Kubernetes. By following these steps, you can demonstrate your ability to deploy applications in a containerized environment to recruiters.

## License
This project is licensed under the MIT License.
