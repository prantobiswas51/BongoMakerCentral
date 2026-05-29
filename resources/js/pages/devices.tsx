import MainLayout from '@/layouts/MainLayout';
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { router, useForm } from '@inertiajs/react'
import { Edit, Trash } from 'lucide-react'
import { FormEvent, useState } from 'react'

type Company = {
    id: number
    name: string
}

type Device = {
    id: number
    name: string
    device_id: string
    type: 'doorlock' | 'camera'
    company_id: number
    company: {
        id: number
        name: string
    }
}

type DevicesProps = {
    companies: Company[]
    devices: Device[]
}

export default function Devices({ companies, devices }: DevicesProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingDeviceId, setEditingDeviceId] = useState<number | null>(null)

    const {
        data,
        setData,
        post,
        patch,
        errors,
        processing,
        reset,
        clearErrors,
    } = useForm({
        name: '',
        device_id: '',
        type: 'doorlock',
        company_id: companies[0]?.id?.toString() ?? '',
    })

    const addDevice = (event: FormEvent) => {
        event.preventDefault()

        post('/devices', {
            preserveScroll: true,
            onSuccess: () => {
                reset('name', 'device_id')
                setData('type', 'doorlock')
                setData('company_id', companies[0]?.id?.toString() ?? '')
                setIsCreateDialogOpen(false)
            },
        })
    }

    const startEdit = (device: Device) => {
        clearErrors()
        setEditingDeviceId(device.id)
        setData('name', device.name)
        setData('device_id', device.device_id)
        setData('type', device.type)
        setData('company_id', device.company_id.toString())
    }

    const cancelEdit = () => {
        clearErrors()
        setEditingDeviceId(null)
        reset('name', 'device_id')
        setData('type', 'doorlock')
        setData('company_id', companies[0]?.id?.toString() ?? '')
    }

    const saveEdit = (event: FormEvent, deviceId: number) => {
        event.preventDefault()

        patch(`/devices/${deviceId}`, {
            preserveScroll: true,
            onSuccess: () => {
                cancelEdit()
            },
        })
    }

    const removeDevice = (deviceId: number) => {
        router.delete(`/devices/${deviceId}`, {
            preserveScroll: true,
        })
    }

    return (
        <MainLayout>
            <div className="flex items-center">
                <h1 className="text-2xl font-bold">Devices</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="ml-auto">+ Add Device</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Device</DialogTitle>
                            <DialogDescription>Enter device details and save.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={addDevice} className="space-y-3">
                            <div>
                                <Input
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    placeholder="Device name"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <Input
                                    value={data.device_id}
                                    onChange={(event) => setData('device_id', event.target.value)}
                                    placeholder="Device ID"
                                />
                                <InputError message={errors.device_id} className="mt-1" />
                            </div>

                            <div>
                                <select
                                    value={data.type}
                                    onChange={(event) => setData('type', event.target.value)}
                                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                >
                                    <option value="doorlock">Doorlock</option>
                                    <option value="camera">Camera</option>
                                </select>
                                <InputError message={errors.type} className="mt-1" />
                            </div>

                            <div>
                                <select
                                    value={data.company_id}
                                    onChange={(event) => setData('company_id', event.target.value)}
                                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                >
                                    <option value="">Select company</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id.toString()}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.company_id} className="mt-1" />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Save Device
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <hr className="my-4 border-t border-gray-300" />


            {/* start here */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {devices.map((device) => (
                    <div
                        key={device.id}
                        className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                        <div className="h-1 w-full bg-linear-to-r from-sky-400 to-indigo-500" />

                        <div className="p-5">
                            {editingDeviceId === device.id ? (
                                <form onSubmit={(event) => saveEdit(event, device.id)} className="space-y-3">
                                    <Input
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        placeholder="Device name"
                                        className="text-sm"
                                    />
                                    <InputError message={errors.name} />

                                    <Input
                                        value={data.device_id}
                                        onChange={(event) => setData('device_id', event.target.value)}
                                        placeholder="Device ID"
                                        className="text-sm"
                                    />
                                    <InputError message={errors.device_id} />

                                    <select
                                        value={data.type}
                                        onChange={(event) => setData('type', event.target.value)}
                                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                    >
                                        <option value="doorlock">Doorlock</option>
                                        <option value="camera">Camera</option>
                                    </select>
                                    <InputError message={errors.type} />

                                    <select
                                        value={data.company_id}
                                        onChange={(event) => setData('company_id', event.target.value)}
                                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                    >
                                        <option value="">Select company</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id.toString()}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.company_id} />

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
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg flex items-center justify-center select-none">
                                            {device.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-base font-semibold text-gray-800 truncate">
                                                {device.name}
                                            </h2>
                                            <p className="text-xs text-gray-500">{device.device_id}</p>
                                        </div>
                                    </div>

                                    <div className="mb-3 text-xs text-gray-600 space-y-1">
                                        <p>Type: {device.type}</p>
                                        <p>Company: {device.company.name}</p>
                                    </div>

                                    <div className="flex gap-2 justify-end border-t border-gray-50 pt-3">
                                        <p
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => startEdit(device)}
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </p>
                                        <p
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => removeDevice(device.id)}
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
