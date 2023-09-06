import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import { getServerSession } from "next-auth"
import Stripe from "stripe"

const prisma = new PrismaClient()

export const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
    apiVersion: '2023-08-16',
})

export const createCheckoutLink = async (customer: string) => {
    const checkout = await stripe.checkout.sessions.create({
        success_url: String(process.env.SUCCESS_URL),
        cancel_url: String(process.env.CANCEL_URL),
        customer: customer,
        line_items: [
            {
                price: String(process.env.PRICE_1),
            },
        ],
        mode: "subscription",
    })
}

export const hasSubscription = async () => {
    const session = await getServerSession(authOptions)
    if (session) {
        const user = prisma.user.findFirst({
            where: {
                email: session?.user?.email
            },
        })

        const subscriptions = await stripe.subscriptions.list({
            customer: String(user?.stripe_customer_id)
        })

        return subscriptions.data.length > 0
    }

    return false
}

export const createCustomer = async () => {
    const session = await getServerSession(authOptions)
    if (session) {
        const user = prisma.user.findFirst({
            where: {
                email: session.user?.email
            },
        })

        if (!user?.api_key) {
            await prisma.users.update({
                where: {
                    id: user?.id,
                },
                data: {
                    api_key: `secret_${randomUUID()}`,
                },
            })
        }

        if (!user?.stripe_customer_id) {
            const customer = await stripe.customers.create({
                email: String(user?.email)
            })
            await prisma.users.update({
                where: {
                    id: user?.id,
                },
                data: {
                    stripe_customer_id: customer.id,
                },
            })
        }

        const user2 = prisma.user.findFirst({
            where: {
                email: session.user?.email
            },
        })
        return user2?.stripe_customer_id
    }
}