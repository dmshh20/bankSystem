interface ImportMetaEnv {
  readonly VITE_SIGNIN: string;
  readonly VITE_OTPVERIFY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
