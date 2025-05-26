## test with devnet
dev env uses JSON-RPC 0.7.1

run `docker-compose up -d` to start the dev env

You'll need to add devnet as a service. 
Also to make it work you need to login into minio (at http://localhost:9001, username minioadmin and password is the same) 
and create an access key with the same values as the AWS access key specified in the docker compose
