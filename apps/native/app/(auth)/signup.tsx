import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RegisterBody, RegisterSchema } from "@dnd/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { PixelInput, PixelButton, pixelTheme } from "rn-pixel-ui";
import useAuth from "../../src/hooks/useAuth";
import { router } from "expo-router";

const SignupScreen = () => {
  const { signup } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterBody>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  } as RegisterBody
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.screenContainer}
    >
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Signup</Text>

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
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}<Controller

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
          label={isSubmitting ? "WORKING..." : "SIGNUP"}
          onPress={handleSubmit(signup)}
          disabled={!isValid || isSubmitting}
          variant="success"
          size="large"
          style={styles.button}
        />

        <Text style={{ ...styles.lowwerText, marginVertical: 10 }}>
          Already have an account?
        </Text>
        <View style={{ flexDirection: "row", gap: pixelTheme.spacing.sm }}>
          <Text style={styles.lowwerText}>
            Login
          </Text>
          <TouchableOpacity onPress={() => { router.push("/login") }}>
            <Text style={{ ...styles.lowwerText, ...styles.link }}>
              Here.
            </Text>
          </TouchableOpacity>
        </View>
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
  lowwerText: {
    fontSize: 10,
    fontFamily: pixelTheme.fonts.regular,
    color: pixelTheme.colors.text,
  },
  link: {
    color: pixelTheme.colors.accent,
    textDecorationLine: "underline",
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
  button: {
    marginVertical: pixelTheme.spacing.sm,
  },
});

export default SignupScreen;
