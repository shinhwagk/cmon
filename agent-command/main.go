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
	cmd := exec.Command("sh", "-c", command)

	out, err := cmd.Output()

	if err != nil {
		fmt.Println(err)
		return ""
	}
	return string(out)
}

// HTTPServer only Post
func HTTPServer() {
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe("0.0.0.0:8000", nil))
}

// handler ...
func handler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	fmt.Println(body, string(body))
	data := ExecuteContent{}
	json.Unmarshal(body, &data)

	fmt.Println(data.Command)

	er := executeCommand(data.Command)

	if err != nil {
		fmt.Fprintf(w, "")
	}

	fmt.Fprintf(w, er)
}
