import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import AppLogoIcon from '@/components/app-logo-icon'

import { Building, Camera, Computer, DoorOpen, FileText, LayoutDashboard, Lock, User, Users } from 'lucide-react'
import { dashboard, doorlocks, cameras, users, logout, company, devices, members } from '@/routes'

type Props = {
    children: ReactNode
}

export default function MainLayout({ children }: Props) {
    const { url } = usePage()

    const dashboardUrl = dashboard.url()
    const doorlocksUrl = doorlocks.url()
    const usersUrl = users.url()
    const companyUrl = company.url()
    const devicesUrl = devices.url()
    const camerasUrl = cameras.url()
    const membersUrl = members.url()

    const normalize = (href: string) => {
        try {
            return new URL(href).pathname
        } catch {
            return href
        }
    }

    const isActive = (href: string) => url === normalize(href)

    return (
        <div className="min-h-screen font-ubuntu flex">

            <div className="w-72 bg-gray-800 text-white p-6 flex flex-col">

                <div className="flex items-center justify-center">
                    <AppLogoIcon className="fill-current text-white" />
                </div>

                <div className="py-4 text-center">
                    BongoMaker Central Panel
                </div>

                <div className="hr my-4 border-t border-gray-700"></div>

                <nav className="flex flex-col gap-2">
                    
                    <Link
                        href={dashboard()}
                        className={`px-4 py-2 text-sm rounded-lg transition ${isActive(dashboardUrl) ? 'bg-sky-700' : 'hover:bg-sky-800'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </span>
                    </Link>

                    <Link
                        href={company()}
                        className={`px-4 py-2 text-sm rounded-lg transition ${isActive(companyUrl) ? 'bg-sky-700' : 'hover:bg-sky-800'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Company | Home
                        </span>
                    </Link>

                    <Link
                        href={devices()}
                        className={`px-4 py-2 text-sm rounded-lg transition ${isActive(devicesUrl) ? 'bg-sky-700' : 'hover:bg-sky-800'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Computer className="h-4 w-4" />
                            Devices
                        </span>
                    </Link>

                    <Link
                        href={members()}
                        className={`px-4 py-2 text-sm rounded-lg transition ${isActive(membersUrl) ? 'bg-sky-700' : 'hover:bg-sky-800'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Members
                        </span>
                    </Link>

                    <Link
                        href={doorlocks()}
                        className={`px-4 py-2 text-sm rounded-lg transition ${isActive(doorlocksUrl) ? 'bg-sky-700' : 'hover:bg-sky-800'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Doorlocks
                        </span>
                    </Link>

                    
                    <Link
                        href={cameras()}
                        className={`px-4 py-2 text-sm rounded-lg transition ${isActive(camerasUrl) ? 'bg-sky-700' : 'hover:bg-sky-800'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Cameras
                        </span>
                    </Link>
                   

                    <Link
                        href={users()}
                        className={`px-4 py-2 text-sm rounded-lg transition ${isActive(usersUrl) ? 'bg-sky-700' : 'hover:bg-sky-800'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Users
                        </span>
                    </Link>

                    <Link className='px-4 py-2 text-sm rounded-lg transition' href={logout()}>
                    <span className="flex items-center gap-2">
                        <DoorOpen className="h-4 w-4" />Logout
                        </span>
                    </Link>
                </nav>

                <div className="mt-auto text-white">
                    <Link className='cursor-pointer p-2 w-full items-center flex text-left'>
                        <FileText className="h-4 w-4 mr-2" />API Docs
                    </Link>
                    <div className="p-2">All rights © 2026 BongoMaker</div>
                </div>
            </div>

            <div className="flex-1 p-6 bg-gray-100">{children}</div>
        </div>
    )
}
