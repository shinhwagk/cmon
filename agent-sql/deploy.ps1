$server_user = "root";
$server_ip = "10.65.193.51";

$consul_server = "10.65.193.51";

$files = @("dist/entrypoint.js");

$deploy_floder = "/tmp/agent-sql";

function execCommand($command) {
  return ssh ${server_user}@${server_ip} "${command}";
}

function scpFile($file) {
  $arg = "";
  if ((Get-Item ./${file}) -is [System.IO.DirectoryInfo]) {
    $arg = "-r";
  } 
  scp ${arg} ${file} ${server_user}@${server_ip}:${deploy_floder};
}

$command_mkdir_folder = "[ -e ""${deploy_floder}"" ] || mkdir -p ${deploy_floder}";

execCommand $command_mkdir_folder;

function sendFiles([array]$files) {
  foreach ($file in $files) {
    scpFile ${file};
  }
}

function register_service($url) {
  
}


function build_image(){

}