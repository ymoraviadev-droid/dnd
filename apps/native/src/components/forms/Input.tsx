import { forwardRef } from "react";
import { TextInput, TextInputProps, StyleProp, TextStyle } from "react-native";

type InputProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
};

const Input = forwardRef<TextInput, InputProps>(
  ({ style, placeholderTextColor = "gray", ...rest }, ref) => {
    return (
      <TextInput
        ref={ref}
        {...rest}
        placeholderTextColor={placeholderTextColor}
        style={[
          {
            borderBottomWidth: 1,
            borderBottomColor: "gray",
            width: "80%",
            marginBottom: 12,
            padding: 8,
            color: "white",
          },
          style,
        ]}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
