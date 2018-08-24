defaultPodTemplate {
    nodeTemplate {
      node('node') {
        def scmVars

        stage("Checkout source") {
          scmVars = checkout scm
        }
        stage("Install") {
          npm 'install'
        }

        stage("Test") {
          npm 'test'
        }
      }
    }
  }
