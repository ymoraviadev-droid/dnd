import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { CreateCampaignInput, CreateCampaignSchema } from "@dnd/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import PixelButton from "../../../../src/components/forms/PixelButton";
import PixelInput from "../../../../src/components/forms/PixelInput";
import useGame from "../../../../src/hooks/useGame";
import { pixelTheme } from "../../../../src/themes/pixelTheme";

const CreateCampaignScreen = () => {
  const { createCampaign } = useGame();
  const [inviteInput, setInviteInput] = useState("");
  const [invitedIds, setInvitedIds] = useState<number[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateCampaignInput>({
    resolver: zodResolver(CreateCampaignSchema),
    defaultValues: {
      name: "",
      invitedIds: [],
    },
  });

  const addInvitedPlayer = () => {
    const playerId = parseInt(inviteInput.trim());
    if (!isNaN(playerId) && !invitedIds.includes(playerId)) {
      setInvitedIds([...invitedIds, playerId]);
      setInviteInput("");
    }
  };

  const removeInvitedPlayer = (playerId: number) => {
    setInvitedIds(invitedIds.filter((id) => id !== playerId));
  };

  const onSubmit = (data: CreateCampaignInput) => {
    const submitData = {
      ...data,
      invitedIds: invitedIds.length > 0 ? invitedIds : undefined,
    };
    createCampaign(submitData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.screenContainer}
    >
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>CREATE CAMPAIGN</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <PixelInput
              label="CAMPAIGN NAME"
              ref={ref}
              placeholder="CAMPAIGN NAME"
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

        <View style={styles.invitesContainer}>
          <Text style={styles.sectionTitle}>INVITE PLAYERS</Text>

          <View style={styles.inviteInputContainer}>
            <PixelInput
              label="PLAYER ID"
              placeholder="ENTER PLAYER ID"
              value={inviteInput}
              onChangeText={setInviteInput}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={addInvitedPlayer}
              style={[styles.input]}
            />
            <PixelButton
              label="ADD"
              onPress={addInvitedPlayer}
              disabled={!inviteInput.trim() || isNaN(parseInt(inviteInput.trim()))}
              variant="secondary"
              size="small"
              style={styles.addButton}
            />
          </View>

          {invitedIds.length > 0 && (
            <View style={styles.invitedPlayersContainer}>
              <Text style={styles.invitedPlayersTitle}>INVITED PLAYERS</Text>
              <View style={styles.invitedPlayersList}>
                {invitedIds.map((playerId) => (
                  <View key={playerId} style={styles.invitedPlayerItem}>
                    <Text style={styles.invitedPlayerText}>Player #{playerId}</Text>
                    <PixelButton
                      label="✕"
                      onPress={() => removeInvitedPlayer(playerId)}
                      variant="danger"
                      size="small"
                      style={styles.removeButton}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <PixelButton
          label={isSubmitting ? "CREATING..." : "CREATE CAMPAIGN"}
          onPress={handleSubmit(onSubmit)}
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
  invitesContainer: {
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
  inviteInputContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: pixelTheme.spacing.sm,
    marginBottom: pixelTheme.spacing.md,
  },
  inviteInput: {
    flex: 1,
  },
  addButton: {
    paddingHorizontal: pixelTheme.spacing.md,
  },
  invitedPlayersContainer: {
    marginTop: pixelTheme.spacing.md,
  },
  invitedPlayersTitle: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 12,
    color: pixelTheme.colors.grayLight,
    textAlign: "center",
    marginBottom: pixelTheme.spacing.sm,
  },
  invitedPlayersList: {
    gap: pixelTheme.spacing.xs,
  },
  invitedPlayerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: pixelTheme.colors.backgroundLight,
    padding: pixelTheme.spacing.sm,
    borderRadius: pixelTheme.borderRadius.pixel,
    borderWidth: 1,
    borderColor: pixelTheme.colors.grayDark,
  },
  invitedPlayerText: {
    fontFamily: pixelTheme.fonts.regular,
    fontSize: 12,
    color: pixelTheme.colors.text,
  },
  removeButton: {
    minWidth: 30,
    paddingHorizontal: pixelTheme.spacing.xs,
  },
  button: {
    marginVertical: pixelTheme.spacing.sm,
  },
});

export default CreateCampaignScreen;
