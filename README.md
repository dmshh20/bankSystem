# BANK SYSTEM


## WHAT DID I ON THIS PROJECT?

🛠 Tech Stack & Implementation Highlights

1. Secure MFA Password Reset3-Step Verification: Implemented a flow requiring Identity (Email) $\rightarrow$ Possession (OTP) $\rightarrow$ Authorization (Reset Token).Token Scoping: Backend issues a short-lived (15m) JWT only after successful OTP verification to prevent Privilege Escalation.

2. Advanced Error Architecture
Fail-Fast & "Bubble Up": Errors propagate to a global handler to preserve the Stack Trace, ensuring high observability and easier debugging.
Error Translation: Specifically mapped database constraints (e.g., Prisma P2002) to human-readable exceptions, avoiding Error Masking.

3. Cryptography & Security
Blind Indexing: Card numbers are hashed for fast, secure database lookups without exposing raw data.
Salted Hashing: Utilized bcrypt for passwords and hashed OTPs before storing them in Redis.

4. Frontend Integrity (React)
Race Condition Mitigation: Synchronized UI transitions with server responses, ensuring the user only proceeds after the API "Green Light."
Atomic State: Leveraged localStorage and location.state to securely pass temporary tokens between flow steps.

5. Redis Integration
Volatile Caching: Used Redis for OTP storage with a 5-minute TTL (Time-To-Live) to reduce the system's Attack Surface.