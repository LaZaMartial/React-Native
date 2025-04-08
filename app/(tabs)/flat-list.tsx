import React, { useState } from "react";
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

const data = [
  { key: 1, numero: 2287, nom: "Rabe", noteMath: 19, notePhy: 14 },
  { key: 2, numero: 2248, nom: "Laza", noteMath: 12, notePhy: 6 },
];

const moyenneMinimale = Math.min(
  ...data.map((etudiant) => (etudiant.noteMath + etudiant.notePhy) / 2)
);

const moyenneMaximale = Math.max(
  ...data.map((etudiant) => (etudiant.noteMath + etudiant.notePhy) / 2)
);

const Preview = ({ item, onClose }: any) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  let moyenne = (item?.noteMath + item?.notePhy) / 2;
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
              <Button
                title="Supprimer"
                onPress={() => alert("Supprimer")}
              ></Button>
            </View>
          </View>
          <Text className="mb-1">Numéro: {item?.numero}</Text>
          <Text className="mb-1">Nom: {item?.nom}</Text>
          <Text className="mb-1">Note Math: {item?.noteMath}</Text>
          <Text className="mb-1">Note Physique: {item?.notePhy}</Text>
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
      {setSelectedItem != null && (
        <Update item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </Modal>
  );
};

const Add = ({ onClose }: any) => {
  return (
    <Modal animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="flex flex-col gap-3 bg-white p-5 rounded-md w-3/4">
          <Text className="text-xl font-bold mb-3">📄 Ajouter</Text>
          <TextInput inputMode="numeric" />
          <TextInput />
          <TextInput inputMode="numeric" />
          <TextInput inputMode="numeric" />
          <Button
            title="Ajouter"
            onPress={() => {
              alert("ajouter");
              getAllDocuments();
            }}
          />
          <Button title="Fermer" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const Update = ({ item, onClose }: any) => {
  return (
    <Modal animationType="slide" transparent={true} visible={!!item}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="flex flex-col gap-3 bg-white p-5 rounded-md w-3/4">
          <Text className="text-xl font-bold mb-3">📄 Modifier</Text>
          <TextInput inputMode="numeric" value={item?.numero.toString()} />
          <TextInput value={item?.nom.toString()} />
          <TextInput inputMode="numeric" value={item?.noteMath.toString()} />
          <TextInput inputMode="numeric" value={item?.notePhy.toString()} />
          <Button title="Modifier" onPress={() => alert("modifier")} />
          <Button title="Fermer" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const MyList = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [addToogled, setAddToogled] = useState<boolean>(false);
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
        data={data}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedItem(item)}>
            <View className="flex-row border-b border-gray-300 p-3">
              <Text className="flex-1 text-center">{item.numero}</Text>
              <Text className="flex-1 text-center">{item.nom}</Text>
              <Text className="flex-1 text-center">{item.noteMath}</Text>
              <Text className="flex-1 text-center">{item.notePhy}</Text>
              <Text className="flex-1 text-center">
                {((item.noteMath + item.notePhy) / 2).toFixed(2)}
              </Text>
              <Text
                className={`mt-2 w-2 h-2 rounded-full ${
                  (item.noteMath + item.notePhy) / 2 >= 10
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
