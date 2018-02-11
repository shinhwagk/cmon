# docker run --name gh-file-server -p 9008:80 -v ${pwd}\nginx.conf:/etc/nginx/nginx.conf:ro -v ${pwd}\files:/etc/nginx/html/files -d nginx
. (".\lib.ps1");

# $name = "wex-files";

# $docker_container_id = (Get-Content -Path "files" -Encoding UTF8 | Out-Null);

# Write-Output "delete docker ${name}."
# $command = "docker stop ${name}; docker rm ${name}"
# execCommand($command)

# sendFiles @("..\..\script\disk.sh", "..\..\script\cpustat.sh", "..\..\script\loadavg.sh") "/tmp/files/script";
# sendFiles @("nginx.conf") "/tmp/files";

# $command = "docker run --name wex-files --hostname files.monitor.wex.org -d -p 8001:80 -v /tmp/files/nginx.conf:/etc/nginx/nginx.conf:ro -v /tmp/files/script:/etc/nginx/html/files nginx";

# $docker_container_id = execCommand($command);

# Out-File -FilePath "files" -Encoding utf8 -InputObject $docker_container_id

# Write-Output "docker ${name} startup, id: ${docker_container_id}.";


# $content = (Get-Content -Path "abc.json" -Encoding UTF8)

# Invoke-WebRequest -Uri "http://10.65.193.51:8500/v1/agent/service/register" -Method Put -Body $content

# function files() {
#   sendFiles @(".\docker-compose.yml")  "/tmp/linr"
#   sendFiles @("..\script") "/tmp/linr/files"
#   $command = "cd /tmp/linr; docker-compose up -d files"

#   execCommand $command;
# }

function agent-sql() {
  $localDir = pwd

  cd ..\agent-sql
  tsc
  webpack

  cd $localDir

  sendFiles @(".\docker-compose.yml")  "/tmp/linr"
  # sendFiles @(".\agent-sql\instantclient-basic-linux.x64-12.2.0.1.0.zip")  "/tmp/linr/agent-sql"
  sendFiles @("..\agent-sql\Dockerfile", "..\agent-sql\dist\entrypoint.js")  "/tmp/linr/agent-sql"

  $command = "cd /tmp/linr; docker-compose build agent-sql"

  execCommand $command;
}

function consul() {
  sendFiles @(".\docker-compose.yml")  "/tmp/linr"

  $command = "cd /tmp/linr; docker-compose up -d consul; docker-compose ps"

  execCommand $command;
}

function influxdb(){
  sendFiles @(".\docker-compose.yml")  "/tmp/linr"
  $command = "cd /tmp/linr; docker-compose up -d influxdb; docker-compose ps"
  execCommand $command;
}

function chronograf(){
  sendFiles @(".\docker-compose.yml")  "/tmp/linr"
  $command = "cd /tmp/linr; docker-compose up -d chronograf; docker-compose ps"
  execCommand $command;
}

function test(){
  sendFiles @(".\docker-compose.yml")  "/tmp/linr"
  $command = "cd /tmp/linr; docker-compose up -d test; docker-compose ps"
  execCommand $command;
}

# files
# influxdb
# chronograf
# chronograf
# consul
# agent-sql
# sendFiles @(".\docker-compose.yml")  "/tmp/linr"