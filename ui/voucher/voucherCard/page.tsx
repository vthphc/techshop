import { voucher } from '@prisma/client'
import { useRouter } from 'next/navigation';
import React from 'react'

interface VoucherCardProps {
    voucher: voucher,
    index: number
}

export default function VoucherCard({ voucher, index }: VoucherCardProps) {
    const router = useRouter();

    const onVoucherClick = () => {
        router.push(`/vouchers/${voucher.id}`)
    }

    return (
        <div
            className='flex flex-row bg-white hover:bg-zinc-300 cursor-pointer border-b-2 p-4 mb-4 transition duration-300 ease-in-out'
            onClick={onVoucherClick}>
            <div className='flex-1 text-gray-600 mr-4'>{index}</div>
            <div className='flex-1 text-gray-600 mr-4'>{voucher.code}</div>
            <div className='flex-1 text-gray-600 mr-4'>{voucher.type}</div>
            <div className='flex-1 text-gray-600'>{voucher.description}</div>
        </div>
    )
}
