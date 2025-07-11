import React, { useCallback, useState } from "react";
import { Linking, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { RadioButton } from "react-native-paper";

const BORDER_WIDTH = 1.15;
const BORDER_COLOR = "#fff";
const BORDER_RADIUS = 12;

const INGREDIENTS = [
  { label: "Sugar", value: "sugar" },
  { label: "Flour", value: "flour" },
  { label: "Butter", value: "butter" },
  { label: "Yeast", value: "yeast" },
];

const DENSITIES: Record<string, number> = {
  flour: 0.59,
  sugar: 0.85,
  butter: 0.96,
  yeast: 0.68,
};

const VOLUME_OPTIONS: Record<string, number> = {
  option1: 5,
  option2: 40,
  option3: 200,
};

const GITHUB_URL = "https://github.com/Shadow9887";
const LINKEDIN_URL = "https://www.linkedin.com/in/margarit-dragos-18009226b/";

export default function Index() {
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(screenWidth - 32, 390);

  const [radioValue, setRadioValue] = useState<keyof typeof VOLUME_OPTIONS>("option1");
  const [isSolid, setIsSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [ingredient, setIngredient] = useState<string | null>(null);
  const [items, setItems] = useState(INGREDIENTS);
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");

  const handleCalculate = useCallback(() => {
    const userVolumeInput = Number(number);
    let calculationResult = "";
    let invalidInputCode = 0;

    if (isNaN(userVolumeInput) || userVolumeInput === 0) {
      invalidInputCode = 1;
    }

    const selectedVolume = VOLUME_OPTIONS[radioValue];
    if (!selectedVolume) {
      invalidInputCode = 2;
    }

    let density = 1;
    if (isSolid) {
      if (ingredient && DENSITIES[ingredient]) {
        density = DENSITIES[ingredient];
      } else {
        invalidInputCode = 3;
      }
    }

    if (invalidInputCode === 1) {
      calculationResult = "Invalid amount!";
    } else if (invalidInputCode === 2) {
      calculationResult = "No measurement selected!";
    } else if (invalidInputCode === 3) {
      calculationResult = "No ingredient selected!";
    } else {
      const resultValue = isSolid
        ? (userVolumeInput / density) / selectedVolume
        : userVolumeInput / selectedVolume;
      calculationResult = resultValue.toFixed(1);
    }

    setResult(calculationResult);
  }, [number, radioValue, isSolid, ingredient]);

  return (
    <View style={styles.container}>
      <View
        style={styles.scrollContent}
      >
        <View style={[styles.contentWrapper, { width: contentWidth }]}>
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.SLbutton}
              onPress={() => setIsSolid((prev) => !prev)}
              accessibilityLabel="Toggle between solid and liquid"
            >
              <Text style={styles.buttonText}>{isSolid ? "Solid" : "Liquid"}</Text>
            </TouchableOpacity>
            <View style={styles.dropDown}>
              <DropDownPicker
                open={open}
                value={ingredient}
                items={items}
                setOpen={setOpen}
                setValue={setIngredient}
                setItems={setItems}
                placeholder="Select an ingredient"
                dropDownDirection="AUTO"
                style={[
                  styles.dropDownPickerStyle,
                  !isSolid && styles.dropDownPickerDisabled,
                ]}
                dropDownContainerStyle={styles.dropDownPickerContainer}
                labelStyle={styles.dropDownLabel}
                listItemLabelStyle={styles.dropDownListItem}
                placeholderStyle={styles.dropDownPlaceholder}
                listItemContainerStyle={styles.dropDownPickerContainer}
                disabled={!isSolid}
                zIndex={1000}
              />
            </View>
          </View>

          <View style={styles.radioButton}>
            <RadioButton.Group onValueChange={setRadioValue} value={radioValue}>
              <View style={styles.radioRow}>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setRadioValue("option1")}
                  activeOpacity={0.7}
                  accessibilityLabel="Bottle Cap"
                >
                  <RadioButton value="option1" color="#fff" uncheckedColor="#fff" />
                  <View style={styles.radioLabelColumn}>
                    <Text style={styles.radioText}>Bottle</Text>
                    <Text style={styles.radioText}>Cap</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setRadioValue("option2")}
                  activeOpacity={0.7}
                  accessibilityLabel="Shot Glass"
                >
                  <RadioButton value="option2" color="#fff" uncheckedColor="#fff" />
                  <View style={styles.radioLabelColumn}>
                    <Text style={styles.radioText}>Shot</Text>
                    <Text style={styles.radioText}>Glass</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setRadioValue("option3")}
                  activeOpacity={0.7}
                  accessibilityLabel="Plastic Cup"
                >
                  <RadioButton value="option3" color="#fff" uncheckedColor="#fff" />
                  <View style={styles.radioLabelColumn}>
                    <Text style={styles.radioText}>Plastic</Text>
                    <Text style={styles.radioText}>Cup</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </RadioButton.Group>
          </View>

          <View style={styles.inputResultRow}>
            <View style={styles.inputSlot}>
              <TextInput
                style={styles.input}
                placeholder={`Enter\nNumber${isSolid ? "\n(g)" : "\n(ml)"}`}
                placeholderTextColor="#ccc"
                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                value={number}
                onChangeText={setNumber}
                multiline
                textAlignVertical="center"
                accessibilityLabel="Enter amount"
              />
            </View>
            <Text style={styles.arrow} accessibilityLabel="Arrow">→</Text>
            <View style={styles.resultSlot}>
              <Text style={styles.resultText}>{result}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
            accessibilityRole="button"
          >
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(GITHUB_URL)}
              accessibilityRole="link"
              accessibilityLabel="GitHub profile"
            >
              <Text style={styles.socialButtonText}>GitHub</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(LINKEDIN_URL)}
              accessibilityRole="link"
              accessibilityLabel="LinkedIn profile"
            >
              
              <Text style={styles.socialButtonText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerInfoContainer}>
            <Text style={styles.footerInfoText}>
              Built with <Text style={styles.bold}>React Native</Text> & <Text style={styles.bold}>Expo</Text>{"\n"}
              Open Source • Freeware • Better Design Coming Soon{"\n"}
              Made by <Text style={styles.bold}>Dragos Margarit</Text>{"\n"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const textShadow = {
  textShadowColor: "rgba(0, 0, 0, 0.47)",
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 0.1,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181e3a",
    paddingTop: 55,
    paddingLeft: 0,
    paddingRight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center", 
    minHeight: "100%",
  },
  contentWrapper: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 390,
    paddingHorizontal: 0, 
  },
  topRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    zIndex: 1000,
  },
  SLbutton: {
    width: "31%", 
    minWidth: 100,
    maxWidth: 130,
    height: 110,
    borderRadius: BORDER_RADIUS,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    justifyContent: "center",
    backgroundColor: "#303330",
    
  },
  buttonText: {
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 0.2,
    ...textShadow,
  },
  dropDown: {
    width: "65%",
    minWidth: 160,
    maxWidth: 285,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    paddingRight: 0,
    zIndex: 1000,
  },
  dropDownPickerStyle: {
    height: 110,
    justifyContent: "center",
    opacity: 1,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    borderRadius: BORDER_RADIUS,
    backgroundColor: "#303330",
    width: "100%",
  },
  dropDownPickerContainer: {
    backgroundColor: "#303330",
    borderColor: BORDER_COLOR,
    borderWidth: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS,
    zIndex: 1000,
    width: "100%",
  },
  dropDownPickerDisabled: {
    opacity: 0.5,
  },
  dropDownLabel: {
    fontSize: 30,
    color: "#fff",
    ...textShadow,
  },
  dropDownListItem: {
    fontSize: 30,
    color: "#fff",
    ...textShadow,
  },
  dropDownPlaceholder: {
    fontSize: 30,
    color: "#ccc",
    ...textShadow,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 5,
    width: "100%",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  radioText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    ...textShadow,
  },
  radioItem: {
    width: "31%",
    minWidth: 100,
    maxWidth: 130,
    height: 110,
    borderRadius: BORDER_RADIUS,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    justifyContent: "center",
    backgroundColor: "#303330",
  },
  radioLabelColumn: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  inputResultRow: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
    width: "100%",
    justifyContent: "space-between",
  },
  inputSlot: {
    height: 90,
    width: "45%",
    minWidth: 80,
    maxWidth: 110,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  input: {
    height: 150,
    width: "100%",
    minWidth: 150,
    maxWidth: 150,
    borderColor: BORDER_COLOR,
    borderWidth: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS,
    color: "#fff",
    fontSize: 30,
    paddingHorizontal: 8,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#333a5c",
    marginRight: 0,
    zIndex: 2,
  },
  resultSlot: {
    height: 150,
    width: "45%",
    minWidth: 150,
    maxWidth: 150,
    borderColor: BORDER_COLOR,
    borderWidth: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS,
    marginLeft: -25,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  resultText: {
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 0.2,
    paddingHorizontal: 2,
    width: "100%",
    includeFontPadding: false,
    textAlignVertical: "center",
    ...textShadow,
  },
  calculateButton: {
    marginTop: 24,
    alignSelf: "center",
    backgroundColor: "#e2a834",
    paddingVertical: 28,
    paddingHorizontal: 40,
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    marginBottom: 16,
    width: "90%",
    maxWidth: 320,
    
  },
  calculateButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.2,
    ...textShadow,
  },
  arrow: {
    color: "#fff",
    fontSize: 80,
    marginTop: -30,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
    ...textShadow,
  },
  spacer: {
    flexGrow: 1,
    minHeight: 24,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  socialButton: {
    backgroundColor: "#303330",
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginHorizontal: 10,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  footerInfoContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  footerInfoText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  bold: {
    fontWeight: "bold",
    color: "#fff",
  },
});