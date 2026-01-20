-- ================================================
-- Twilio WhatsApp Business Integration - Database Schema
-- ================================================
-- This migration creates tables for storing WhatsApp conversations
-- and messages managed through Twilio API
-- ================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- Table: whatsapp_conversations
-- Purpose: Store conversation metadata between coaches and clients
-- ================================================
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Client information
    client_phone TEXT NOT NULL, -- Format: +41791234567
    client_name TEXT,
    
    -- Coach assignment
    coach_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Conversation status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
    
    -- Timestamps
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one conversation per client-coach pair
    CONSTRAINT unique_client_coach UNIQUE(client_phone, coach_id)
);

-- Index for fast lookups by coach
CREATE INDEX IF NOT EXISTS idx_conversations_coach 
ON whatsapp_conversations(coach_id, last_message_at DESC);

-- Index for fast lookups by phone
CREATE INDEX IF NOT EXISTS idx_conversations_phone 
ON whatsapp_conversations(client_phone);

-- ================================================
-- Table: whatsapp_messages
-- Purpose: Store individual messages in conversations
-- ================================================
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Conversation reference
    conversation_id UUID NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
    
    -- Twilio message data
    message_sid TEXT UNIQUE, -- Twilio unique message ID
    
    -- Message details
    from_phone TEXT NOT NULL,
    to_phone TEXT NOT NULL,
    body TEXT,
    media_url TEXT, -- URL for images/videos/documents
    media_type TEXT, -- MIME type of media
    
    -- Direction and status
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Index for conversation queries (most recent first)
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
ON whatsapp_messages(conversation_id, created_at DESC);

-- Index for Twilio SID lookups
CREATE INDEX IF NOT EXISTS idx_messages_sid 
ON whatsapp_messages(message_sid) WHERE message_sid IS NOT NULL;

-- ================================================
-- Function: Update conversation timestamp
-- Purpose: Automatically update last_message_at when new message arrives
-- ================================================
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE whatsapp_conversations
    SET 
        last_message_at = NEW.created_at,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update timestamp on new message
DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON whatsapp_messages;
CREATE TRIGGER trigger_update_conversation_timestamp
    AFTER INSERT ON whatsapp_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- ================================================
-- RLS (Row Level Security) Policies
-- ================================================

-- Enable RLS on tables
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- ================================================
-- Conversations RLS Policies
-- ================================================

-- Policy: Coaches can view their own conversations
CREATE POLICY "Coaches can view their conversations"
ON whatsapp_conversations
FOR SELECT
USING (
    auth.uid() = coach_id
    OR auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- Policy: Coaches can insert conversations (when client initiates via widget)
CREATE POLICY "Coaches can create conversations"
ON whatsapp_conversations
FOR INSERT
WITH CHECK (
    auth.uid() = coach_id
    OR auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- Policy: Coaches can update their conversations
CREATE POLICY "Coaches can update their conversations"
ON whatsapp_conversations
FOR UPDATE
USING (
    auth.uid() = coach_id
    OR auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- ================================================
-- Messages RLS Policies
-- ================================================

-- Policy: Coaches can view messages in their conversations
CREATE POLICY "Coaches can view messages in their conversations"
ON whatsapp_messages
FOR SELECT
USING (
    conversation_id IN (
        SELECT id FROM whatsapp_conversations
        WHERE coach_id = auth.uid()
    )
    OR auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- Policy: Coaches can insert messages in their conversations
CREATE POLICY "Coaches can create messages in their conversations"
ON whatsapp_messages
FOR INSERT
WITH CHECK (
    conversation_id IN (
        SELECT id FROM whatsapp_conversations
        WHERE coach_id = auth.uid()
    )
    OR auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- Policy: Coaches can update message status in their conversations
CREATE POLICY "Coaches can update messages in their conversations"
ON whatsapp_messages
FOR UPDATE
USING (
    conversation_id IN (
        SELECT id FROM whatsapp_conversations
        WHERE coach_id = auth.uid()
    )
    OR auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- ================================================
-- Helper Functions
-- ================================================

-- Function: Get unread message count per conversation
CREATE OR REPLACE FUNCTION get_unread_count(conv_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM whatsapp_messages
        WHERE conversation_id = conv_id
        AND direction = 'inbound'
        AND read_at IS NULL
    );
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Comments for documentation
-- ================================================
COMMENT ON TABLE whatsapp_conversations IS 'Stores WhatsApp conversation metadata between coaches and clients via Twilio';
COMMENT ON TABLE whatsapp_messages IS 'Stores individual WhatsApp messages sent/received via Twilio API';
COMMENT ON COLUMN whatsapp_messages.message_sid IS 'Twilio unique message identifier (SMxxxxxxx)';
COMMENT ON COLUMN whatsapp_messages.direction IS 'inbound: from client to coach, outbound: from coach to client';

-- ================================================
-- End of migration
-- ================================================
