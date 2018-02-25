# $server_user = "root";
$machine = "linr";
docker-machine env $machine | Invoke-Expression

$consul_server = "10.65.193.51";

# $files = @("src", "build.sh", "Dockerfile", "entrypoint.sh", "package-lock.json", "package.json", "tsconfig.json");

# $deploy_floder = "/tmp/agent-sql";

function execCommand([string]$command) {
    docker-machine ssh ${machine} "${command}";
}

function scpFile($file, $deploy_floder) {
    $arg = "";
    if ((Get-Item ./${file}) -is [System.IO.DirectoryInfo]) {
        $arg = "-r";
    }
    docker-machine scp ${arg} ${file} ${machine}:${deploy_floder};
}

function checkFileExist($path, $file) {
    $num = docker-machine ssh $machine "ls ${path}/${file} | wc -l"
    return $num
}

function sendFiles([array]$files, $deploy_floder, $exist = $true) {
    $command_mkdir_folder = "[ -e ""${deploy_floder}"" ] || mkdir -p ${deploy_floder}";
    execCommand $command_mkdir_folder;
	
    foreach ($file in $files) {
        scpFile ${file} ${deploy_floder};
    }
}

function register_service($url) {
  
}

function docker_run($name, $posts) {
	
}

function dps() {
    docker-compose ps
}
