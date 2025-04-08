import { config, database } from "./appwrite";
// Fonction pour lire tous les documents
export const getAllDocuments = async () => {
  try {
    const response = await database.listDocuments(
      config.db, // ID de la base de données
      config.collectionId // ID de la collection
    );
    console.log("Documents récupérés :", response.documents);
    return response.documents;
  } catch (error) {
    console.error("Erreur lors de la récupération des documents :", error);
  }
};
