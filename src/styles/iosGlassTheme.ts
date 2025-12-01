/**
 * iOS 26 Glass UI Theme System
 * 
 * A production-ready glassmorphism theme following Apple's design language
 * with emphasis on depth, hierarchy, and visual clarity through transparency.
 * 
 * Design Philosophy:
 * - Soft, diffused blur creates depth without overwhelming content
 * - Semi-transparent backgrounds maintain visual connection to underlying layers
 * - Subtle borders simulate glass edges and enhance perceived quality
 * - Layered shadows provide elevation cues
 * - Saturation boost maintains color vibrancy through transparency
 */

export const iosGlassTheme = {
  /**
   * BLUR SCALE
   * Blur values calibrated for different UI hierarchy levels
   * Lower values (12-16px) for subtle elements, higher (20-25px) for prominent surfaces
   */
  blur: {
    soft: '12px',      // Inputs, small chips, subtle overlays
    medium: '16px',    // Cards, secondary panels
    strong: '20px',    // Primary panels, prominent cards
    overlay: '25px',   // Full-screen overlays, modals, backdrops
  },

  /**
   * SATURATION SCALE
   * Increases color vibrancy to compensate for transparency
   * Higher saturation prevents washed-out appearance
   */
  saturation: {
    normal: '150%',    // Standard cards and panels
    high: '180%',      // Interactive elements, modals
    ultra: '200%',     // Accent elements, active states
  },

  /**
   * BACKGROUND ALPHA VALUES
   * Transparency levels balancing aesthetics with readability
   * Lower alpha = more transparent (use with caution for text containers)
   */
  alpha: {
    ultraLight: 0.15,  // Maximum transparency - decorative elements only
    light: 0.25,       // Light panels, secondary cards
    normal: 0.35,      // Standard cards, default glass surfaces
    medium: 0.45,      // Prominent panels, important content containers
    strong: 0.55,      // Modals, overlays requiring focus
    solid: 0.70,       // Near-opaque, high-contrast content areas
  },

  /**
   * BORDER ALPHA VALUES
   * Subtle borders simulating glass edges
   * Too strong = looks artificial; too weak = loses definition
   */
  borderAlpha: {
    subtle: 0.20,      // Minimal definition
    normal: 0.35,      // Standard glass edge
    strong: 0.50,      // Emphasized borders, active states
  },

  /**
   * BORDER RADIUS SCALE
   * Rounded corners following iOS design language
   * Larger radius = more premium feel, smaller = more compact
   */
  radius: {
    xs: '8px',         // Tiny chips, badges
    sm: '12px',        // Small buttons, inputs
    md: '16px',        // Standard buttons, input fields
    lg: '20px',        // Cards, panels
    xl: '24px',        // Large cards
    xxl: '28px',       // Modals, prominent panels
    xxxl: '32px',      // Full-screen overlays, hero cards
  },

  /**
   * SHADOW SYSTEM
   * Multi-layer shadows create depth perception
   * Combines soft diffusion with subtle directional lighting
   */
  shadows: {
    // Subtle elevation - small cards, inputs
    sm: '0 4px 16px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02)',
    
    // Standard elevation - cards, buttons
    md: '0 8px 32px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.03)',
    
    // High elevation - modals, dropdowns
    lg: '0 12px 40px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(0, 0, 0, 0.04)',
    
    // Maximum elevation - overlays
    xl: '0 24px 64px rgba(0, 0, 0, 0.12), 0 12px 32px rgba(0, 0, 0, 0.06)',
  },

  /**
   * INSET HIGHLIGHTS
   * Top-edge glow simulating light reflection on glass
   * Creates premium, polished appearance
   */
  insetHighlight: {
    subtle: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    normal: 'inset 0 1px 0 rgba(255, 255, 255, 0.7)',
    strong: 'inset 0 2px 0 rgba(255, 255, 255, 0.8)',
  },

  /**
   * GRADIENT SYSTEM
   * Subtle gradients for buttons and accents
   * Maintains glass aesthetic while adding visual interest
   */
  gradients: {
    primary: 'linear-gradient(135deg, rgba(122, 167, 255, 0.9) 0%, rgba(99, 102, 241, 0.9) 100%)',
    success: 'linear-gradient(135deg, rgba(158, 245, 194, 0.9) 0%, rgba(74, 222, 128, 0.9) 100%)',
    warning: 'linear-gradient(135deg, rgba(255, 233, 163, 0.9) 0%, rgba(251, 191, 36, 0.9) 100%)',
    danger: 'linear-gradient(135deg, rgba(255, 183, 195, 0.9) 0%, rgba(239, 68, 68, 0.9) 100%)',
    
    // Glass-compatible gradients (more transparent)
    primaryGlass: 'linear-gradient(135deg, rgba(122, 167, 255, 0.4) 0%, rgba(99, 102, 241, 0.5) 100%)',
    accentGlow: 'radial-gradient(circle, rgba(122, 167, 255, 0.3) 0%, transparent 70%)',
  },

  /**
   * SPACING SCALE
   * Consistent spacing following 4px base unit
   */
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  /**
   * TYPOGRAPHY SCALE
   * SF Pro font family with iOS-inspired sizing
   */
  typography: {
    fontFamily: {
      display: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      text: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'SF Mono', Consolas, monospace",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '40px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      heavy: '800',
    },
  },

  /**
   * COLOR PALETTE
   * iOS-inspired colors with glass-compatible alpha variants
   */
  colors: {
    // Backgrounds
    background: {
      primary: 'rgba(255, 255, 255, 0.35)',
      secondary: 'rgba(255, 255, 255, 0.25)',
      tertiary: 'rgba(255, 255, 255, 0.15)',
    },
    
    // Text colors (optimized for glass backgrounds)
    text: {
      primary: 'rgba(28, 28, 30, 1)',
      secondary: 'rgba(28, 28, 30, 0.7)',
      tertiary: 'rgba(28, 28, 30, 0.5)',
      inverse: 'rgba(255, 255, 255, 1)',
    },
    
    // Border colors
    border: {
      light: 'rgba(255, 255, 255, 0.25)',
      normal: 'rgba(255, 255, 255, 0.35)',
      strong: 'rgba(255, 255, 255, 0.50)',
    },
    
    // Accent colors
    accent: {
      blue: '#7AA7FF',
      purple: '#8B5CF6',
      cyan: '#06B6D4',
      green: '#10B981',
      yellow: '#F59E0B',
      red: '#EF4444',
    },
  },

  /**
   * ANIMATION EASING
   * iOS-style spring curves and timing
   */
  easing: {
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    swift: 'cubic-bezier(0.4, 0, 0.2, 1)',
    entrance: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },

  /**
   * TRANSITION DURATIONS
   * Balanced timing for smooth, responsive interactions
   */
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
} as const;

