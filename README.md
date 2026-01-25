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

6. 🛡️ Secure Financial Transfer System
Implemented a robust fund transfer service using Prisma Transactions to ensure data integrity and atomicity.
Encapsulated Business Logic: Leveraged Object-Oriented Encapsulation by utilizing private helper methods for recipient resolution, balance validation, and transfer execution. This prevents the "Front Door" from being bypassed, ensuring all security checks are mandatory.
Database Isolation: Configured transaction logic to prevent race conditions (concurrency bugs), ensuring that financial state remains consistent even under high load.

7. 📝 Global Audit Logging & Observability
Developed a custom NestJS Interceptor to track system activity and maintain a persistent audit trail.
Reactive Logging with RxJS: Optimized the interceptor using the concatMap operator. This ensures that asynchronous database logging is handled synchronously within the request lifecycle, guaranteeing that an audit record is successfully written before the response is sent to the client.
Performance vs. Persistence: Balanced system throughput with data reliability by ensuring critical HTTP metadata (status codes, methods, and user IDs) are captured and stored for every request.