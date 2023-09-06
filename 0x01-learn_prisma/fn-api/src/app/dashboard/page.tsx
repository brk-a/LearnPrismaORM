import { createCheckoutLink, createCustomer, hasSubscription, stripe } from '@/lib/stripe'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

const prisma = new PrismaClient()

const Page = async () => {
    const session = await getServerSession(authOptions)
    const customer = await createCustomer()
    const hasSub = await hasSubscription()
    const checkoutLink = await createCheckoutLink(String(customer))

    const user = await prisma.user.findFrist({
        where: {
            email: session?.user?.email,
        },
    })
    const top10RecentLog = await prisma.log.findMany({
        where: {
            userId: user?.id,
        },
        orderBy: {
            created: "desc",
        },
        take: 10,
    })

    let currentUsage = 0
    if(hasSub){
        const subscriptions = await stripe.subscriptions.list({
            customer: String(user?.stripe_customer_id)
        })
        const invoice = await stripe.invoices.retrieveUpcoming({
            subscription: subscriptions.data.at(0)?.id,
        })
        currentUsage = invoice.amount_due
    }
    return (
        <main>
            {hasSub ? (
                <>
                    <div className='flex flex-col gap-4'>
                        <div className='px-4 py-2 bg-emerald-400 font-medium text-sm text-white rounded-md'>
                            You have a subscription.
                        </div>
                        <div className='divide-y divide-zinc-200 border border-zinc-200 rounded-md'>
                            <p className='text-sm text-black px-6 py-4'>Current Usage</p>
                            <p className='text-sm font-mono text-zinc-800 px-6 py-4 font-medium'>
                                USD {(currentUsage/100).toLocaleString('en-us', {minimumFractionDigits: 2})}
                            </p>
                        </div>
                        <div className='divide-y divide-zinc-200 border border-zinc-200 rounded-md'>
                            <p className='text-sm text-black px-6 py-4'>API Key</p>
                            <p className='text-sm font-mono text-zinc-800 px-6 py-4 font-medium'>
                                {user?.api_key}
                            </p>
                        </div>
                        <div className='divide-y divide-zinc-200 border border-zinc-200 rounded-md'>
                            <p className='text-sm text-black px-6 py-4'>Log Events</p>
                            <>
                                {top10RecentLog.map((log: any, i: any) => (
                                    <div key={i} className='flex items-center gap-4'>
                                        <p className='text-sm font-mono text-zinc-800 px-6 py-4 font-medium'>
                                            {log.method}
                                        </p>
                                        <p className='text-sm font-mono text-zinc-800 px-6 py-4 font-medium'>
                                            {log.status}
                                        </p>
                                        <p className='text-sm font-mono text-zinc-800 px-6 py-4 font-medium'>
                                            {log.created.toDateString()}
                                        </p>
                                    </div>
                                ))}
                            </>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='min-h-[60vh] grid place-items-center rounded-lg px-6 py-10 bg-slate-100'>
                        <Link href={String(checkoutLink)} className='font-medium text-base hover:underline'>
                            You have no subscription. Checkout now.
                        </Link>
                    </div>
                </>
            )}
        </main>
    )
}

export default Page