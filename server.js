import { Server } from "node:http";
import {readFile} from "fs/promises";

const server = new Server((req, res) => {
    console.log(`incoming: ${req.method} ${req.url}`);
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });

        readFile("./index.html").then((data) => {
            res.write(data);
            res.end();
        });
    } else if (req.url === "/countdown") {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          });
        let count = 10;

        const interval = setInterval(() => {
            res.write("event: countdown\n");
            res.write(`data: ${count}\n\n`);
            count--;
            if (count === 0) {
                clearInterval(interval);
                res.end();
            }
        }, 1000);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("Not found");
    }
});


server.listen(3000, () => {
    console.log("Server is running on port 3000");
});