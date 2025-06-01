// src/utils/accessControl.ts
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient()


export async function hasFiliereAccess(userId: number, filiereId: number): Promise<boolean> {
    // Check direct filiere access
    const directAccess = await prisma.utilisateurFiliere.findFirst({
        where: {
            IdUtilisateur: userId,
            IdFiliere: filiereId
        }
    });

    if (directAccess) return true;

    // Check group filiere access
    const groupAccess = await prisma.utilisateurGroupeFilieres.findFirst({
        where: {
            IdUtilisateur: userId,
            GroupeFilieres: {
                Filieres: {
                    some: {
                        IdFiliere: filiereId
                    }
                }
            }
        }
    });

    return !!groupAccess;
}