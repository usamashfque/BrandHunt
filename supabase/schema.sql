-- Create companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guards table
CREATE TABLE guards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  photo TEXT,
  experience TEXT NOT NULL,
  languages TEXT[] NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  company_id UUID REFERENCES companies(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  background TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requests table
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  guards_required INTEGER NOT NULL,
  selected_guards UUID[] REFERENCES guards(id),
  comment TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processed', 'paid', 'completed')),
  total_cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id),
  amount DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  company TEXT,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'customer')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE guards ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow full access to authenticated users" ON companies
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access to authenticated users" ON guards
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access to authenticated users" ON requests
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access to authenticated users" ON payments
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access to authenticated users" ON conversations
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access to authenticated users" ON chat_messages
  FOR ALL TO authenticated USING (true);

-- Create sample data
INSERT INTO companies (name, location, contact, phone, website)
VALUES
  ('Elite Security', 'New York, NY', 'contact@elitesecurity.com', '+1 (555) 123-4567', 'elitesecurity.com'),
  ('Guardian Force', 'Los Angeles, CA', 'info@guardianforce.com', '+1 (555) 987-6543', 'guardianforce.com'),
  ('Secure Shield', 'Chicago, IL', 'support@secureshield.com', '+1 (555) 456-7890', 'secureshield.com');

-- Insert sample security guards
INSERT INTO guards (name, experience, languages, email, phone, rate, company_id, status)
VALUES
  ('John Doe', '5 years', ARRAY['English', 'Spanish'], 'john.doe@example.com', '+1 (555) 123-4567', 25.00, 
   (SELECT id FROM companies WHERE name = 'Elite Security'), 'active'),
  ('Jane Smith', '3 years', ARRAY['English', 'French'], 'jane.smith@example.com', '+1 (555) 987-6543', 22.00, 
   (SELECT id FROM companies WHERE name = 'Guardian Force'), 'active'),
  ('Michael Johnson', '7 years', ARRAY['English', 'German'], 'michael.johnson@example.com', '+1 (555) 456-7890', 30.00, 
   (SELECT id FROM companies WHERE name = 'Secure Shield'), 'inactive'),
  ('Emily Williams', '2 years', ARRAY['English'], 'emily.williams@example.com', '+1 (555) 234-5678', 20.00, NULL, 'active');

-- Insert sample requests
INSERT INTO requests (client_name, client_email, client_phone, location, start_date, end_date, guards_required, status)
VALUES
  ('Acme Corp', 'events@acmecorp.com', '+1 (555) 111-2222', '123 Main St, New York, NY', 
   NOW() + INTERVAL '7 days', NOW() + INTERVAL '8 days', 3, 'pending'),
  ('TechStart Inc', 'security@techstart.com', '+1 (555) 333-4444', '456 Tech Blvd, San Francisco, CA', 
   NOW() + INTERVAL '14 days', NOW() + INTERVAL '15 days', 2, 'processed'),
  ('Global Events', 'info@globalevents.com', '+1 (555) 555-6666', '789 Event Center, Chicago, IL', 
   NOW() + INTERVAL '21 days', NOW() + INTERVAL '22 days', 5, 'paid');

-- Insert sample payments
INSERT INTO payments (request_id, amount, date, method, status)
VALUES
  ((SELECT id FROM requests WHERE client_name = 'Global Events'), 1250.00, NOW() - INTERVAL '2 days', 'Credit Card', 'completed');

-- Insert sample conversations
INSERT INTO conversations (client_name, client_email, company, last_message, last_message_time, unread_count)
VALUES
  ('John Smith', 'john.smith@acmecorp.com', 'Acme Corp', 'When will the security guards arrive?', NOW() - INTERVAL '2 hours', 2),
  ('Sarah Johnson', 'sarah@techstart.com', 'TechStart Inc', 'Thanks for the quick response!', NOW() - INTERVAL '1 day', 0),
  ('Michael Brown', 'michael@globalevents.com', 'Global Events', 'Can we add one more guard to our request?', NOW() - INTERVAL '1 day', 1);

-- Insert sample chat messages
INSERT INTO chat_messages (conversation_id, sender_id, sender_type, content)
VALUES
  ((SELECT id FROM conversations WHERE client_name = 'John Smith'), 'john.smith@acmecorp.com', 'customer', 
   'Hello, I have a question about our security request for the upcoming event.'),
  ((SELECT id FROM conversations WHERE client_name = 'John Smith'), 'admin', 'admin', 
   'Hi John, I''d be happy to help. What would you like to know about your request?'),
  ((SELECT id FROM conversations WHERE client_name = 'John Smith'), 'john.smith@acmecorp.com', 'customer', 
   'When will the security guards arrive at our venue? The event starts at 7 PM but we need them earlier for setup.'),
  ((SELECT id FROM conversations WHERE client_name = 'John Smith'), 'admin', 'admin', 
   'I''ve checked your request details. The security team is scheduled to arrive at 5 PM, which is 2 hours before your event starts. Is that early enough for your setup needs?'),
  ((SELECT id FROM conversations WHERE client_name = 'John Smith'), 'john.smith@acmecorp.com', 'customer', 
   'That should work, but can we make it 4:30 PM instead? We have some VIP guests arriving early.');
