import { FastifyInstance } from "fastify"
import { authenticate } from "../plugins/authenticate"
import { z } from "zod"
import { prisma } from "../lib/prisma"

//listagem dos jogos 
export async function gameRoutes(fastify: FastifyInstance){

    fastify.get("pools/:id/games", {
        onRequest: [authenticate],
    }, async (request) => {
        const getPoolParam = z.object({
            id : z.string(),
        })

        const { id } = getPoolParam.parse(request.params)

        const games = await prisma.game.findMany({
            orderBy: { //ordenar os jogos por data de criação (mais recentes)
                date: "desc",

            },
            include:{
                guesses:{
                    where:{
                        participant:{
                            userId: request.user.sub,
                            poolId: id,
                        }
                    }
                }
            }
        })

        return {
            games: games.map(game => {
                return {
                    ...game,
                    guess: game.guesses.length > 0 ? game.guesses[0] : null,
                    guesses: undefined, 
                }
            })
         }
    })

    

}
 