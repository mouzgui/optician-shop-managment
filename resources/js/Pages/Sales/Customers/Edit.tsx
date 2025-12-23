import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Branch {
    id: number;
    name: string;
}

interface CustomerSummary {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
}

interface Customer extends CustomerSummary {
    email: string | null;
    address: string | null;
    date_of_birth: string | null;
    notes: string | null;
    family_head_id: number | null;
    branch_id: number | null;
}

interface Props {
    customer: Customer;
    branches: Branch[];
    potentialFamilyHeads: CustomerSummary[];
}

export default function Edit({ customer, branches, potentialFamilyHeads }: Props) {
    const { t } = useTranslation();

    const { data, setData, patch, processing, errors, reset } = useForm({
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address || '',
        date_of_birth: customer.date_of_birth || '',
        notes: customer.notes || '',
        family_head_id: customer.family_head_id || '',
        branch_id: customer.branch_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('business.customers.update', customer.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route('business.customers.show', customer.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {t('customers.edit_customer')}: {customer.first_name} {customer.last_name}
                    </h2>
                </div>
            }
        >
            <Head title={t('customers.edit_customer')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6 max-w-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <InputLabel htmlFor="first_name" value={t('customers.fields.first_name')} />
                                        <TextInput
                                            id="first_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <InputLabel htmlFor="last_name" value={t('customers.fields.last_name')} />
                                        <TextInput
                                            id="last_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone */}
                                    <div>
                                        <InputLabel htmlFor="phone" value={t('customers.fields.phone')} />
                                        <TextInput
                                            id="phone"
                                            type="tel"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <InputLabel htmlFor="email" value={t('customers.fields.email')} />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <InputLabel htmlFor="address" value={t('customers.fields.address')} />
                                    <textarea
                                        id="address"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={3}
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Date of Birth */}
                                    <div>
                                        <InputLabel htmlFor="date_of_birth" value={t('customers.fields.date_of_birth')} />
                                        <TextInput
                                            id="date_of_birth"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                        />
                                        <InputError message={errors.date_of_birth} className="mt-2" />
                                    </div>

                                    {/* Branch */}
                                    <div>
                                        <InputLabel htmlFor="branch_id" value={t('customers.fields.branch')} />
                                        <select
                                            id="branch_id"
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            value={data.branch_id}
                                            onChange={(e) => setData('branch_id', e.target.value)}
                                        >
                                            <option value="">{t('customers.select_branch')}</option>
                                            {branches.map((branch) => (
                                                <option key={branch.id} value={branch.id}>
                                                    {branch.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.branch_id} className="mt-2" />
                                    </div>
                                </div>

                                {/* Family Head */}
                                <div>
                                    <InputLabel htmlFor="family_head_id" value={t('customers.fields.family_head')} />
                                    <select
                                        id="family_head_id"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.family_head_id}
                                        onChange={(e) => setData('family_head_id', e.target.value)}
                                    >
                                        <option value="">{t('customers.none')}</option>
                                        {potentialFamilyHeads.map((head) => (
                                            <option key={head.id} value={head.id}>
                                                {head.first_name} {head.last_name} ({head.phone})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.family_head_id} className="mt-2" />
                                </div>

                                {/* Notes */}
                                <div>
                                    <InputLabel htmlFor="notes" value={t('customers.fields.notes')} />
                                    <textarea
                                        id="notes"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <SecondaryButton onClick={() => reset()} disabled={processing}>
                                        {t('common.reset')}
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {t('common.save')}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
