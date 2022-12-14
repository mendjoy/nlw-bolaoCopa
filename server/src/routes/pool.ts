import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from "zod"
import ShortUniqueId from  "short-unique-id"
import { authenticate } from "../plugins/authenticate"

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

   //entrar em um bolão (ja auntenticado)
   fastify.post("/pools/join", {
    onRequest: [authenticate]
   }, async (request, reply) => {

    const joinPoolBody = z.object({
        code: z.string(),
    })

    const { code } = joinPoolBody.parse(request.body)

    const pool = await prisma.pool.findUnique({
        where: {
            code,
        }, 
        include: {
            participants:{
                where:{
                    userId: request.user.sub,
                }
            }
        }
    })

    if(!pool){
        return reply.status(400).send({
            message:"Poll not find."
        })
    }

    if(pool.participants.length > 0){
        return reply.status(400).send({
            message:"You already joined this poll!."
        })
    }

    //se o bolão ainda não tiver um dono, o primeiro usuario que entra no bolão se torna o dono
    if(!pool.ownerId){
        await prisma.pool.update({
            where: {
                id:pool.id,
            }, 
            data:{
                ownerId: request.user.sub,
            }
        })
    }

    await prisma.participant.create({
        data: {
            poolId: pool.id,
            userId: request.user.sub,
        }
    })

    return reply.status(201).send()

   })

   //bolões que o usuario participa
   fastify.get("/pools", {
    onRequest: [authenticate]
   }, async (request) => {
    const pools  = await prisma.pool.findMany({
        where:{
            participants:{
                some:{
                    userId: request.user.sub,
                }
            }
        },
        include:{ //mostra a contagem de participantes 
            _count:{
                select:{
                    participants:true,
                }
            },
            participants:{ //retorna o id dos ultimos 4 participantes
                select:{
                    id: true,
                    user: { //retorna a imagem dos participantes
                        select:{
                            avatarUrl: true,
                        }
                    },
                },
                take:4,
            },
            owner: { //mostra quem é o dono do bolão
                select:{
                    id: true,
                    name:true,
                }
            }
        }
    })

    return{ pools }

   })
   
   //mostrar dados detalhados do bolão
   fastify.get("/pools/:id", {
    onRequest: [authenticate], 
   }, async (request) => {

    const getPoolParams = z.object({
        id: z.string(),
    })

    const { id } = getPoolParams.parse(request.params)

    const pool  = await prisma.pool.findUnique({
        where:{
           id,
        },
        include:{ //mostra a contagem de participantes 
            _count:{
                select:{
                    participants:true,
                }
            },
            participants:{ //retorna o id dos ultimos 4 participantes
                select:{
                    id: true,
                    user: { //retorna a imagem dos participantes
                        select:{
                            avatarUrl: true,
                        }
                    },
                },
                take:4,
            },
            owner: { //mostra quem é o dono do bolão
                select:{
                    id: true,
                    name:true,
                }
            }
        }
    })

    return { pool }

   })
}


 