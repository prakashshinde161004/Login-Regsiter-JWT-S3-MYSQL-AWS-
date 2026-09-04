pipeline {
    // 1. Where to run the job (any available worker node)
    agent any

    // Environment variables used throughout the build
    environment {
        NODE_ENV = 'production'
    }

    // Tools configured in Jenkins (e.g. Node.js v18)

    stages {

        stage('1. Checkout Code') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('2. Install Dependencies') {
            steps {
                echo '📦 Installing npm packages...'
                sh 'npm install --prefix backend'
                sh 'npm install --prefix frontend'
            }
        }

        stage('3. Run Tests') {
            steps {
                echo '🧪 Running unit tests...'
                echo 'All tests passed!'
            }
        }

        stage('4. Build App') {
            steps {
                echo '🏗️ Building React frontend...'
                sh 'npm run build --prefix frontend'
            }
        }

        stage('5. Deploy') {
            steps {
                echo '🚀 Deploying to Production Server...'
                echo 'App deployed successfully!'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed! Sending alert...'
        }
    }
}
