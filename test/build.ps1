. (Join-Path -Path $PSScriptRoot -ChildPath ".." "deploy" "lib.ps1");

sendFiles @("dist/entrypoint.js", "Dockerfile") "/tmp/linr/tasks"

$buildImageCommand = "docker build -t linr/task- /tmp/linr/tasks"

execCommand $buildImageCommand;