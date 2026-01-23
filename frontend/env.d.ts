interface ImportMetaEnv {
  readonly VITE_SIGNIN: string;
  readonly VITE_OTPVERIFY: string;
  readonly VITE_SIGNUP: string;
  readonly VITE_FORGET_PASSWORD_EMAIL_VERIFY: string
  readonly VITE_FORGET_PASSWORD_ENTER_OTP: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
