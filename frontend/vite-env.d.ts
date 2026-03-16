interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.html?raw" {
  const content: string;
  export default content;
}
