import { Button, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { LoginBody, LoginSchema } from "@dnd/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import useAuth from "../../src/hooks/useAuth";
import Input from "../../src/components/forms/Input";

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
      password: "",
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{
        flex: 1,
        paddingTop: 200,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#121212",
      }}
    >
      <View style={{ width: "90%", alignItems: "center" }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              ref={ref}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
            />
          )}
        />
        {errors.email && (
          <Text style={{ color: "tomato", marginBottom: 8 }}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              ref={ref}
              placeholder="Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="done"
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: "tomato", marginBottom: 8 }}>
            {errors.password.message}
          </Text>
        )}

        <Button
          title={isSubmitting ? "Working..." : "Login"}
          onPress={handleSubmit(login)}
          disabled={!isValid}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
