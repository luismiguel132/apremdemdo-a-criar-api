import fastify from "fastify"
import {createUser} from "./routes/create-user"

const app = fastify()

app.register(createUser)

app.get("/", () => {
    return "hello word";
})

app.listen({
    port: 3333
}).then(() => console.log("server listening on pot http://localhost:3333"))