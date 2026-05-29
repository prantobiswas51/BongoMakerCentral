import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { dashboard } from '@/routes';

export default function Users() {
    return (
        <MainLayout>
            <div className="flex items-center">
                <h1 className="text-2xl font-bold">Users</h1>

                <button className="ml-auto bg-blue-500 text-white px-4 py-2 rounded">
                    <Link className='' href={dashboard()}>+ Add User</Link>
                </button>
            </div>
            <hr className="my-4 border-t border-gray-300" />


            {/* table view */}

            <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border rounded-md border-default">
                <table className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default bg-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Mobile
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Stock
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-neutral-primary border-b border-default">
                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                1
                            </th>
                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                Apple MacBook Pro 17"
                            </th>
                            <td className="px-6 py-4">
                                Silver
                            </td>
                            <td className="px-6 py-4">
                                Laptop
                            </td>
                            <td className="px-6 py-4">
                                $2999
                            </td>
                            <td className="px-6 py-4">
                                231
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>

        </MainLayout>
    )
}
