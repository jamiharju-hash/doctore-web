# Security Specification: Doctore AI

## 1. Data Invariants
- A **User** profile must match the authenticated `request.auth.uid`.
- A **Bet** must have a document ID matching `${userId}_${signalId}` to ensure atomicity and uniqueness (MVP rule: one bet per signal).
- **Signals** are system-generated and read-only for all authenticated users.
- **ModelMetrics** are read-only for authenticated users.
- **FeatureFlags** are private to the user.

## 2. The "Dirty Dozen" Payloads (Denial Scenarios)
1. **Identity Spoofing**: Attempt to create a `users/victim_uid` document while authenticated as `attacker_uid`.
2. **Resource Poisoning**: Attempt to set a `signalId` or `userId` over 128 characters or with malicious symbols.
3. **Kelly Overflow**: Attempt to set `kellyFraction` to 5.0 (500%).
4. **Shadow Field Injection**: Attempt to create a user with an undocumented `isAdmin: true` field.
5. **Timestamp Fraud**: Attempt to set `createdAt` to a date in the past instead of `request.time`.
6. **Orphaned Bet**: Attempt to create a bet for a non-existent `signalId` (validated via check).
7. **Result Manipulation**: A user attempting to update their own bet `result` from `null` to `WIN`.
8. **Plan Escalation**: A user attempting to change their `plan` from `free` to `pro` via a standard update.
9. **Global Scraping**: Attempting a `list` on `users` collection.
10. **Signal Tampering**: Attempting to `delete` or `update` a system signal.
11. **Negative Staking**: Attempting to log a bet with `stake: -10`.
12. **ID Poisoning**: Injecting 1MB strings into a document ID path.

## 3. Test Runner (Conceptual)
The `firestore.rules` will be validated against these payloads using strict `isValid[Entity]` helpers and `affectedKeys().hasOnly()` gates.
