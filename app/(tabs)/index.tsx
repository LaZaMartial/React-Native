import { useState } from "react";
import { View } from "react-native";
import MyList from "./flat-list";
export default function Index() {
  const [addToogled, setAddToogled] = useState<boolean>(false);
  return (
    <View>
      <MyList />
    </View>
  );
}
