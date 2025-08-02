import fastify from "fastify"
import {createUser} from "./routes/create-user"
import fastifyJwt from "@fastify/jwt"
import { login } from "./routes/login"
import { profile } from "./routes/profile"
import fastifyCors from "@fastify/cors"

const app = fastify({
    logger: true
})

// Registrar CORS primeiro
app.register(fastifyCors, {
    origin: true,
    credentials: true
})

// Registrar JWT
app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "fallback-secret-change-this-in-production",
})

// Registrar rotas
app.register(createUser)  
app.register(login)
app.register(profile)

app.get("/", () => {
    return { 
        message: "API funcionando!",
        version: "1.0.0",
        status: "online"
    };
})

// Health check endpoint
app.get("/health", () => {
    return { 
        status: "healthy",
        timestamp: new Date().toISOString()
    };
})

const start = async () => {
    try {
        const port = process.env.PORT || 3333
        const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
        
        await app.listen({
            port: Number(port),
            host: host
        })
        
        console.log(`🚀 Server listening on http://${host}:${port}`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()