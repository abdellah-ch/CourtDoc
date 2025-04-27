// pages/api/filieres/libelle.ts
import { PrismaClient } from "@/generated/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const idFiliere = parseInt(req.query.idFiliere as string);

  if (isNaN(idFiliere)) {
    return res.status(400).json({ message: "Invalid idFiliere" });
  }

  try {
    const filiere = await prisma.filieres.findUnique({
      where: {
        IdFiliere: idFiliere,
        IsDeleted: false
      },
      select: {
        Libelle: true
      }
    });

    if (!filiere) {
      return res.status(404).json({ message: "Filiere not found" });
    }

    return res.status(200).json({ libelle: filiere.Libelle });
  } catch (error) {
    console.error("Error fetching filiere libelle:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
