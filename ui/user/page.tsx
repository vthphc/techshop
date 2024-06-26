"use client"

import React, { useEffect, useState } from 'react';
import UserCard from './userCard/page';
import { useRouter } from 'next/navigation';
import { user } from '@prisma/client';

export default function User() {
    const route = useRouter();
    const [users, setUsers] = React.useState([] as user[]);

    useEffect(() => {
        fetch("/api/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Error fetching users", error));
    }, []);

    const onDeleteClick = (userID: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            fetch('api/users', {
                method: "DELETE",
                body: JSON.stringify({ userID: userID })
            })
                .then((res) => res.json())
                .then((data) => {
                    setUsers(users.filter(user => user.id !== userID))
                })
        }
    }

    const onEditClick = (selectedUser: user) => {
        route.push("/users/" + selectedUser.id)
    }

    return (
        <div className='flex flex-col mx-10 mt-2 mb-8 rounded-xl shadow-md bg-white h-full'>
            <button
                className='bg-blue-600 hover:bg-blue-700 self-end font-bold text-md px-4 py-2 mr-10 mt-4 mx-10 rounded-xl transition duration-300 ease-in-out transform hover:scale-105'
                onClick={() => { route.push("users/add") }}
            >New User +</button>
            <ul className="mb-4 mx-10 mt-4">
                <li className="flex bg-white py-2 px-4">
                    <div className="flex-1 text-black font-semibold">Full Name</div>
                    <div className="flex-1 text-black font-semibold">Role</div>
                    <div className="flex-1 text-black font-semibold">Email</div>
                    <div className="flex-1 text-black font-semibold">Phone Number</div>
                </li>
            </ul>
            <ul>
                {users.map(user => (
                    <li className='flex flex-col mx-10'>
                        <UserCard user={user} onDeleteClick={onDeleteClick} onEditClick={onEditClick} />
                    </li>
                ))}
            </ul>
        </div>
    );
}