const lightColorSet = {
  // Core Colors
  mainThemeBackgroundColor: "#f5f5f5",
  mainThemeForegroundColor: "#333333",
  
  // Extended Palette
  primary: "#4a6fa5",       // Soft blue
  secondary: "#a56f4a",     // Complementary warm brown
  accent: "#6b4aa5",        // Vibrant purple
  success: "#4aa56f",       // Fresh green
  warning: "#a5a54a",       // Golden yellow
  danger: "#a54a4a",        // Soft red
  
  // Neutrals
  lightGray: "#e0e0e0",
  mediumGray: "#9e9e9e",
  darkGray: "#424242",
  
  // Specials
  highlight: "rgba(74, 111, 165, 0.1)",  // Primary with 10% opacity
  cardShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const darkColorSet = {
  // Core Colors
  mainThemeBackgroundColor: "#1c1c1c",
  mainThemeForegroundColor: "#ffffff",
  
  // Extended Palette (darker tones)
  primary: "#5d8fd8",       // Brighter blue
  secondary: "#d88f5d",     // Warm orange
  accent: "#8f5dd8",        // Bright purple
  success: "#5dd88f",       // Bright green
  warning: "#d8d85d",       // Vibrant yellow
  danger: "#d85d5d",        // Bright red
  
  // Neutrals
  lightGray: "#424242",
  mediumGray: "#757575",
  darkGray: "#e0e0e0",
  
  // Specials
  highlight: "rgba(93, 143, 216, 0.2)",  // Primary with 20% opacity
  cardShadow: "0 2px 8px rgba(0,0,0,0.3)",
};

const colorSet = {
  ...lightColorSet,
  light: lightColorSet,
  dark: darkColorSet,
  "no-preference": lightColorSet,
};

// Additional styling constants
const typography = {
  fontFamily: "'Inter', -apple-system, sans-serif",
  fontSize: {
    small: "0.875rem",
    regular: "1rem",
    large: "1.25rem",
    xlarge: "1.5rem",
    xxlarge: "2rem"
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700
  },
  lineHeight: 1.6
};

const spacing = {
  small: "0.5rem",
  medium: "1rem",
  large: "1.5rem",
  xlarge: "2rem",
  xxlarge: "3rem"
};

const borderRadius = {
  small: "4px",
  medium: "8px",
  large: "12px",
  xlarge: "16px",
  full: "9999px"
};

const transitions = {
  fast: "0.15s ease",
  medium: "0.3s ease",
  slow: "0.5s ease"
};

const StyleDict = {
  colorSet,
  typography,
  spacing,
  borderRadius,
  transitions,
  
  // Predefined styles
  card: {
    backgroundColor: "var(--mainThemeBackgroundColor)",
    borderRadius: "var(--borderRadiusMedium)",
    padding: "var(--spacingMedium)",
    boxShadow: "var(--cardShadow)",
    transition: "var(--transitionMedium)"
  },
  
  button: {
    primary: {
      backgroundColor: "var(--primary)",
      color: "white",
      padding: "var(--spacingSmall) var(--spacingMedium)",
      borderRadius: "var(--borderRadiusMedium)",
      "&:hover": {
        filter: "brightness(1.1)"
      }
    },
    secondary: {
      backgroundColor: "var(--secondary)",
      color: "white",
      padding: "var(--spacingSmall) var(--spacingMedium)",
      borderRadius: "var(--borderRadiusMedium)",
      "&:hover": {
        filter: "brightness(1.1)"
      }
    }
  }
};

export default StyleDict;