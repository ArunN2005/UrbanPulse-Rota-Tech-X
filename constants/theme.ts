export const CivicNoirTheme = {
  colors: {
    surfaceBright: '#f7f9ff',
    surfaceContainerHigh: '#e6e8ee',
    primary: '#000000',
    onPrimary: '#ffffff',
    secondary: '#5d5f5f',
    onSurface: '#181c20',
    outline: '#7e7576',
    surfaceContainerLowest: '#ffffff',
  },
  // fontFamily values must match the exact names loaded via useFonts() in app/_layout.tsx.
  // Using generic names like 'Inter'/'Epilogue' silently falls back to the system font.
  typography: {
    labelSm: { fontFamily: 'Inter_600SemiBold', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
    displayXl: { fontFamily: 'Epilogue_700Bold', fontSize: 72, fontWeight: '700', letterSpacing: -2.88 },
    headlineMd: { fontFamily: 'Epilogue_500Medium', fontSize: 24, fontWeight: '500', letterSpacing: -0.24 },
    headlineLg: { fontFamily: 'Epilogue_600SemiBold', fontSize: 40, fontWeight: '600', letterSpacing: -0.8 },
    bodyMd: { fontFamily: 'Inter_400Regular', fontSize: 16, fontWeight: '400' },
    bodyLg: { fontFamily: 'Inter_400Regular', fontSize: 18, fontWeight: '400' },
  },
  spacing: {
    margin: 64,
    gutter: 32,
    unit: 8,
    stackLg: 80,
    stackMd: 32,
    stackSm: 16,
  }
};
