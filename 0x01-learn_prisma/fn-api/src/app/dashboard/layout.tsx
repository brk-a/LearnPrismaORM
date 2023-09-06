import Header from '@/components/header'
import { authenticateUser } from '@/lib/auth'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await authenticateUser()

    return (
        <div className=''>
            <Header />
            <div className='max-w-5xl m-auto w-full px-4'>
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout