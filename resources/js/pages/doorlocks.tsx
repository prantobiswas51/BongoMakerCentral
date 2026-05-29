import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button'

export default function Doorlocks() {
    return (
        <MainLayout>
            <div className="flex items-center">
                <h1 className="text-2xl font-bold">Doorlocks</h1>
                
                <Button className="ml-auto">+ Add Doorlock</Button>
            </div>
            <hr className="my-4 border-t border-gray-300" />
        </MainLayout>
    )
}
