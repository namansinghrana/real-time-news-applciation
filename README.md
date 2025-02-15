# Real-Time News Application
![Image](https://github.com/user-attachments/assets/90513687-0545-4626-9d34-c7a8f57ea316)

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

## Snapshots

<img width="959" alt="Image" src="https://github.com/user-attachments/assets/5779c262-9328-46af-a80f-606931b0aab1" />
![Image](https://github.com/user-attachments/assets/de5a28aa-fd03-4118-a9c0-9fffaaa1367e)

## Deployment
To deploy this application, you can use platforms like Heroku, Vercel, or Netlify. Follow their documentation for deployment instructions.

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

## Conclusion
This guide provided a step-by-step process to deploy the Real-Time News Application using Docker and Kubernetes. By following these steps, you can demonstrate your ability to deploy applications in a containerized environment to recruiters.

## License
This project is licensed under the MIT License.
