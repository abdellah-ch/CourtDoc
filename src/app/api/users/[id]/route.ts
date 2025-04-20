import { NextResponse } from "next/server"

import { PrismaClient } from '@/generated/prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id =  await params;
        const data = await request.json()
        // console.log(userId);
        // console.log(data);

        const existingUser = await prisma.utilisateurs.findUnique({
            where: { IdUtilisateur: parseInt(id.id) },
        });

        if(existingUser){
            const isPasswordDidNotChange = await bcrypt.compare(data.password, existingUser.MotDePasse);

            if (!isPasswordDidNotChange) {
                const hashedPassword = await bcrypt.hash(data.password, 10);

                const updatedUser = await prisma.utilisateurs.update(
                    {
                        where: {
                            IdUtilisateur: parseInt(id.id),
                        },
                        data: {
                            UserName: data.username,
                            MotDePasse: hashedPassword ,
                            Nom: data.lastName,
                            Prenom: data.firstName,
                            Tel: data.phone,
                            Email: data.email,
                            DateAffectation: new Date(data.startDate),
                            DateEmbauche: new Date(data.hireDate),
                            IdCadre: parseInt(data.cadre),
                            IdUserFonctionne: parseInt(data.role), // if you're using Fonction as role
                        },
                    })

                return NextResponse.json(updatedUser)

            }
        }
        

        

        return NextResponse.json({msg:"error during update"})
    } catch (error) {
        console.error("Failed to update user:", error)
        return new NextResponse("Something went wrong", { status: 500 })
    }
}