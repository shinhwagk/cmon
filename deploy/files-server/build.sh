docker run -p 9008:80 --name linr-files-server -v `pwd`/nginx.conf:/etc/nginx/nginx.conf:ro -v `pwd`/files:/etc/nginx/html/files -d nginx
