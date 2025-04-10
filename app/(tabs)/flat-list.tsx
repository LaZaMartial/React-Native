// src/components/MyList.tsx
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { getAllDocuments } from "@/services/get-all";
import { addDocument } from "@/services/create";
import { updateDocument } from "@/services/update";
import { deleteDocument } from "@/services/delete";

const CustomButton = ({ title, onPress, color = "#2563eb" }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: color,
      padding: 10,
      borderRadius: 12,
      marginVertical: 5,
    }}
  >
    <Text className="text-white text-center font-semibold">{title}</Text>
  </TouchableOpacity>
);

const Preview = ({ item, onClose, onRefresh }: any) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  let moyenne = (item?.note_mat + item?.note_phy) / 2;

  const handleDelete = async () => {
    try {
      await deleteDocument(item.$id);
      alert("Élève supprimé avec succès !");
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={!!item}>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white p-6 rounded-xl w-[90%] shadow-lg">
          <Text className="text-xl font-bold mb-4 text-center">
            📄 Détails de l'élève
          </Text>

          <Text>📌 Matricule : {item?.mat}</Text>
          <Text>👤 Nom : {item?.nom}</Text>
          <Text>📘 Note Math : {item?.note_mat}</Text>
          <Text>🧪 Note Physique : {item?.note_phy}</Text>
          <Text>🧮 Moyenne : {moyenne.toFixed(2)}</Text>
          <Text className="mb-4">
            🏷️ Statut :{" "}
            <Text className={moyenne >= 10 ? "text-green-600" : "text-red-600"}>
              {moyenne >= 10 ? "Passant" : "Redoublant"}
            </Text>
          </Text>

          <CustomButton
            title="✏️ Modifier"
            onPress={() => setSelectedItem(item)}
          />
          <CustomButton
            title="🗑️ Supprimer"
            onPress={handleDelete}
            color="#dc2626"
          />
          <CustomButton title="❌ Fermer" onPress={onClose} color="#6b7280" />
        </View>
      </View>
      {selectedItem && (
        <Update item={selectedItem} onClose={onClose} onRefresh={onRefresh} />
      )}
    </Modal>
  );
};

