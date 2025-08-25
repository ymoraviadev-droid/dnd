import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import {
  LoginBody,
  LoginSchema,
} from "@dnd/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { PixelInput, PixelButton, pixelTheme } from "rn-pixel-ui";
import useAuth from "../../src/hooks/useAuth";

const CreatePlayerScreen = () => {
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginBody>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  } as LoginBody
  );

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
        <Text style={styles.formTitle}>Login</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <PixelInput
              label="EMAIL"
              ref={ref}
              placeholder="EMAIL"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              style={styles.input}
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <PixelInput
              label="PASSWORD"
              ref={ref}
              placeholder="PASSWORD"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="done"
              style={styles.input}
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <PixelButton
          label={isSubmitting ? "WORKING..." : "LOGIN"}
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
    paddingTop: pixelTheme.spacing.xl * 3,
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
