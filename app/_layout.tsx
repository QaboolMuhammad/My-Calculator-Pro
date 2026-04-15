import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// Enable animation for Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [sound, setSound] = useState<any>();

  /**
   * Load saved history on start
   */
  useEffect(() => {
    loadHistory();
  }, []);

  /**
   * Play button sound
   */
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sound.mp3") // add sound file here
    );
    setSound(sound);
    await sound.playAsync();
  };

  /**
   * Load history from storage
   */
  const loadHistory = async () => {
    const data = await AsyncStorage.getItem("history");
    if (data) setHistory(JSON.parse(data));
  };

  /**
   * Save history (last 5)
   */
  const saveHistory = async (newEntry: string) => {
    let updated = [newEntry, ...history].slice(0, 5);
    setHistory(updated);
    await AsyncStorage.setItem("history", JSON.stringify(updated));
  };

  /**
   * Handle button press
   */
  const handlePress = (value: string) => {
    playSound();
    setInput((prev) => prev + value);
  };

  /**
   * Clear all
   */
  const handleClear = () => {
    playSound();
    setInput("");
    setResult("");
  };

  /**
   * Delete last char
   */
  const handleDelete = () => {
    playSound();
    setInput((prev) => prev.slice(0, -1));
  };

  /**
   * Calculate result
   */
  const handleCalculate = () => {
    try {
      LayoutAnimation.easeInEaseOut();

      const evalResult = eval(input);
      const res = evalResult.toString();

      setResult(res);

      // Save to history
      saveHistory(`${input} = ${res}`);
    } catch {
      setResult("Error");
    }
  };

  /**
   * Render Button
   */
  const renderButton = (value: string, style?: any, onPress?: () => void) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress ? onPress : () => handlePress(value)}
    >
      <Text style={styles.buttonText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Display */}
      <View style={styles.display}>
        <Text style={styles.input}>{input || "0"}</Text>
        <Text style={styles.result}>{result}</Text>
      </View>

      {/* History */}
      <ScrollView style={styles.history}>
        {history.map((item, index) => (
          <Text key={index} style={styles.historyText}>
            {item}
          </Text>
        ))}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttons}>
        <View style={styles.row}>
          {renderButton("C", styles.clearBtn, handleClear)}
          {renderButton("DEL", styles.deleteBtn, handleDelete)}
          {renderButton("%", styles.operator1)}
          {renderButton("/", styles.operator2)}
        </View>

        <View style={styles.row}>
          {renderButton("7")}
          {renderButton("8")}
          {renderButton("9")}
          {renderButton("*", styles.operator3)}
        </View>

        <View style={styles.row}>
          {renderButton("4")}
          {renderButton("5")}
          {renderButton("6")}
          {renderButton("-", styles.operator4)}
        </View>

        <View style={styles.row}>
          {renderButton("1")}
          {renderButton("2")}
          {renderButton("3")}
          {renderButton("+", styles.operator5)}
        </View>

        <View style={styles.row}>
          {renderButton("0", styles.zero)}
          {renderButton(".")}
          {renderButton("=", styles.equal, handleCalculate)}
        </View>
      </View>
    </SafeAreaView>
  );
}

/**
 * Styles (Pro UI)
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  display: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },

  input: {
    fontSize: 28,
    color: "#64748b",
  },

  result: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },

  history: {
    maxHeight: 100,
    paddingHorizontal: 20,
  },

  historyText: {
    color: "#94a3b8",
    fontSize: 14,
  },

  buttons: {
    flex: 2,
    padding: 10,
  },

  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  button: {
    flex: 1,
    height: 65,
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e293b",
  },

  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  operator1: {
    backgroundColor: "#8b5cf6",
  },

  operator2: {
    backgroundColor: "#f97316",
  },
  operator3: {
    backgroundColor: "#b910a0",
  },
  operator4: {
    backgroundColor: "#10b9b36a",
  },
  operator5: {
    backgroundColor: "#3b82f6",
  },
  equal: {
    backgroundColor: "#22c55e",
  },

  clearBtn: {
    backgroundColor: "#ef4444",
  },

  deleteBtn: {
    backgroundColor: "#eab308",
  },

  zero: {
    flex: 2,
  },
});