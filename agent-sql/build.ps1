. ("${PSScriptRoot}\..\deploy\lib.ps1");

$workHome = "/tmp/linr/agent-sql"

sendFiles @("instantclient-basic-linux.x64-12.2.0.1.0", "dist/entrypoint.js", "Dockerfile") $workHome

$buildImageCommand = "docker build -t linr/agent-sql ${workHome}"

execCommand $buildImageCommand;