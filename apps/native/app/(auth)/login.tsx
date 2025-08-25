import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LoginBody, LoginSchema } from "@dnd/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { PixelInput, PixelButton, pixelTheme } from "rn-pixel-ui";
import useAuth from "../../src/hooks/useAuth";
import { router } from "expo-router";

const LoginScreen = () => {
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginBody>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  } as LoginBody
  );

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

        <Text style={{ ...styles.lowwerText, marginVertical: 10 }}>
          Dont have an account?
        </Text>
        <View style={{ flexDirection: "row", gap: pixelTheme.spacing.sm }}>
          <Text style={styles.lowwerText}>
            Sign up
          </Text>
          <TouchableOpacity onPress={() => { router.push("/signup") }}>
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

export default LoginScreen;
