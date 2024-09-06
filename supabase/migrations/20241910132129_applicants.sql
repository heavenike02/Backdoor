-- Create an enum for application status
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create an enum for tenant status
CREATE TYPE tenant_status AS ENUM ('active', 'inactive', 'former');

-- Create a table for Applicants
CREATE TABLE applicants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create a table for Applicant Details
CREATE TABLE applicant_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
    rental_history JSONB[],
    gender VARCHAR(10),
    date_of_birth DATE,
    current_address TEXT,
    employment_type VARCHAR(50),
    annual_income DECIMAL(12, 2),
    credit_score INT
);

-- Create a table for Screening Invitations
CREATE TABLE screening_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
    invitation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT
);

-- Create a table for Property Applications
CREATE TABLE property_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    occupants_count INT DEFAULT 1,
    desired_move_in_date DATE,
    application_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pets BOOLEAN DEFAULT FALSE,
    pet_details TEXT,
    notes TEXT
);

INSERT INTO storage.buckets
  (id, name)
VALUES
  ('application_documents', 'application_documents');

-- Create a table for Application Documents
CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES property_applications(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for Tenants (converted from approved applicants)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID REFERENCES applicants(id),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    status tenant_status DEFAULT 'active',
    lease_start_date DATE,
    lease_end_date DATE,
    rent_amount DECIMAL(10, 2),
    security_deposit DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indices for better query performance
CREATE INDEX idx_property_applications_property_id ON property_applications(property_id);
CREATE INDEX idx_property_applications_applicant_id ON property_applications(applicant_id);
CREATE INDEX idx_application_documents_application_id ON application_documents(application_id);
CREATE INDEX idx_tenants_applicant_id ON tenants(applicant_id);
CREATE INDEX idx_tenants_property_id ON tenants(property_id);
CREATE INDEX idx_property_applications_organization_id ON property_applications(organization_id);

-- Create policies for row-level security

-- Applicants table policies
CREATE POLICY "Users can view their own applicant profile" 
ON applicants FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applicant profile" 
ON applicants FOR UPDATE 
USING (auth.uid() = user_id);

-- Applicant Details table policies
CREATE POLICY "Users can view their own applicant details" 
ON applicant_details FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM applicants WHERE id = applicant_details.applicant_id));

-- Screening Invitations table policies
CREATE POLICY "Users can view their own screening invitations" 
ON screening_invitations FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM applicants WHERE id = screening_invitations.applicant_id));

-- Property Applications table policies
CREATE POLICY "Applicants can view their own applications" 
ON property_applications FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM applicants WHERE id = property_applications.applicant_id));

CREATE POLICY "Organization members can view property applications" 
ON property_applications FOR SELECT 
USING (auth.uid() IN (
    SELECT member_id 
    FROM organization_members 
    WHERE organization_id = (SELECT organization_id FROM properties WHERE id = property_applications.property_id)
));

-- Application Documents table policies
CREATE POLICY "Applicants can view their own documents" 
ON application_documents FOR SELECT 
USING (auth.uid() IN (
    SELECT applicants.user_id 
    FROM applicants 
    JOIN property_applications ON applicants.id = property_applications.applicant_id 
    WHERE property_applications.id = application_documents.application_id
));

-- Tenants table policies
CREATE POLICY "Organization members can view tenants" 
ON tenants FOR SELECT 
USING (auth.uid() IN (
    SELECT member_id 
    FROM organization_members 
    WHERE organization_id = (SELECT organization_id FROM properties WHERE id = tenants.property_id)
));

-- Enable Row Level Security on the new tables
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicant_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;