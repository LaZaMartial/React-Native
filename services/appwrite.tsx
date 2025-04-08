// appwrite.js
import { Client, Databases } from "appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67e3bf2900125bf93147",
  db: "67e3c0f8000f4cbcffb0",
  collectionId: "67e3c1e5003adaae1104",
  col: {
    mat: "mat",
    nom: "nom",
    note_mat: "note_mat",
    note_phy: "note_phy",
  },
};

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Remplacez par votre endpoint Appwrite
  .setProject("67e3bf2900125bf93147"); // Remplacez par votre ID de projet

export const database = new Databases(client);
