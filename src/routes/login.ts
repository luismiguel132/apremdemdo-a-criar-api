import { FastifyInstance } from "fastify";
import { email, z } from "zod";
import { prisma } from "../lib/prisma";
import { verifyPassword } from "../utils/hash";
import { send } from "process";

export function login (app: FastifyInstance) {
    const loginSchema = z.object({
        email: z.string(),
        password: z.string()
    })
    app.post('/login', async (req, res) => {

        const { email, password } = loginSchema.parse(req.body)

        const user = await prisma.user.findUnique({
            where: {email},
        });

        if(!user) {
            return res.status(400).send({ message: "User not found" })
        }

        const isPassword = await verifyPassword(password, user.password)

        if(!isPassword) {
            return res.status(400).send({menssage: "invalid Password"})
        }

        const token = app.jwt.sign({id: user.id, email: user.email})

        return res.status(200).send({token})

    })
}