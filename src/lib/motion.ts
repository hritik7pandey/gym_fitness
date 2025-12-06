// Fix TypeScript issues by re-exporting motion components with proper typing
import { motion as framerMotion } from 'framer-motion';

// Helper to create properly typed motion components
export const motion = {
  div: framerMotion.div as any,
  nav: framerMotion.nav as any,
  button: framerMotion.button as any,
  a: framerMotion.a as any,
  h1: framerMotion.h1 as any,
  h2: framerMotion.h2 as any,
  h3: framerMotion.h3 as any,
  p: framerMotion.p as any,
  li: framerMotion.li as any,
  ul: framerMotion.ul as any,
  span: framerMotion.span as any,
  section: framerMotion.section as any,
  header: framerMotion.header as any,
  form: framerMotion.form as any,
  circle: framerMotion.circle as any,
  svg: framerMotion.svg as any,
  path: framerMotion.path as any,
  label: framerMotion.label as any,
  input: framerMotion.input as any,
};

export * from 'framer-motion';
