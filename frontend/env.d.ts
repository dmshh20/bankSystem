interface ImportMetaEnv {
  readonly VITE_SIGNIN: string;
  readonly VITE_OTPVERIFY: string;
  readonly VITE_SIGNUP: string;
  readonly VITE_EMAIL_VERIFY_BEFORE_FORGET_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
