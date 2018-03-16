param([String]$tn);

. (Join-Path -Path $PSScriptRoot ".." "deploy" "lib.ps1");

Set-Location ../tasks; tsc; Set-Location $PSScriptRoot

$TaskName = $tn

webpack --env.task=$TaskName --mode development

sendFiles @("dist/entrypoint.js", "Dockerfile") "/tmp/cmon/tasks/${TaskName}"

$buildImageCommand = "docker build -t cmon/task/${TaskName} /tmp/cmon/tasks/${TaskName}"

execCommand $buildImageCommand;