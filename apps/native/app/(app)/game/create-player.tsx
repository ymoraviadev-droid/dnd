import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import {
  CreatePlayerBody,
  CreatePlayerSchema,
  PlayerRaceSchema,
  PlayerClassSchema,
  PlayerAlignmentSchema,
} from "@dnd/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import useAuth from "../../../src/hooks/useAuth";
import { useCallback, useEffect } from "react";
import PixelInput from "../../../src/components/forms/PixelInput";
import PixelSelect from "../../../src/components/forms/PixelSelect";
import PixelButton from "../../../src/components/PixelButton";
import { pixelTheme } from "../../../src/themes/pixelTheme";

const CreatePlayerScreen = () => {
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreatePlayerBody>({
    resolver: zodResolver(CreatePlayerSchema),
    defaultValues: {
      name: "",
      race: "",
      class: "",
      alignment: "",
      abilities: {
        str: 0,
        dex: 0,
        con: 0,
        int: 0,
        wis: 0,
        cha: 0,
      },
    } as CreatePlayerBody,
  });

  const generateAbilityScore = () => {
    const rolls = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ].sort((a, b) => b - a);
    return rolls[0] + rolls[1] + rolls[2];
  };

  const rerollAbilities = useCallback(() => {
    setValue("abilities.str", generateAbilityScore());
    setValue("abilities.dex", generateAbilityScore());
    setValue("abilities.con", generateAbilityScore());
    setValue("abilities.int", generateAbilityScore());
    setValue("abilities.wis", generateAbilityScore());
    setValue("abilities.cha", generateAbilityScore());
  }, [setValue]);

  useEffect(() => {
    rerollAbilities();
  }, [rerollAbilities]);

  const abilities = useWatch({
    control,
    name: "abilities",
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.screenContainer}
    >
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>CREATE PLAYER</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <PixelInput
              label="NAME"
              ref={ref}
              placeholder="NAME"
              autoCapitalize="words"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              style={styles.input}
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <Controller
          control={control}
          name="race"
          render={({ field: { onChange, value } }) => (
            <PixelSelect
              label="RACE"
              data={PlayerRaceSchema.options}
              defaultValue={value}
              onSelect={onChange}
            />
          )}
        />
        {errors.race && <Text style={styles.errorText}>{errors.race.message}</Text>}

        <Controller
          control={control}
          name="class"
          render={({ field: { onChange, value } }) => (
            <PixelSelect
              label="CLASS"
              data={PlayerClassSchema.options}
              defaultValue={value}
              onSelect={onChange}
            />
          )}
        />
        {errors.class && <Text style={styles.errorText}>{errors.class.message}</Text>}

        <Controller
          control={control}
          name="alignment"
          render={({ field: { onChange, value } }) => (
            <PixelSelect
              label="ALIGNMENT"
              data={PlayerAlignmentSchema.options}
              defaultValue={value}
              onSelect={onChange}
            />
          )}
        />
        {errors.alignment && (
          <Text style={styles.errorText}>{errors.alignment.message}</Text>
        )}

        <View style={styles.abilitiesContainer}>
          <Text style={styles.sectionTitle}>ABILITIES</Text>
          <View style={styles.abilitiesGrid}>
            <View style={styles.abilityItem}>
              <Text style={styles.abilityLabel}>STR</Text>
              <Text style={styles.abilityValue}>{abilities.str}</Text>
            </View>
            <View style={styles.abilityItem}>
              <Text style={styles.abilityLabel}>DEX</Text>
              <Text style={styles.abilityValue}>{abilities.dex}</Text>
            </View>
            <View style={styles.abilityItem}>
              <Text style={styles.abilityLabel}>CON</Text>
              <Text style={styles.abilityValue}>{abilities.con}</Text>
            </View>
            <View style={styles.abilityItem}>
              <Text style={styles.abilityLabel}>INT</Text>
              <Text style={styles.abilityValue}>{abilities.int}</Text>
            </View>
            <View style={styles.abilityItem}>
              <Text style={styles.abilityLabel}>WIS</Text>
              <Text style={styles.abilityValue}>{abilities.wis}</Text>
            </View>
            <View style={styles.abilityItem}>
              <Text style={styles.abilityLabel}>CHA</Text>
              <Text style={styles.abilityValue}>{abilities.cha}</Text>
            </View>
          </View>
        </View>

        <PixelButton
          label="REROLL"
          onPress={rerollAbilities}
          variant="secondary"
          size="medium"
          style={styles.button}
        />

        <PixelButton
          label={isSubmitting ? "WORKING..." : "CREATE"}
          onPress={handleSubmit(login)}
          disabled={!isValid || isSubmitting}
          variant="success"
          size="large"
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: pixelTheme.colors.background,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: pixelTheme.spacing.xl * 1.5,
  },
  formContainer: {
    width: "90%",
    padding: pixelTheme.spacing.xl,
    backgroundColor: pixelTheme.colors.backgroundLight,
    borderWidth: 2,
    borderColor: pixelTheme.colors.grayDark,
    borderRadius: pixelTheme.borderRadius.pixel,
    ...pixelTheme.shadows.pixel,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: pixelTheme.fonts.regular,
    color: pixelTheme.colors.text,
    marginBottom: pixelTheme.spacing.lg,
    textAlign: "center",
  },
  input: {
    height: 50,
    fontSize: 13,
  },
  errorText: {
    color: pixelTheme.colors.danger,
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 10,
    marginBottom: pixelTheme.spacing.sm,
    textAlign: "center",
  },
  abilitiesContainer: {
    marginTop: pixelTheme.spacing.xl,
    marginBottom: pixelTheme.spacing.lg,
    paddingVertical: pixelTheme.spacing.md,
    backgroundColor: pixelTheme.colors.shadow,
    padding: pixelTheme.spacing.sm,
    borderRadius: pixelTheme.borderRadius.pixel,
  },
  sectionTitle: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 14,
    color: pixelTheme.colors.primary,
    textAlign: "center",
    marginBottom: pixelTheme.spacing.md,
  },
  abilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: pixelTheme.spacing.sm,
  },
  abilityItem: {
    alignItems: "center",
    marginHorizontal: pixelTheme.spacing.sm,
    marginBottom: pixelTheme.spacing.sm,
    flex: 1,
  },
  abilityLabel: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 10,
    color: pixelTheme.colors.grayLight,
    marginBottom: pixelTheme.spacing.xs,
  },
  abilityValue: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 16,
    color: pixelTheme.colors.primary,
    textShadowColor: pixelTheme.colors.glow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  button: {
    marginVertical: pixelTheme.spacing.sm,
  },
});

export default CreatePlayerScreen;
