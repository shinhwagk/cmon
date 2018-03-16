# docker run --name gh-file-server -p 9008:80 -v ${pwd}\nginx.conf:/etc/nginx/nginx.conf:ro -v ${pwd}\files:/etc/nginx/html/files -d nginx
. (Join-Path -Path $PSScriptRoot -ChildPath "lib.ps1");

sendFiles @("docker-compose.yml") "/opt/cmon"
Write-Output "ddocker-compose.yml send success."

# $name = "wex-files";

# $docker_container_id = (Get-Content -Path "files" -Encoding UTF8 | Out-Null);

# Write-Output "delete docker ${name}.";
# $command = "docker stop ${name}; docker rm ${name}";
# execCommand($command);

# sendFiles @("..\..\script\disk.sh", "..\..\script\cpustat.sh", "..\..\script\loadavg.sh") "/tmp/files/script";
# sendFiles @("nginx.conf") "/tmp/files";

# $command = "docker run --name wex-files --hostname files.monitor.wex.org -d -p 8001:80 -v /tmp/files/nginx.conf:/etc/nginx/nginx.conf:ro -v /tmp/files/script:/etc/nginx/html/files nginx";

# $docker_container_id = execCommand($command);

# Out-File -FilePath "files" -Encoding utf8 -InputObject $docker_container_id

# Write-Output "docker ${name} startup, id: ${docker_container_id}.";


# $content = (Get-Content -Path "abc.json" -Encoding UTF8)

# Invoke-WebRequest -Uri "http://10.65.193.51:8500/v1/agent/service/register" -Method Put -Body $content

$cmon_home = "/opt/cmon"

$upParam = "-d --force-recreate"

function files() {
    # ../script/deploy.ps1
    # $command = "cd ${cmon_home}; docker-compose up -d files"
    docker-compose up $upParam files 
    # execCommand $command;
}

function agent-sql() {
    docker-compose up -d --force-recreate agent-sql
}

# function consul() {
#     $command = "cd /tmp/cmon; docker-compose up -d consul; docker-compose ps"
#     execCommand $command;
# }

function influxdb() {
    $command = "cd ${cmon_home}; docker-compose up -d influxdb; docker-compose ps"
    execCommand $command;
}

function chronograf() {
    $command = "cd ${cmon_home}; docker-compose up -d chronograf; docker-compose ps"
    execCommand $command;
}

# files
# influxdb
# chronograf
# consul
agent-sql