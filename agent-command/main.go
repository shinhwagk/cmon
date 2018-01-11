package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {

	resp, err := http.Get("http://baidu.com/")
	if err != nil {
		// handle error
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))
}

type Task struct {
}

type ConsulService struct {
}

// func aaa(str string, ch chan<- string) {
// 	fmt.Println(str)
// 	// ch <- str
// }
