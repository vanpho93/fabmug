docker rm -f $(docker ps -aq)
docker network prune
docker rmi $(docker images |grep 'fabmug')
