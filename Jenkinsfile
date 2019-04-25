pipeline {
    agent any
    environment {
        OPENURL = "market.xingstation.net"
    }
    options {
        buildDiscarder(logRotator(numToKeepStr:'5'))
    }

    stages {
        stage ('clone code') {
            steps {
           git branch: 'develop', credentialsId: 'gitlab-yangxuan', url: 'http://192.168.2.126/actiview-shop/xingstation-shop-pc.git'
        }
       }
        stage('Build') {
            steps {
                echo 'Building..'
                sh '''
               export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:/var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/node/bin:$PATH"
               if [ ! -d predist ]; then
                  mkdir predist
              else
                  echo "dir is  exist"     
               fi
              if [ ! -d dist ]; then
                  mkdir dist
             else
             echo "dir is  exist"     
              fi
               yarn && yarn run test 
              cd dist && tar zcf shop-pc.tar.gz ./*
                 '''
            }
        }
        stage('Deploy') {
            steps {
                sshPublisher(publishers: [sshPublisherDesc(configName: '星视度测试', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''cd  dev-shop-pc
sudo tar xf  shop-pc.tar.gz -C /data/code/xingstation-shop/xingstation-shop-pc/dist
sudo chown -R larryz:larryz  /data/code/xingstation-shop/xingstation-shop-pc/dist''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: 'dev-shop-pc', remoteDirectorySDF: false, removePrefix: 'dist', sourceFiles: 'dist/*.tar.gz')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])

            }
        }
     stage('delete') {
          steps {
       sh '''cd /var/lib/jenkins/workspace/xingstation-shop-pc/dist
            rm -fr *.tar.gz
           ssh -p 22 larryz@120.27.138.242 " cd /home/larryz/dev-shop-pc && rm -fr *.tar.gz"'''
      }
      }
    }
 post {
        success {
            dingTalk accessToken: 'https://oapi.dingtalk.com/robot/send?access_token=c2b5aefc27d45133cd20e691365fabf2a8f6b4efe03eb92e2ccf928b85430405', imageUrl: '', jenkinsUrl: 'http://jenkins.ngrok.actiview.com/',
            message: "应用构建成功！", notifyPeople: ''
            echo "应用部署成功,  访问地址为:  ${env.OPENURL}"
    
            
        }
        failure {
            dingTalk accessToken: 'https://oapi.dingtalk.com/robot/send?access_token=c2b5aefc27d45133cd20e691365fabf2a8f6b4efe03eb92e2ccf928b85430405', jenkinsUrl: 'http://jenkins.ngrok.actiview.com/',
            message: "应用构建失败,请及时查看问题原因！", notifyPeople: ''
        }
        
    }
}