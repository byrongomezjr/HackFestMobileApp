// Smart Campus Wallet - Red Theme Color Palette for Rutgers University

export type ThemeColors = {
    // Primary Red Theme
    primary: string;
    primaryLight: string;
    primaryDark: string;
    primaryAccent: string;

    // Secondary Colors
    secondary: string;
    secondaryLight: string;

    // Success
    success: string;
    successLight: string;

    // Warning
    warning: string;
    warningLight: string;

    // Error/Danger
    error: string;
    errorLight: string;

    // Info
    info: string;
    infoLight: string;

    // Backgrounds
    background: string;
    surface: string;
    card: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textLight: string;
    textInverse: string;

    // Borders
    border: string;
    borderDark: string;

    // Wallet Colors
    walletDining: string;
    walletTickets: string;
    walletLaundry: string;
    walletPrinting: string;
};

export const LightTheme: ThemeColors = {
    // Primary Red Theme
    primary: '#DC2626',
    primaryLight: '#FEE2E2',
    primaryDark: '#991B1B',
    primaryAccent: '#F87171',

    // Secondary Colors
    secondary: '#F59E0B',
    secondaryLight: '#FEF3C7',

    // Success
    success: '#10B981',
    successLight: '#D1FAE5',

    // Warning
    warning: '#F59E0B',
    warningLight: '#FEF3C7',

    // Error/Danger
    error: '#EF4444',
    errorLight: '#FEF2F2',

    // Info
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    // Backgrounds
    background: '#F9FAFB',
    surface: '#FFFFFF',
    card: '#FFFFFF',

    // Text
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    textInverse: '#FFFFFF',

    // Borders
    border: '#E5E7EB',
    borderDark: '#D1D5DB',

    // Wallet Colors
    walletDining: '#DC2626',
    walletTickets: '#F59E0B',
    walletLaundry: '#3B82F6',
    walletPrinting: '#8B5CF6',
};

export const DarkTheme: ThemeColors = {
    // Primary Red Theme (slightly adjusted for dark mode)
    primary: '#EF4444',
    primaryLight: '#7F1D1D',
    primaryDark: '#DC2626',
    primaryAccent: '#F87171',

    // Secondary Colors
    secondary: '#FBBF24',
    secondaryLight: '#78350F',

    // Success
    success: '#34D399',
    successLight: '#064E3B',

    // Warning
    warning: '#FBBF24',
    warningLight: '#78350F',

    // Error/Danger
    error: '#F87171',
    errorLight: '#7F1D1D',

    // Info
    info: '#60A5FA',
    infoLight: '#1E3A8A',

    // Backgrounds
    background: '#111827',
    surface: '#1F2937',
    card: '#1F2937',

    // Text
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textLight: '#9CA3AF',
    textInverse: '#111827',

    // Borders
    border: '#374151',
    borderDark: '#4B5563',

    // Wallet Colors (brighter for dark mode)
    walletDining: '#EF4444',
    walletTickets: '#FBBF24',
    walletLaundry: '#60A5FA',
    walletPrinting: '#A78BFA',
};

// Default export for backward compatibility
export const Colors = LightTheme;
export default Colors;

