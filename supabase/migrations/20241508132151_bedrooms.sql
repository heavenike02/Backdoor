-- Create a table for bedrooms with rent price
CREATE TABLE bedrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    beds INT NOT NULL DEFAULT 1,
    name VARCHAR(100) NOT NULL,
    bedroom_number SERIAL, -- Changed to SERIAL for auto-incrementing
    rent_price INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, bedroom_number)
);

-- Add an index to improve query performance
CREATE INDEX idx_bedrooms_property_id ON bedrooms(property_id);

-- Create a policy for bedroom access
CREATE POLICY "Organization members can view bedrooms" ON bedrooms
FOR SELECT
USING (
    auth.uid() IN (
        SELECT member_id 
        FROM organization_members 
        WHERE organization_id = (SELECT organization_id FROM properties WHERE id = bedrooms.property_id)
    )
);

-- Create a policy for bedroom insertion
CREATE POLICY "Organization members can insert bedrooms" ON bedrooms
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT member_id 
        FROM organization_members 
        WHERE organization_id = (SELECT organization_id FROM properties WHERE id = bedrooms.property_id)
    )
);

-- Create a policy for bedroom updates
CREATE POLICY "Organization members can update bedrooms" ON bedrooms
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT member_id 
        FROM organization_members 
        WHERE organization_id = (SELECT organization_id FROM properties WHERE id = bedrooms.property_id)
    )
);

-- Create a policy for bedroom deletion
CREATE POLICY "Organization members can delete bedrooms" ON bedrooms
FOR DELETE
USING (
    auth.uid() IN (
        SELECT member_id 
        FROM organization_members 
        WHERE organization_id = (SELECT organization_id FROM properties WHERE id = bedrooms.property_id)
    )
);

-- Enable Row Level Security on the bedrooms table
ALTER TABLE bedrooms ENABLE ROW LEVEL SECURITY;