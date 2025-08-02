import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from "zod"
import { hashPassword} from "../utils/hash";

export function createUser (app: FastifyInstance) {
    const createUserSchema = z.object({
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
        email: z.string().email("Email inválido"),
        password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres")
    })

    app.post("/user", async (req, res) => {
        try {
            const { name, email, password } = createUserSchema.parse(req.body);

            const existingUser = await prisma.user.findUnique({
                where: {email: email.toLowerCase()},
            });

            if (existingUser) {
                return res.status(400).send({
                    success: false,
                    message: "Este email já está em uso"
                })
            }

            const hashedPassword = await hashPassword(password)

            const user = await prisma.user.create({
                data: {
                    name: name.trim(),
                    email: email.toLowerCase().trim(),
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            });

            return res.status(201).send({
                success: true,
                message: "Usuário criado com sucesso",
                user
            });
        } catch (error: any) {
            console.error('Erro ao criar usuário:', error);
            
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