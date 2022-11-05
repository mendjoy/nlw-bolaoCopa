import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"

export function guessRoutes(fastify: FastifyInstance){

   //contagem de palpites
   fastify.get("/guesses/count", async () => {
    
    const count = await prisma.guess.count()

       return { count }

   })

}
 