/**
 * CSS VARIABLE EXPORT
 * For easy integration with existing CSS/SCSS
 */
export const iosGlassCSSVariables = `
  :root {
    /* Blur Scale */
    --glass-blur-soft: ${iosGlassTheme.blur.soft};
    --glass-blur-medium: ${iosGlassTheme.blur.medium};
    --glass-blur-strong: ${iosGlassTheme.blur.strong};
    --glass-blur-overlay: ${iosGlassTheme.blur.overlay};
    
    /* Alpha Values */
    --glass-alpha-ultra-light: ${iosGlassTheme.alpha.ultraLight};
    --glass-alpha-light: ${iosGlassTheme.alpha.light};
    --glass-alpha-normal: ${iosGlassTheme.alpha.normal};
    --glass-alpha-medium: ${iosGlassTheme.alpha.medium};
    --glass-alpha-strong: ${iosGlassTheme.alpha.strong};
    
    /* Border Radius */
    --glass-radius-sm: ${iosGlassTheme.radius.sm};
    --glass-radius-md: ${iosGlassTheme.radius.md};
    --glass-radius-lg: ${iosGlassTheme.radius.lg};
    --glass-radius-xl: ${iosGlassTheme.radius.xl};
    --glass-radius-xxl: ${iosGlassTheme.radius.xxl};
    
    /* Shadows */
    --glass-shadow-sm: ${iosGlassTheme.shadows.sm};
    --glass-shadow-md: ${iosGlassTheme.shadows.md};
    --glass-shadow-lg: ${iosGlassTheme.shadows.lg};
    
    /* Typography */
    --glass-font-display: ${iosGlassTheme.typography.fontFamily.display};
    --glass-font-text: ${iosGlassTheme.typography.fontFamily.text};
  }
`;

export type GlassTheme = typeof iosGlassTheme;
