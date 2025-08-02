import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { verifyPassword } from "../utils/hash";

export function login (app: FastifyInstance) {
    const loginSchema = z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(1, "Senha é obrigatória")
    })
    
    app.post('/login', async (req, res) => {
        try {
            const { email, password } = loginSchema.parse(req.body)

            const user = await prisma.user.findUnique({
                where: {email: email.toLowerCase()},
            });

            if(!user) {
                return res.status(401).send({ 
                    success: false,
                    message: "Email ou senha incorretos" 
                })
            }

            const isPasswordValid = await verifyPassword(password, user.password)

            if(!isPasswordValid) {
                return res.status(401).send({
                    success: false,
                    message: "Email ou senha incorretos"
                })
            }

            const token = app.jwt.sign({
                id: user.id, 
                email: user.email
            }, {
                expiresIn: '7d'
            })

            return res.status(200).send({
                success: true,
                message: "Login realizado com sucesso",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            })
        } catch (error: any) {
            console.error('Erro no login:', error);
            
            if (error.issues) {
                return res.status(400).send({
                    success: false,
                    message: error.issues[0].message
                });
            }
            
            return res.status(500).send({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    })
}