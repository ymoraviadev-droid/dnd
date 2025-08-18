import { forwardRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { pixelTheme } from "../../themes/pixelTheme";
import { FontAwesome } from "@expo/vector-icons";

interface PixelSelectProps {
  data: string[];
  onSelect: (selectedItem: string, index: number) => void;
  defaultValue?: string;
  label: string;
}

const PixelSelect = forwardRef<SelectDropdown, PixelSelectProps>(
  ({ data, onSelect, defaultValue, label }, ref) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <SelectDropdown
          ref={ref}
          data={data}
          defaultValue={defaultValue}
          onSelect={onSelect}
          renderButton={(selectedItem, isOpened) => (
            <View style={styles.dropdownButton}>
              <Text style={styles.dropdownButtonText}>
                {(selectedItem || `SELECT ${label.toUpperCase()}`).toUpperCase()}
              </Text>
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownIcon}
              />
            </View>
          )}
          renderItem={(item, index, isSelected) => (
            <View style={[styles.dropdownRow, isSelected && styles.dropdownRowSelected]}>
              <Text style={styles.dropdownRowText}>{item.toUpperCase()}</Text>
            </View>
          )}
          dropdownStyle={styles.dropdown}
          dropdownOverlayColor="transparent"
          statusBarTranslucent={true}
        />
      </View>
    );
  }
);

PixelSelect.displayName = "PixelSelect";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: pixelTheme.spacing.md,
    zIndex: 1,
  },
  label: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 12,
    color: pixelTheme.colors.textSecondary,
    marginBottom: 2,
    marginTop: pixelTheme.spacing.md,
    textTransform: "uppercase",
  },
  dropdownButton: {
    width: "100%",
    height: 48,
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderWidth: 2,
    borderColor: pixelTheme.colors.grayDark,
    borderRadius: pixelTheme.borderRadius.pixel,
    paddingHorizontal: pixelTheme.spacing.md,
    ...pixelTheme.shadows.pixel,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 12,
    color: pixelTheme.colors.text,
    textAlign: "left",
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: pixelTheme.colors.primary,
    marginLeft: pixelTheme.spacing.sm,
  },
  dropdown: {
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderWidth: 2,
    borderColor: pixelTheme.colors.grayDark,
    borderRadius: pixelTheme.borderRadius.pixel,
    marginTop: -2,
  },
  dropdownRow: {
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderBottomColor: pixelTheme.colors.grayDark,
    borderBottomWidth: 1,
    paddingHorizontal: pixelTheme.spacing.md,
    paddingVertical: pixelTheme.spacing.sm,
  },
  dropdownRowText: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 12,
    color: pixelTheme.colors.text,
    textAlign: "left",
  },
  dropdownRowSelected: {
    backgroundColor: pixelTheme.colors.primaryDark,
  },
});

export default PixelSelect;
