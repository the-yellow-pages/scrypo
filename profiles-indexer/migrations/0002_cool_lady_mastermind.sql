-- Custom SQL migration file, put your code below! --

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  block_number NUMERIC(78,0),
  tx_hash TEXT,
  timestamp NUMERIC(78,0)
);