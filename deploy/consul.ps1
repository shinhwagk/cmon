. ($PSScriptRoot + "\" + "lib.ps1");

$name = "wex-consul";

Write-Output "delete docker ${name}."
$command = "docker stop ${name}; docker rm ${name}"
execCommand($command)

$command = "docker run --name wex-consul --hostname consul.monitor.wex.org -p 8600:8600/udp -p 8500:8500 -d consul agent -dev -client=0.0.0.0 -ui";

$docker_container_id = execCommand($command);

Out-File -FilePath "consul" -Encoding utf8 -InputObject $docker_container_id

Write-Output "docker ${name} startup, id: ${docker_container_id}.";

# docker run -d --name=dev-consul -e CONSUL_BIND_INTERFACE=eth0 consul
# docker exec -t dev-consul consul members


# docker run -d -p 8600:8600/udp -p 8500:8500 -e 'CONSUL_LOCAL_CONFIG={"leave_on_terminate": true}' consul agent -bind=0.0.0.0 retry-join=172.17.0.8 -ui

# docker run -d --name=dev-consul -p 8500:8500 -e CONSUL_BIND_INTERFACE=eth0 consul
# docker run -d -p 53:8600/udp consul agent -bind=0.0.0.0 -client=0.0.0.0 -retry-join=172.17.0.8172.17.0.8

docker run -d -h consul.monitor.wex.org -p 8500:8500 -p 8600:8600/udp consul agent -dev -ui -client 0.0.0.0