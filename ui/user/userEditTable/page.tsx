import Input from '@/ui/inputTable/input/page';
import { user } from '@prisma/client'
import { useRouter } from 'next/navigation';
import React from 'react'

interface UserEditTableProps {
    userID: string
}

export default function UserEditTable({ userID }: UserEditTableProps) {
    const router = useRouter();

    const [updatedUser, setUpdatedUser] = React.useState<user>(
        { dateOfBirth: new Date(), address: [{ name: "", value: "" }] } as user);

    React.useEffect(() => {
        fetch("/api/users/" + userID)
            .then((data) => data.json())
            .then((data) => setUpdatedUser(data))
    }, [])

    const handleAddressChange = (index: number, name: string, value: string) => {
        const updatedAddress = [...updatedUser.address];
        updatedAddress[index] = { name, value };
        setUpdatedUser({ ...updatedUser, address: updatedAddress });
    };

    const handleDateOfBirthChange = (value: string) => {
        const [day, month, year] = value.split('/').map(part => parseInt(part, 10));
        const date = new Date(year, month - 1, day);
        
        if (!isNaN(date.getTime())) {
            setUpdatedUser({ ...updatedUser, dateOfBirth: date });
        } else {
            console.error("Invalid date input");
        }
    };
    

    const handleUpdateClick = () => {
        fetch("/api/users/" + updatedUser.id,
            {
                method: 'PATCH',
                body: JSON.stringify(updatedUser)
            }
        )
            .then(router.back)
    }

    return (
        <div className='flex flex-col mx-10 mt-2 mb-8 px-6 py-4 rounded-xl shadow-md bg-white'>
            <Input name="Name" value={updatedUser.fullname || ""} onChange={(value) => setUpdatedUser({ ...updatedUser, fullname: value })} />
            <Input name="Email" value={updatedUser.email || ""} onChange={(value) => setUpdatedUser({ ...updatedUser, email: value })} />
            <Input name="PhoneNumber" value={updatedUser.phoneNumber || ""} onChange={(value) => setUpdatedUser({ ...updatedUser, phoneNumber: value })} />
            <Input name="Date of Birth" value={updatedUser.dateOfBirth.toString() || ""} onChange={handleDateOfBirthChange} />
            <Input name="Username" value={updatedUser.username || ""} onChange={(value) => setUpdatedUser({ ...updatedUser, username: value })} />
            <Input name="Password" value={updatedUser.password || ""} onChange={(value) => setUpdatedUser({ ...updatedUser, password: value })} />
            <Input name="Role" value={updatedUser.role || ""} onChange={(value) => setUpdatedUser({ ...updatedUser, role: value })} />
            {updatedUser.address?.map((address, index) => (
                <Input
                    key={index}
                    name={`Address ${index + 1} (as Default)`}
                    value={address.value}
                    onChange={(value) => handleAddressChange(index, address.name, value)}
                />
            ))}
            <button
                className='bg-blue-600 hover:bg-blue-700 self-end font-bold text-md px-4 py-2 rounded-xl transition duration-300 ease-in-out transform hover:scale-105' 
                onClick={handleUpdateClick}
                >Update User
            </button>
        </div>
    )
}
