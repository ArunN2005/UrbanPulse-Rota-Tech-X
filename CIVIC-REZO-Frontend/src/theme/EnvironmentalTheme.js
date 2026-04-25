// CivicStack Design System
// A refined, professional civic platform aesthetic

export const EnvironmentalTheme = {
  // Primary — Deep Teal (restrained, institutional)
  primary: {
    main: '#0F766E',      // Teal 700
    light: '#14B8A6',     // Teal 500
    dark: '#0D5D56',      // Teal 800
    surface: '#F0FDFA',   // Teal 50
  },

  // Secondary — Slate (professional depth)
  secondary: {
    main: '#334155',      // Slate 700
    light: '#64748B',     // Slate 500
    dark: '#1E293B',      // Slate 800
    surface: '#F8FAFC',   // Slate 50
  },

  // Accent Colors — Muted, purposeful
  accent: {
    amber: '#D97706',     // Warm amber for warnings
    brown: '#78716C',     // Stone 500
    teal: '#0F766E',      // Same as primary for consistency
    lime: '#0F766E',      // Unified accent
  },

  // Neutral Colors — True neutrals
  neutral: {
    white: '#FFFFFF',
    light: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#E5E5E5',
    gray300: '#D4D4D4',
    gray500: '#737373',
    gray700: '#404040',
    gray900: '#171717',
    black: '#0A0A0A',
  },

  // Status Colors — Clear, accessible
  status: {
    success: '#059669',   // Emerald 600
    warning: '#D97706',   // Amber 600
    error: '#DC2626',     // Red 600
    info: '#0284C7',      // Sky 600
  },

  // Gradients — Subtle, not overwhelming
  gradients: {
    primary: ['#0F766E', '#14B8A6'],
    secondary: ['#1E293B', '#334155'],
    sunset: ['#D97706', '#F59E0B'],
    forest: ['#0D5D56', '#0F766E'],       // Used by citizen header
    ocean: ['#1E293B', '#334155'],         // Used by admin header
  },

  // Spacing System (4px base)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border Radius — Slightly softer
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    round: 50,
  },

  // Typography — Clean hierarchy
  typography: {
    h1: { fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
    h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3 },
    h3: { fontSize: 20, fontWeight: '600' },
    h4: { fontSize: 17, fontWeight: '600' },
    body1: { fontSize: 15, fontWeight: '400' },
    body2: { fontSize: 13, fontWeight: '400' },
    caption: { fontSize: 11, fontWeight: '400' },
  },

  // Shadows — Subtle, realistic
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export default EnvironmentalTheme;
