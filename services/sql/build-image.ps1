. (Join-Path -Path $PSScriptRoot ".." "deploy" "lib.ps1");

webpack --mode development

$image_build_home = "/tmp/cmon/agent-sql"

# sendFiles @("instantclient-basic-linux.x64-12.2.0.1.0.zip") $project_home
# execCommand "cd ${project_home}; unzip instantclient-basic-linux.x64-12.2.0.1.0.zip"

sendFiles @("dist/entrypoint.js", "Dockerfile") $image_build_home;

$buildImageCommand = "cd ${image_build_home}; docker build -t cmon/agent-sql .";

execCommand $buildImageCommand;

execCommand "docker images | grep agent-sql";