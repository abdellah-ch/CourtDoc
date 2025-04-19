"use server";
import prisma from "./prisma";

export async function createUser(data: {
  CodeUtilisateur: number;
  MotDePasse: string;
  Nom: string;
  Prenom: string;
  Tel: string;
  Email: string;
  DateEmbauche: Date;
  DateAffectation: Date;
  IdRole: number;
  IdCadre: number;
  IdUserFonctionne: number;
}) {
  try {
    const user = await prisma.utilisateurs.create({
      data,
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.utilisateurs.findMany({
      include: {
        Cadre: true,
        UserFonctionne: true,
        Roles: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}