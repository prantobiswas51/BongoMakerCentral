import MainLayout from '@/layouts/MainLayout'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm, router } from '@inertiajs/react'
import { FormEvent, useState } from 'react'
import { Edit, Trash } from 'lucide-react'

type Company = {
    id: number
    name: string
    user_id: number
}

type CompanyProps = {
    companies: Company[]
}

export default function Company({ companies }: CompanyProps) {
    const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null)
    const {
        data,
        setData,
        post,
        patch,
        errors,
        processing,
        clearErrors,
        reset,
    } = useForm({
        name: '',
    })

    const addCompany = (event: FormEvent) => {
        event.preventDefault()

        post('/company', {
            preserveScroll: true,
            onSuccess: () => {
                reset('name')
            },
        })
    }

    const startEdit = (company: Company) => {
        clearErrors()
        setEditingCompanyId(company.id)
        setData('name', company.name)
    }

    const cancelEdit = () => {
        clearErrors()
        setEditingCompanyId(null)
        setData('name', '')
    }

    const saveEdit = (event: FormEvent, companyId: number) => {
        event.preventDefault()

        patch(`/company/${companyId}`, {
            preserveScroll: true,
            onSuccess: () => {
                cancelEdit()
            },
        })
    }

    const removeCompany = (companyId: number) => {
        router.delete(`/company/${companyId}`, {
            preserveScroll: true,
        })
    }

    return (
        <MainLayout>
            <div className="flex items-center">
                <h1 className="text-2xl font-bold">Companies</h1>
            </div>
            <hr className="my-4 border-t border-gray-300" />

            {/* start here */}
            <div className="flex justify-end">
                <form onSubmit={addCompany} className="mb-4 flex p-2">
                    <div className="flex-1">
                        <Input
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            placeholder="Enter home | company name"
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>
                    <Button type="submit" className='ml-2' disabled={processing}>
                        + Add Company | Home
                    </Button>
                </form>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                        {/* coloured accent bar at the top */}
                        <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-indigo-500" />

                        <div className="p-5">

                            {/* ── EDIT MODE ─────────────────────────────────────────── */}
                            {editingCompanyId === company.id ? (
                                <form onSubmit={(event) => saveEdit(event, company.id)} className="space-y-3">
                                    <Input
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        placeholder="Company name"
                                        className="text-sm"
                                    />
                                    <InputError message={errors.name} />
                                    <div className="flex gap-2 justify-end pt-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={cancelEdit}
                                            disabled={processing}
                                            className="text-xs h-8 px-3"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="text-xs h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                /* ── VIEW MODE ──────────────────────────────────────── */
                                <>
                                    {/* company initial avatar */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg flex items-center justify-center select-none">
                                            {company.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h2 className="text-base font-semibold text-gray-800 truncate">
                                            {company.name}
                                        </h2>
                                    </div>

                                    {/* action row */}
                                    <div className="flex gap-2 justify-end border-t border-gray-50 pt-3">
                                        <p
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => startEdit(company)}
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </p>
                                        <p
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => removeCompany(company.id)}
                                        >
                                            <Trash className="w-3.5 h-3.5" />
                                            Delete
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </MainLayout>
    )
}

