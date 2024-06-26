import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const brandID = new URL(req.url).pathname.split("/").pop();

    const brands = await prisma.brand.findFirst({
        where: {
            id: brandID
        }
    });
    return NextResponse.json(brands);
}

export async function PATCH(req: Request) {
    const brandID = new URL(req.url).pathname.split("/").pop();

    const { name, description, email, phoneNumber, image } = await req.json();

    if (!brandID) {
        throw new Error('Brand ID is missing in the request body.');
    }

    const updatedBrand = await prisma.brand.update({
        where: {
            id: brandID
        },
        data: {
            name,
            description,
            email,
            phoneNumber,
            image: image || undefined
        }
    });
    return NextResponse.json(updatedBrand)
}