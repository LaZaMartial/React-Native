// appwrite.js
import { Client } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Remplacez par votre endpoint Appwrite
  .setProject("67e3bf2900125bf93147"); // Remplacez par votre ID de projet

export default client;
