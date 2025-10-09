-- Add destination_name column to contact_messages table
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS destination_name TEXT;
