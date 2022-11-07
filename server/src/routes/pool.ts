import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from "zod"
import ShortUniqueId from  "short-unique-id"
import jwt from "@fastify/jwt"

export async function poolRoutes(fastify: FastifyInstance){

    //http://localhost:3333/pools/count - contagem de bolões
 fastify.get("/pools/count", async () => {
    
    const count = await prisma.pool.count()

       return { count }

   })

   //criar bolão
   fastify.post("/pools", async (request, reply) => {

    const createPoolBody = z.object({
        title:z.string(),

    })

    const { title } = createPoolBody.parse(request.body)

    const generate = new ShortUniqueId({ length: 6 })

    const code = String(generate()).toUpperCase()


    try{
        await request.jwtVerify()

        await prisma.pool.create({
            data:{
                title,
                code,
                ownerId: request.user.sub,

                participants:{
                    create:{
                        userId: request.user.sub,
                    }
                }
            }
        })
    

        //se chegar até aqui o usuario esta autenticado 
    }catch{
        await prisma.pool.create({
            data:{
                title,
                code
            }
        })

    }

   
    return reply.status(201).send({ code })

   })

}


 