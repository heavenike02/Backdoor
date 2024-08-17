


-- Create an enum for property types

CREATE TYPE property_status AS ENUM ('active', 'closed');

-- Create an enum for standalone property types
CREATE TYPE property_type AS ENUM (
    'Detached', 'Semi Detached', 'Terraced', 'Flat', 'Studio Flat',
    'Converted Flat', 'Purpose Built', 'Bungalow', 'Corner House',
    'Commercial', 'Other'
);


CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    organization_id UUID NOT NULL,

    property_type property_type,
    is_furnished BOOLEAN DEFAULT FALSE,
    num_bathrooms INT DEFAULT 0,
    
    num_floors INT DEFAULT 1,
    address_line_one VARCHAR(255) NOT NULL,
    address_line_two VARCHAR(255),
    status property_status DEFAULT 'active' NOT NULL,
    post_code VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province_county VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    rent_price INT DEFAULT 0 NOT NULL,
    description TEXT,
    created_by UUID NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id) 
        REFERENCES organizations(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_created_by
        FOREIGN KEY (created_by) 
        REFERENCES user_profiles(id)
        ON DELETE CASCADE
);
-- Add indices for better query performance
CREATE INDEX idx_properties_organization_id ON properties(organization_id);
CREATE INDEX idx_properties_created_by ON properties(created_by);

-- Create an enum for room types
CREATE TYPE room_type AS ENUM (
    'living room', 'kitchen', 'dining room', 'office', 'laundry room', 
    'garage', 'attic', 'basement', 'playroom', 'guest room', 'mudroom', 
    'sunroom', 'pantry', 'home theater', 'other'
);

-- Create a Rooms table
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_type room_type NOT NULL,
    custom_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add an index to improve query performance
CREATE INDEX idx_rooms_property_id ON rooms(property_id);




-- Create an Amenities table
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Create a junction table for Property-Amenity relationships
CREATE TABLE property_amenities (
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- Add some initial amenities
INSERT INTO amenities (name) VALUES 
    ('Balcony'),
    ('Smart home');

-- Add indices to improve query performance
CREATE INDEX idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX idx_property_amenities_amenity_id ON property_amenities(amenity_id);

-- Create a table for Property Photos
CREATE TABLE property_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    file_size INT NOT NULL,
    storage_bucket VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT file_type_check CHECK (file_type IN ('jpeg', 'jpg', 'png'))
);

-- Add an index to improve query performance
CREATE INDEX idx_property_photos_property_id ON property_photos(property_id);

-- Create an enum for document types
CREATE TYPE document_type AS ENUM (
    'Gas Safety Certificate'
    -- Add other document types here as needed
);

-- Create an enum for renewal frequency
CREATE TYPE renewal_frequency AS ENUM (
    'Every Year',
    'Every 2 Years',
    'Every 5 Years',
    'One-time'
    -- Add other frequencies as needed
);

-- Create a table for Compliance Documents
CREATE TABLE compliance_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    expiry_date DATE NOT NULL,
    renewal_frequency renewal_frequency NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add an index to improve query performance
CREATE INDEX idx_compliance_documents_property_id ON compliance_documents(property_id);



-- Create a policy for property access
CREATE POLICY "Organization members can view properties" ON properties
FOR SELECT
USING (
    auth.uid() IN (
        SELECT member_id 
        FROM organization_members 
        WHERE organization_id = properties.organization_id
    )
);


-- Create a policy for property insertion
CREATE POLICY "Organization members can insert properties" ON properties
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT member_id 
        FROM organization_members 
        WHERE organization_id = properties.organization_id
    )
);

-- Create a policy for property updates
CREATE POLICY "Organization members can update their own properties" ON properties
FOR UPDATE
USING (
    auth.uid() = created_by
    AND
    auth.uid() IN (
        SELECT member_id 
        FROM organization_members 
        WHERE organization_id = properties.organization_id
    )
);



-- Create a policy for property deletion
CREATE POLICY "Organization members can delete their own properties" ON properties
FOR DELETE
USING (
    auth.uid() = created_by
    AND
    auth.uid() IN (
        SELECT member_id 
        FROM organization_members 
        WHERE organization_id = properties.organization_id
    )
);

-- Enable Row Level Security on the properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
