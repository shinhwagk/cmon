package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	// "github.com/gorilla/mux"
)

func main() {
	// executeCommand("")
	HTTPServer()
}

type ExecuteContent struct {
	Command string `json:"command"`
}

type ExecuteResult struct {
	Err string
	Res string
}

func executeCommand(command string) *ExecuteResult {
	cmd := exec.Command("echo", command)

	out, err := cmd.Output()

	if err != nil {
		return &ExecuteResult{err.Error(), "nil"}
	}
	return &ExecuteResult{"nil", string(out)}
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
		fmt.Fprintf(w, err.Error())
	}
	fmt.Fprintf(w, er.Res)
}