const Update = ({ item, onClose, onRefresh }: any) => {
  const [mat, setMat] = useState(item?.mat || "");
  const [nom, setNom] = useState(item?.nom || "");
  const [noteMath, setNoteMath] = useState(item?.note_mat?.toString() || "");
  const [notePhy, setNotePhy] = useState(item?.note_phy?.toString() || "");

  const handleUpdate = async () => {
    try {
      await updateDocument(item.$id, {
        mat,
        nom,
        note_mat: parseFloat(noteMath),
        note_phy: parseFloat(notePhy),
      });
      alert("Mise à jour réussie !");
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <Modal animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white p-6 rounded-xl w-[90%] shadow-lg">
          <Text className="text-xl font-bold mb-4 text-center">
            ✏️ Modifier l'élève
          </Text>
          <TextInput
            label="Matricule"
            value={mat}
            onChangeText={setMat}
            mode="outlined"
          />
          <TextInput
            label="Nom"
            value={nom}
            onChangeText={setNom}
            mode="outlined"
          />
          <TextInput
            label="Note Math"
            value={noteMath}
            onChangeText={setNoteMath}
            keyboardType="numeric"
            mode="outlined"
          />
          <TextInput
            label="Note Physique"
            value={notePhy}
            onChangeText={setNotePhy}
            keyboardType="numeric"
            mode="outlined"
          />
          <CustomButton title="💾 Sauvegarder" onPress={handleUpdate} />
          <CustomButton title="❌ Annuler" onPress={onClose} color="#6b7280" />
        </View>
      </View>
    </Modal>
  );
};

const Add = ({ onClose, onRefresh }: any) => {
  const [mat, setMat] = useState("");
  const [nom, setNom] = useState("");
  const [noteMath, setNoteMath] = useState("");
  const [notePhy, setNotePhy] = useState("");

  const handleAdd = async () => {
    try {
      await addDocument(mat, nom, parseFloat(noteMath), parseFloat(notePhy));
      alert("Élève ajouté !");
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout.");
    }
  };

  return (
    <Modal animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white p-6 rounded-xl w-[90%] shadow-lg">
          <Text className="text-xl font-bold mb-4 text-center">
            ➕ Ajouter un élève
          </Text>
          <TextInput
            label="Matricule"
            value={mat}
            onChangeText={setMat}
            mode="outlined"
          />
          <TextInput
            label="Nom"
            value={nom}
            onChangeText={setNom}
            mode="outlined"
          />
          <TextInput
            label="Note Math"
            value={noteMath}
            onChangeText={setNoteMath}
            keyboardType="numeric"
            mode="outlined"
          />
          <TextInput
            label="Note Physique"
            value={notePhy}
            onChangeText={setNotePhy}
            keyboardType="numeric"
            mode="outlined"
          />
          <CustomButton title="✅ Ajouter" onPress={handleAdd} />
          <CustomButton title="❌ Annuler" onPress={onClose} color="#6b7280" />
        </View>
      </View>
    </Modal>
  );
};

const MyList = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [addToggled, setAddToggled] = useState(false);

  const fetchDocuments = async () => {
    try {
      const docs = await getAllDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const moyennes = documents.map((e: any) => (e.note_mat + e.note_phy) / 2);
  const moyenneMinimale = moyennes.length > 0 ? Math.min(...moyennes) : 0;
  const moyenneMaximale = moyennes.length > 0 ? Math.max(...moyennes) : 0;
  const moyenneClasse =
    moyennes.length > 0
      ? moyennes.reduce((acc, val) => acc + val, 0) / moyennes.length
      : 0;
  const nbRedoublants = moyennes.filter((m) => m < 10).length;
  const nbAdmis = moyennes.filter((m) => m >= 10).length;

  return (
    <ScrollView className="p-5 bg-white">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">📊 Résultats des élèves</Text>
        <CustomButton title="➕ Ajouter" onPress={() => setAddToggled(true)} />
      </View>

      {addToggled && (
        <Add onClose={() => setAddToggled(false)} onRefresh={fetchDocuments} />
      )}

      <View className="bg-green-600 p-3 rounded-md flex-row">
        <Text className="flex-1 text-white text-center font-bold">Mat</Text>
        <Text className="flex-1 text-white text-center font-bold">Nom</Text>
        <Text className="flex-1 text-white text-center font-bold">Math</Text>
        <Text className="flex-1 text-white text-center font-bold">Phy</Text>
        <Text className="flex-1 text-white text-center font-bold">Moy</Text>
      </View>

      <FlatList
        data={documents}
        keyExtractor={(item: any) => item.$id.toString()}
        renderItem={({ item }) => {
          const moyenne = ((item.note_mat + item.note_phy) / 2).toFixed(2);
          return (
            <TouchableOpacity onPress={() => setSelectedItem(item)}>
              <View className="flex-row border-b border-gray-200 py-3">
                <Text className="flex-1 text-center">{item.mat}</Text>
                <Text className="flex-1 text-center">{item.nom}</Text>
                <Text className="flex-1 text-center">{item.note_mat}</Text>
                <Text className="flex-1 text-center">{item.note_phy}</Text>
                <Text className="flex-1 text-center">{moyenne}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {selectedItem && (
        <Preview
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRefresh={fetchDocuments}
        />
      )}

      <View className="mt-6 bg-gray-50 rounded-xl p-4">
        <Text className="font-bold text-center text-lg mb-3">
          📊 Statistiques de la classe
        </Text>

        <View className="flex flex-row flex-wrap justify-center gap-4">
          <StatBox label="📉 Min." value={moyenneMinimale} color="blue" />
          <StatBox label="📈 Max." value={moyenneMaximale} color="blue" />
          <StatBox label="🧮 Moyenne" value={moyenneClasse} color="yellow" />
          <StatBox label="🔁 Redoublants" value={nbRedoublants} color="red" />
          <StatBox label="✅ Admis" value={nbAdmis} color="green" />
        </View>
      </View>
    </ScrollView>
  );
};

interface StatBoxProps {
  label: string;
  value: number;
  color: "blue" | "yellow" | "red" | "green";
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, color }) => {
  const bg = {
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
  }[color];

  return (
    <View className={`w-[45%] rounded-xl p-3 shadow-md ${bg}`}>
      <Text className="text-sm">{label}</Text>
      <Text className="text-2xl font-bold text-center">{value.toFixed(2)}</Text>
    </View>
  );
};

export default MyList;
