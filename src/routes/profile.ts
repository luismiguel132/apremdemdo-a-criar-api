import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export function profile(app: FastifyInstance) {
    app.addHook("onRequest", async (req, res) => {
        try {
            await req.jwtVerify()
        } catch (error) {
            return res.status(401).send({
                success: false,
                message: "Token inválido ou expirado"
            })
        }
    })

    app.get("/profile", async (req, res) => {
        try {
            const user = req.user as { id: string; email: string };
            
            const userData = await prisma.user.findUnique({
                where: { id: user.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            });

            if (!userData) {
                return res.status(404).send({
                    success: false,
                    message: "Usuário não encontrado"
                });
            }

            return res.status(200).send({
                success: true,
                user: userData
            });
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            return res.status(500).send({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    })
}