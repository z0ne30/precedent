// Basic type declaration to satisfy TypeScript for Vanta effects
// This doesn't provide full type safety for Vanta options,
// but it resolves the module import error.

declare module 'vanta/dist/vanta.net.min' {
  const VANTA: any; // Use 'any' as specific types are not available
  export default VANTA;
}

// Add declarations for other Vanta effects if you plan to use them dynamically
declare module 'vanta/dist/vanta.fog.min' {
  const VANTA: any;
  export default VANTA;
}
declare module 'vanta/dist/vanta.waves.min' {
  const VANTA: any;
  export default VANTA;
}
declare module 'vanta/dist/vanta.clouds.min' {
  const VANTA: any;
  export default VANTA;
}
// Add other effects as needed...