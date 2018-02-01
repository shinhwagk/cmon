package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
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

func downFile(name string) (err error) {
	out, err := os.Create("/tmp/" + name + ".sh")
	if err != nil {
		return err
	}
	defer out.Close()

	resp, err := http.Get("http://10.65.193.51:9008/files/" + name + ".sh")
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
		return ""
	}
	cmd := exec.Command("/bin/bash", "/tmp/"+name+".sh")

	out, err := cmd.Output()

	if err != nil {
		fmt.Println(err)
		return ""
	}
	return string(out)
}

func readFile() func(http.ResponseWriter, *http.Request) {
	// dat, _ := ioutil.ReadFile("./disk.sh")

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
	log.Fatal(http.ListenAndServe("0.0.0.0:8000", nil))
}

// func scriptHandler(w http.ResponseWriter, r *http.Request) {

// }

// // command handler ...
// func commandHandler(w http.ResponseWriter, r *http.Request) {
// 	// body, err := ioutil.ReadAll(r.Body)
// 	// body := readFile()

// 	// // fmt.Println(body, string(body))
// 	// // data := ExecuteContent{}
// 	// // json.Unmarshal(body, &data)

// 	// // fmt.Println(data.Command)

// 	// er := executeCommand(body)
// 	// fmt.Println(er)
// 	// // if err != nil {
// 	// // 	fmt.Fprintf(w, "")
// 	// // }

// 	// fmt.Fprintf(w, er)
// }
