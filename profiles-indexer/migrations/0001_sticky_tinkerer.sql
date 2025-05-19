-- Custom SQL migration file, put your code below! --

-- Add public key fields to profiles table
ALTER TABLE profiles
    ADD COLUMN pubkey_hi numeric,
    ADD COLUMN pubkey_lo numeric;