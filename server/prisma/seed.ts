import { PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({

        data:{
            name: "Maria Eduarda",
            email: "mariaduds@gmail.com",
            avatarUrl: ""
            
        }
    })

    const pool = await prisma.pool.create({
        data:{
            title: "exemplo Pool",
            code: "BOL123",
            ownerId: user.id,

            participants: {
                create:{
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data:{
            date: "2022-11-03T22:39:36.150Z",
            firstTeamCountryCode: "DE",
            secondTeamCountryCode:"BR"
        }
    })

    await prisma.game.create({
        data:{
            date: "2022-11-04T22:39:36.150Z",
            firstTeamCountryCode: "BR",
            secondTeamCountryCode: "AR",

            guesses:{
                create:{
                    firstTeamPoints:2,
                    secondTeamPoints: 1,

                    participant:{
                        connect: {
                            userId_poolId:{
                                userId:user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }

            }

        }
    })
    
}

main()