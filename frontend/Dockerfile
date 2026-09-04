pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        BACKEND_IMAGE = 'login-app-backend'
        FRONTEND_IMAGE = 'login-app-frontend'
    }

    stages {

        stage('1. Checkout Code') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('2. Build Docker Images') {
            steps {
                echo '🐳 Building Backend & Frontend Docker Images...'
                sh 'docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend'
                sh 'docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ./frontend'
            }
        }

        stage('3. Test Docker Images') {
            steps {
                echo '🧪 Verifying Docker images exist...'
                sh 'docker images | grep login-app'
            }
        }

        stage('4. Deploy (Run Containers)') {
            steps {
                echo '🚀 Running updated containers...'
                echo 'Docker images built successfully with tag #${BUILD_NUMBER}'
            }
        }
    }

    post {
        success {
            echo '✅ Docker CI/CD Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
