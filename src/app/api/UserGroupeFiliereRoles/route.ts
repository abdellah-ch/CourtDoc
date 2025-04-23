import { PrismaClient } from "@/generated/prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();
//add IdUtilisateur - IdFiliere => UtilisateurFiliere
//add IdUtilisateur - IdGroupeFiliere => UtilisateurGroupeFilieres

export async function POST(request : NextRequest){
    
    const data = await request.json();

    const {IdUtilisateur , IdFiliere , IdGroupeFiliere} = data;





}