package main

import (
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
	cmd := exec.Command("/bin/bash", "-c", command)

	out, err := cmd.Output()

	if err != nil {
		fmt.Println(err)
		return ""
	}
	return string(out)
}

func readFile() func(http.ResponseWriter, *http.Request) {
	dat, _ := ioutil.ReadFile("./disk.sh")

	return func(w http.ResponseWriter, r *http.Request) {
		er := executeCommand(string(dat))
		fmt.Println(er)
		fmt.Fprintf(w, er)
	}

}

// HTTPServer only Post
func HTTPServer() {
	http.HandleFunc("/command", readFile())
	http.HandleFunc("/script", scriptHandler)
	log.Fatal(http.ListenAndServe("0.0.0.0:8000", nil))
}

func scriptHandler(w http.ResponseWriter, r *http.Request) {

}

// command handler ...
func commandHandler(w http.ResponseWriter, r *http.Request) {
	// body, err := ioutil.ReadAll(r.Body)
	// body := readFile()

	// // fmt.Println(body, string(body))
	// // data := ExecuteContent{}
	// // json.Unmarshal(body, &data)

	// // fmt.Println(data.Command)

	// er := executeCommand(body)
	// fmt.Println(er)
	// // if err != nil {
	// // 	fmt.Fprintf(w, "")
	// // }

	// fmt.Fprintf(w, er)
}
