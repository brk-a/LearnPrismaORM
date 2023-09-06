import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions = {
            //configure prisma adaptor
    adapter: PrismaAdapter(prisma),
            // Configure one or more authentication providers
    providers: [
        DiscordProvider({
        clientId: String(process.env.DISCORD_CLIENT_ID),
        clientSecret: String(process.env.DISCORD_CLIENT_SECRET),
        }),
        // ...add more providers here
    ],
} // as AuthOption

export default NextAuth(authOptions)