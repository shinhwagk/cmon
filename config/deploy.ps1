. (Join-Path -Path $PSScriptRoot -ChildPath ".." "deploy" "lib.ps1");

sendFiles @("os-script", "nginx.conf") "/opt/cmon/files"