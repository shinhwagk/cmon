package main

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"path"
)

func main() {
	HTTPServer()
}

type ExecuteContent struct {
	Command string `json:"command"`
}

type ExecuteResult struct {
	Res string
}

func genScriptFilePath(name string) string{
	return path.Join("/","tmp",name,name+".sh")
}

func downFile(name string) (err error) {
	scriptPath := genScriptFilePath(name)
	out, err := os.Create(scriptPath)
	if err != nil {
		return err
	}
	defer out.Close()

	resp, err := http.Get("http://files.cmon.org:9501/files/script/" + name + ".sh")
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	_, err = io.Copy(out, resp.Body)
	println(resp.Body)
	if err != nil {
		return err
	}

	return nil
}

func executeCommand(name string) string {
	derr := downFile(name)
	if derr != nil {
		fmt.Println(derr)
		return "[]"
	}
	cmd := exec.Command("/bin/bash", genScriptFilePath(name))

	out, err := cmd.Output()

	if err != nil {
		fmt.Println(err)
		return "[]"
	}
	return string(out)
}

func readFile() func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		paths := strings.Split(r.URL.Path, "/")

		name := paths[len(paths)-1]
		fmt.Println(name)

		er := executeCommand(name)
		fmt.Println(er)
		fmt.Fprintf(w, er)
	}
}

// HTTPServer only Post
func HTTPServer() {
	http.HandleFunc("/v1/script/", readFile())
	server := &http.Server{Handler: nil}
	l, _ := net.Listen("tcp4", "0.0.0.0:8000")
	server.Serve(l)
}
