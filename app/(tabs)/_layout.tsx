import { Tabs } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "home", headerShown: false }}
      ></Tabs.Screen>
    </Tabs>
  );
};

export default _layout;
