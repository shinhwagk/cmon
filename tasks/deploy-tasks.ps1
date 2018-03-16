param([String]$tn);

. (Join-Path -Path $PSScriptRoot -ChildPath ".." "deploy" "lib.ps1");

./build-image.ps1 -tn $tn

function tasks() {
    docker-compose -f ../deploy/docker-compose.yml -f docker-compose.tasks.yml up -d --force-recreate $tn;
    docker-compose -f ../deploy/docker-compose.yml -f docker-compose.tasks.yml ps
}

tasks