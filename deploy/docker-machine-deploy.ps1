param([string]$service)

. (".\lib.ps1");

function files() {
  sendFiles @("..\script", ".\nginx.conf") "/opt/linr/files/"
  docker-compose up -d files
}

function agent-sql() {
  $localDir = pwd

  cd ..\agent-sql; tsc; webpack;

  cd $localDir;

  # sendFiles @(".\agent-sql\instantclient-basic-linux.x64-12.2.0.1.0.zip")  "/tmp/linr/agent-sql"
  # sendFiles @("..\agent-sql\Dockerfile", "..\agent-sql\dist\entrypoint.js")  "/opt/linr/agent-sql"

  # docker-compose up -d agent-sql
}

function startService($s){
  if( $s -eq "agent-sql" ){
    agent-sql
  }
}

startService $service
dps