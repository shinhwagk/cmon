import * as http from "http";

const server = http.createServer((req, res) => {
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);

interface ABC {
    d(a: string): void;
}

class cxx {
    actionAbc(abc: ABC) {
        abc.d("ssss")
    }
}
const c = new cxx()
c.actionAbc((x: string) => console.info(x))
