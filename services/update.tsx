import { config, database } from "./appwrite";

// Fonction pour mettre à jour un document
export const updateDocument = async (
  documentId: string,
  updatedData: string
) => {
  try {
    const response = await database.updateDocument(
      config.db, // ID de la base de données
      config.collectionId, // ID de la collection
      documentId, // ID du document à mettre à jour
      updatedData // Nouvelles données
    );
    console.log("Document mis à jour :", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du document :", error);
  }
};
