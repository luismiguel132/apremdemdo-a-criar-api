import fastify from "fastify"
import {createUser} from "./routes/create-user"
import fastifyJwt from "@fastify/jwt"
import { login } from "./routes/login"
import { profile } from "./routes/profile"

const app = fastify()

app.register(createUser)  
app.register(login)
app.register(profile)


app.register(fastifyJwt, {
    secret: "secret",
})

app.get("/", () => {
    return "hello word";
})

const port = process.env.PORT || 3333;

app.listen({
    port: 3333,
    host: '0.0.0.0'
}).then(() => console.log(`Server listening on port ${port}`))