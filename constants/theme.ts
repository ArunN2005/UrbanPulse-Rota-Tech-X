/**
 * Civic Noir design system.
 *
 * fontFamily values must match the exact names loaded via useFonts() in app/_layout.tsx.
 * Using generic names like 'Inter'/'Epilogue' silently falls back to the system font.
 * Weight is baked into each family name, so tokens do not set fontWeight.
 */

export const Fonts = {
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  label: 'Inter_600SemiBold',
  labelBold: 'Inter_700Bold',
  headline: 'Epilogue_500Medium',
  headlineSemiBold: 'Epilogue_600SemiBold',
  display: 'Epilogue_700Bold',
} as const;

const palette = {
  surfaceBright: '#f7f9ff',
  surfaceContainerHigh: '#e6e8ee',
  primary: '#000000',
  onPrimary: '#ffffff',
  secondary: '#5d5f5f',
  onSurface: '#181c20',
  outline: '#7e7576',
  surfaceContainerLowest: '#ffffff',
  success: '#1b7f4d',
  danger: '#b3261e',
};

export const CivicNoirTheme = {
  colors: {
    ...palette,
    // Hairlines and washes derived from outline/primary, pre-mixed for consistency.
    outlineFaint: palette.outline + '20',
    outlineSoft: palette.outline + '30',
    outlineMedium: palette.outline + '50',
    pressedWash: palette.primary + '0d',
  },
  typography: {
    labelSm: { fontFamily: Fonts.label, fontSize: 12, letterSpacing: 1 },
    labelMd: { fontFamily: Fonts.label, fontSize: 14, letterSpacing: 0.5 },
    displayXl: { fontFamily: Fonts.display, fontSize: 72, letterSpacing: -2.88 },
    headlineMd: { fontFamily: Fonts.headline, fontSize: 24, letterSpacing: -0.24 },
    headlineLg: { fontFamily: Fonts.headlineSemiBold, fontSize: 40, letterSpacing: -0.8 },
    bodyMd: { fontFamily: Fonts.body, fontSize: 16 },
    bodyLg: { fontFamily: Fonts.body, fontSize: 18 },
  },
  spacing: {
    margin: 64,
    gutter: 32,
    unit: 8,
    stackLg: 80,
    stackMd: 32,
    stackSm: 16,
  },
  // Minimum touch target per platform accessibility guidance.
  hitTarget: 44,
  motion: {
    fast: 150,
    base: 300,
    slow: 500,
  },
} as const;
