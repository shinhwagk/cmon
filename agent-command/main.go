package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
)

func main() {
	// executeCommand("")
	HTTPServer()
}

type ExecuteContent struct {
	Command string `json:"command"`
}

type ExecuteResult struct {
	Res string
}

func executeCommand(command string) string {
	cmd := exec.Command("/bin/bash", command)

	out, err := cmd.Output()

	if err != nil {
		return ""
	}
	return string(out)
}

// HTTPServer only Post
func HTTPServer() {
	http.HandleFunc("/v1/execute", handler)
	log.Fatal(http.ListenAndServe("0.0.0.0:8000", nil))
}

// handler ...
func handler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	data := ExecuteContent{}
	json.Unmarshal(body, &data)

	er := executeCommand(data.Command)

	if err != nil {
		fmt.Fprintf(w, "")
	}
	fmt.Fprintf(w, er.Res)
}

