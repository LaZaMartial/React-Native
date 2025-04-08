import { config, database } from "./appwrite";

// Fonction pour ajouter un document
export const addDocument = async (
  mat: string,
  nom: string,
  note_mat: number,
  note_phy: number
) => {
  try {
    const response = await database.createDocument(
      config.db, // ID de la base de données
      config.collectionId, // ID de la collection
      "unique()", // ID unique du document (généré automatiquement)
      {
        mat: mat,
        nom: nom,
        note_mat: note_mat,
        note_phy: note_phy,
      }
    );
    console.log("Document ajouté :", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'ajout du document :", error);
  }
};
