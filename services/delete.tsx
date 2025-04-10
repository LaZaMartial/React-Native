import { config, database } from "./appwrite";

// Fonction pour supprimer un document
export const deleteDocument = async (documentId: string) => {
  try {
    await database.deleteDocument(
      config.db, // ID de la base de données
      config.collectionId, // ID de la collection
      documentId // ID du document à supprimer
    );
    // console.log("Document supprimé avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression du document :", error);
  }
};
