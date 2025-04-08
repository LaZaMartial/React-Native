import React, { useState, useEffect } from "react";
import {
  Button,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { getAllDocuments } from "@/services/get-all";
import { addDocument } from "@/services/create";
import { updateDocument } from "@/services/update";
import { deleteDocument } from "@/services/delete";

const Preview = ({ item, onClose, onRefresh }: any) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const handleDelete = async () => {
    try {
      await deleteDocument(item.$id);
      alert("Élève supprimé avec succès !");
      onClose();
      if (onRefresh) {
        onRefresh(); // Rechargez les données
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  let moyenne = (item?.note_mat + item?.note_phy) / 2;

  return (
    <Modal animationType="slide" transparent={true} visible={!!item}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="flex flex-col gap-3 bg-white p-5 rounded-md w-3/4">
          <View className="flex-row">
            <Text className="text-xl font-bold mb-3">📄 Détails</Text>
            <View className="flex flex-row gap-2 absolute right-0">
              <Button
                title="Modifier"
                onPress={() => setSelectedItem(item)}
              ></Button>
              <Button title="Supprimer" onPress={handleDelete}></Button>
            </View>
          </View>
          <Text className="mb-1">Matricule: {item?.mat}</Text>
          <Text className="mb-1">Nom: {item?.nom}</Text>
          <Text className="mb-1">Note Math: {item?.note_mat}</Text>
          <Text className="mb-1">Note Physique: {item?.note_phy}</Text>
          <Text className="mb-1">Moyenne: {moyenne.toFixed(2)}</Text>
          <Text>
            Status:{" "}
            <Text className={moyenne >= 10 ? `text-green-400` : `text-red-400`}>
              {moyenne >= 10 ? `Passant` : `Redoublant`}
            </Text>
          </Text>
          <Button title="Fermer" onPress={onClose} />
        </View>
      </View>
      {selectedItem != null && (
        <Update item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </Modal>
  );
};

const Update = ({ item, onClose, onRefresh }: any) => {
  const [mat, setMat] = useState(item?.mat || "");
  const [nom, setNom] = useState(item?.nom || "");
  const [noteMath, setNoteMath] = useState(item?.note_mat || "");
  const [notePhy, setNotePhy] = useState(item?.note_phy || "");

  const handleUpdate = async () => {
    try {
      await updateDocument(item.$id, {
        mat: mat,
        nom: nom,
        note_mat: parseFloat(noteMath),
        note_phy: parseFloat(notePhy),
      });
      alert("Élève mis à jour avec succès !");
      onClose();
      if (onRefresh) {
        onRefresh(); // Rechargez les données
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={!!item}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="flex flex-col gap-3 bg-white p-5 rounded-md w-3/4">
          <Text className="text-xl font-bold mb-3">📄 Modifier</Text>
          <TextInput
            placeholder="Matricule"
            value={mat}
            onChangeText={setMat}
          />
          <TextInput placeholder="Nom" value={nom} onChangeText={setNom} />
          <TextInput
            inputMode="numeric"
            placeholder="Note Math"
            value={noteMath.toString()}
            onChangeText={setNoteMath}
            keyboardType="numeric"
          />
          <TextInput
            inputMode="numeric"
            placeholder="Note Physique"
            value={notePhy.toString()}
            onChangeText={setNotePhy}
            keyboardType="numeric"
          />
          <Button title="Modifier" onPress={handleUpdate} />
          <Button title="Fermer" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const Add = ({ onClose }: any) => {
  const [mat, setMat] = useState("");
  const [nom, setNom] = useState("");
  const [noteMath, setNoteMath] = useState("");
  const [notePhy, setNotePhy] = useState("");

  const handleAdd = async () => {
    try {
      await addDocument(mat, nom, parseFloat(noteMath), parseFloat(notePhy));
      alert("Élève ajouté avec succès !");
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Une erreur est survenue lors de l'ajout.");
    }
  };

  return (
    <Modal animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="flex flex-col gap-3 bg-white p-5 rounded-md w-3/4">
          <Text className="text-xl font-bold mb-3">📄 Ajouter</Text>
          <TextInput
            placeholder="Matricule"
            value={mat}
            onChangeText={setMat}
          />
          <TextInput placeholder="Nom" value={nom} onChangeText={setNom} />
          <TextInput
            placeholder="Note Math"
            value={noteMath}
            onChangeText={setNoteMath}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Note Physique"
            value={notePhy}
            onChangeText={setNotePhy}
            keyboardType="numeric"
          />
          <Button title="Ajouter" onPress={handleAdd} />
          <Button title="Fermer" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const MyList = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [addToogled, setAddToogled] = useState<boolean>(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getAllDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents :", error);
      }
    };
    fetchDocuments();
  }, []);

  const moyenneMinimale = Math.min(
    ...documents.map(
      (etudiant: any) => (etudiant.note_mat + etudiant.note_phy) / 2
    )
  );

  const moyenneMaximale = Math.max(
    ...documents.map(
      (etudiant: any) => (etudiant.note_mat + etudiant.note_phy) / 2
    )
  );

  return (
    <View className="p-5 bg-white">
      {/* ✅ Label au-dessus de la liste */}

      <Text className="text-xl font-bold mb-4">📊 Résultats des élèves</Text>
      <View className="flex flex-row absolute right-0 mt-3 mr-5">
        <Text
          className="text-white text-xl p-2 px-4 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
          onPress={() => {
            setAddToogled(!addToogled);
          }}
        >
          Ajouter
        </Text>
      </View>
      {addToogled && <Add onClose={() => setAddToogled(!addToogled)} />}

      {/* ✅ En-tête du tableau */}
      <View className="flex-row bg-green-600 p-3 rounded-md mt-2">
        <Text className="flex-1 text-white font-bold text-center">Numéro</Text>
        <Text className="flex-1 text-white font-bold text-center">Nom</Text>
        <Text className="flex-1 text-white font-bold text-center">Math</Text>
        <Text className="flex-1 text-white font-bold text-center">
          Physique
        </Text>
        <Text className="flex-1 text-white font-bold text-center">Moyenne</Text>
      </View>

      {/* ✅ Liste des élèves */}
      <FlatList
        data={documents}
        keyExtractor={(item: any) => item.$id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedItem(item)}>
            <View className="flex-row border-b border-gray-300 p-3">
              <Text className="flex-1 text-center">{item.mat}</Text>
              <Text className="flex-1 text-center">{item.nom}</Text>
              <Text className="flex-1 text-center">{item.note_mat}</Text>
              <Text className="flex-1 text-center">{item.note_phy}</Text>
              <Text className="flex-1 text-center">
                {((item.note_mat + item.note_phy) / 2).toFixed(2)}
              </Text>
              <Text
                className={`mt-2 w-2 h-2 rounded-full ${
                  (item.note_mat + item.note_phy) / 2 >= 10
                    ? `bg-green-400`
                    : `bg-red-400`
                }  `}
              ></Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {setSelectedItem != null && (
        <Preview item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      <View className="mt-3">
        <Text className="font-bold text-center">
          Moyenne minimale : {moyenneMinimale.toFixed(2)}
        </Text>
        <Text className="font-bold text-center">
          Moyenne maximale : {moyenneMaximale.toFixed(2)}
        </Text>
        <Text className="font-bold text-center">Moyenne de classe :</Text>
        <Text className="font-bold text-center">Nombre de redoublants :</Text>
      </View>
    </View>
  );
};

export default MyList;
