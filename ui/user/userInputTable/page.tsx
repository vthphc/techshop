"use client"

import React from 'react'
import Input from '@/ui/inputTable/input/page'
import { user } from '@prisma/client'
import { useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';

export default function UserInputTable() {
    const route = useRouter();

    const [userInputValue, setUserInputValue] = React.useState<user>(
        { dateOfBirth: new Date(), address: [{ name: "", value: "" }] } as user);

    const handleAddressChange = (index: number, name: string, value: string) => {
        const updatedAddress = [...userInputValue.address];
        updatedAddress[index] = { name, value };
        setUserInputValue({ ...userInputValue, address: updatedAddress });
    };

    const handleDateOfBirthChange = (date: Date | null) => {
        if (date) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            setUserInputValue({ ...userInputValue, dateOfBirth: nextDay });
        }
    };

    const handleSubmit = () => {
        fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({ ...userInputValue } as user)
        })
            .then((res) => res.json())
            .then(() => {
                route.push('/users')
            })
    }

    return (
        <div className='flex flex-col bg-white mx-10 mt-2 mb-8 px-6 py-4 rounded-xl shadow-md'>
            <Input name="Name" value={userInputValue.fullname || ""} onChange={(value) => setUserInputValue({ ...userInputValue, fullname: value })} />
            <Input name="Email" value={userInputValue.email || ""} onChange={(value) => setUserInputValue({ ...userInputValue, email: value })} />
            <Input name="PhoneNumber" value={userInputValue.phoneNumber || ""} onChange={(value) => setUserInputValue({ ...userInputValue, phoneNumber: value })} />
            <div className='flex flex-row items-center w-full max-w-screen-lg justify-between bg-white p-4'>
                <h1 className='text-gray-500 font-bold'>Date of Birth:</h1>
                <DatePicker
                    selected={userInputValue.dateOfBirth}
                    onChange={(date) => handleDateOfBirthChange(date)}
                    className='ml-4 text-black px-3 py-2 bg-white border-b-2 focus:border-blue-500 hover:border-gray-300'
                    placeholderText='Select Date'
                    dateFormat='dd/MM/yyyy'
                    calendarClassName='react-datepicker-calendar'
                    wrapperClassName='react-datepicker-wrapper'
                    popperClassName='react-datepicker-popper'
                />
            </div>
            <Input name="Username" value={userInputValue.username || ""} onChange={(value) => setUserInputValue({ ...userInputValue, username: value })} />
            <Input name="Password" value={userInputValue.password || ""} onChange={(value) => setUserInputValue({ ...userInputValue, password: value })} />
            <Input name="Role" value={userInputValue.role || ""} onChange={(value) => setUserInputValue({ ...userInputValue, role: value })} />
            {userInputValue.address.map((address, index) => (
                <Input
                    key={index}
                    name={`Address ${index + 1} (as Default)`}
                    value={address.value}
                    onChange={(value) => handleAddressChange(index, address.name, value)}
                />
            ))}
            <button
                className='bg-blue-600 hover:bg-blue-700 self-end font-bold text-md px-4 py-2 rounded-xl transition duration-300 ease-in-out transform hover:scale-105'
                onClick={handleSubmit}
            >New User +</button>
        </div>
    )
}
