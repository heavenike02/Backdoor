export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_delete_tokens: {
        Row: {
          token: string
          user_id: string
        }
        Insert: {
          token?: string
          user_id: string
        }
        Update: {
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_delete_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      amenities: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      applicant_details: {
        Row: {
          annual_income: number | null
          applicant_id: string | null
          credit_score: number | null
          current_address: string | null
          date_of_birth: string | null
          employment_type: string | null
          gender: string | null
          id: string
          rental_history: Json[] | null
        }
        Insert: {
          annual_income?: number | null
          applicant_id?: string | null
          credit_score?: number | null
          current_address?: string | null
          date_of_birth?: string | null
          employment_type?: string | null
          gender?: string | null
          id?: string
          rental_history?: Json[] | null
        }
        Update: {
          annual_income?: number | null
          applicant_id?: string | null
          credit_score?: number | null
          current_address?: string | null
          date_of_birth?: string | null
          employment_type?: string | null
          gender?: string | null
          id?: string
          rental_history?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_details_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      applicants: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone_number: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone_number?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone_number?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      application_documents: {
        Row: {
          application_id: string | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          uploaded_at: string | null
        }
        Insert: {
          application_id?: string | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          uploaded_at?: string | null
        }
        Update: {
          application_id?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "property_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      bedrooms: {
        Row: {
          bedroom_number: number
          beds: number
          created_at: string | null
          id: string
          name: string
          property_id: string
          rent_price: number
        }
        Insert: {
          bedroom_number?: number
          beds?: number
          created_at?: string | null
          id?: string
          name: string
          property_id: string
          rent_price: number
        }
        Update: {
          bedroom_number?: number
          beds?: number
          created_at?: string | null
          id?: string
          name?: string
          property_id?: string
          rent_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "bedrooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_documents: {
        Row: {
          document_type: Database["public"]["Enums"]["document_type"]
          expiry_date: string
          file_name: string | null
          file_path: string | null
          id: string
          property_id: string | null
          renewal_frequency: Database["public"]["Enums"]["renewal_frequency"]
          upload_date: string | null
        }
        Insert: {
          document_type: Database["public"]["Enums"]["document_type"]
          expiry_date: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          property_id?: string | null
          renewal_frequency: Database["public"]["Enums"]["renewal_frequency"]
          upload_date?: string | null
        }
        Update: {
          document_type?: Database["public"]["Enums"]["document_type"]
          expiry_date?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          property_id?: string | null
          renewal_frequency?: Database["public"]["Enums"]["renewal_frequency"]
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          organization_id: string
          stripe_customer_id: string
        }
        Insert: {
          organization_id: string
          stripe_customer_id: string
        }
        Update: {
          organization_id?: string
          stripe_customer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leases: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          lease_length: number
          lease_type: Database["public"]["Enums"]["lease_type"]
          property_id: string | null
          start_date: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          lease_length: number
          lease_type: Database["public"]["Enums"]["lease_type"]
          property_id?: string | null
          start_date: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          lease_length?: number
          lease_type?: Database["public"]["Enums"]["lease_type"]
          property_id?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "leases_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_join_invitations: {
        Row: {
          created_at: string
          id: string
          invitee_organization_role: Database["public"]["Enums"]["organization_member_role"]
          invitee_user_email: string
          invitee_user_id: string | null
          inviter_user_id: string
          organization_id: string
          status: Database["public"]["Enums"]["organization_join_invitation_link_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_organization_role?: Database["public"]["Enums"]["organization_member_role"]
          invitee_user_email: string
          invitee_user_id?: string | null
          inviter_user_id: string
          organization_id: string
          status?: Database["public"]["Enums"]["organization_join_invitation_link_status"]
        }
        Update: {
          created_at?: string
          id?: string
          invitee_organization_role?: Database["public"]["Enums"]["organization_member_role"]
          invitee_user_email?: string
          invitee_user_id?: string | null
          inviter_user_id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["organization_join_invitation_link_status"]
        }
        Relationships: [
          {
            foreignKeyName: "organization_join_invitations_invitee_user_id_fkey"
            columns: ["invitee_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_join_invitations_inviter_user_id_fkey"
            columns: ["inviter_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_join_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: number
          member_id: string
          member_role: Database["public"]["Enums"]["organization_member_role"]
          organization_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          member_id: string
          member_role: Database["public"]["Enums"]["organization_member_role"]
          organization_id: string
        }
        Update: {
          created_at?: string
          id?: number
          member_id?: string
          member_role?: Database["public"]["Enums"]["organization_member_role"]
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      organizations_private_info: {
        Row: {
          billing_address: Json | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          billing_address?: Json | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          billing_address?: Json | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_private_info_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address_line_one: string
          address_line_two: string
          available_from: string | null
          capacity: number
          city: string
          country: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_application_available: boolean | null
          is_furnished: boolean | null
          is_parking_available: boolean | null
          is_pets_allowed: boolean | null
          is_smoking_allowed: boolean | null
          num_bathrooms: number | null
          num_floors: number | null
          organization_id: string
          post_code: string
          property_type: Database["public"]["Enums"]["property_type"] | null
          rent_cycle: Database["public"]["Enums"]["rent_cycle"]
          rent_price: number
          request_pii: boolean
          security_deposit: number
          state_province_county: string
          status: Database["public"]["Enums"]["property_status"]
        }
        Insert: {
          address_line_one: string
          address_line_two: string
          available_from?: string | null
          capacity?: number
          city: string
          country: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_application_available?: boolean | null
          is_furnished?: boolean | null
          is_parking_available?: boolean | null
          is_pets_allowed?: boolean | null
          is_smoking_allowed?: boolean | null
          num_bathrooms?: number | null
          num_floors?: number | null
          organization_id: string
          post_code: string
          property_type?: Database["public"]["Enums"]["property_type"] | null
          rent_cycle?: Database["public"]["Enums"]["rent_cycle"]
          rent_price?: number
          request_pii?: boolean
          security_deposit?: number
          state_province_county: string
          status?: Database["public"]["Enums"]["property_status"]
        }
        Update: {
          address_line_one?: string
          address_line_two?: string
          available_from?: string | null
          capacity?: number
          city?: string
          country?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_application_available?: boolean | null
          is_furnished?: boolean | null
          is_parking_available?: boolean | null
          is_pets_allowed?: boolean | null
          is_smoking_allowed?: boolean | null
          num_bathrooms?: number | null
          num_floors?: number | null
          organization_id?: string
          post_code?: string
          property_type?: Database["public"]["Enums"]["property_type"] | null
          rent_cycle?: Database["public"]["Enums"]["rent_cycle"]
          rent_price?: number
          request_pii?: boolean
          security_deposit?: number
          state_province_county?: string
          status?: Database["public"]["Enums"]["property_status"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      property_amenities: {
        Row: {
          amenity_id: string
          property_id: string
        }
        Insert: {
          amenity_id: string
          property_id: string
        }
        Update: {
          amenity_id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_applications: {
        Row: {
          applicant_id: string | null
          application_date: string | null
          desired_move_in_date: string | null
          id: string
          last_updated: string | null
          notes: string | null
          occupants_count: number | null
          organization_id: string | null
          pet_details: string | null
          pets: boolean | null
          property_id: string | null
          status: Database["public"]["Enums"]["application_status"] | null
        }
        Insert: {
          applicant_id?: string | null
          application_date?: string | null
          desired_move_in_date?: string | null
          id?: string
          last_updated?: string | null
          notes?: string | null
          occupants_count?: number | null
          organization_id?: string | null
          pet_details?: string | null
          pets?: boolean | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Update: {
          applicant_id?: string | null
          application_date?: string | null
          desired_move_in_date?: string | null
          id?: string
          last_updated?: string | null
          notes?: string | null
          occupants_count?: number | null
          organization_id?: string | null
          pet_details?: string | null
          pets?: boolean | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "property_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_applications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_photos: {
        Row: {
          display_order: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_primary: boolean | null
          property_id: string | null
          storage_bucket: string
          upload_date: string | null
        }
        Insert: {
          display_order?: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_primary?: boolean | null
          property_id?: string | null
          storage_bucket: string
          upload_date?: string | null
        }
        Update: {
          display_order?: number | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_primary?: boolean | null
          property_id?: string | null
          storage_bucket?: string
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string | null
          custom_name: string | null
          id: string
          property_id: string | null
          room_type: Database["public"]["Enums"]["room_type"]
        }
        Insert: {
          created_at?: string | null
          custom_name?: string | null
          id?: string
          property_id?: string | null
          room_type: Database["public"]["Enums"]["room_type"]
        }
        Update: {
          created_at?: string | null
          custom_name?: string | null
          id?: string
          property_id?: string | null
          room_type?: Database["public"]["Enums"]["room_type"]
        }
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      screening_invitations: {
        Row: {
          applicant_id: string | null
          id: string
          invitation_date: string | null
          notes: string | null
          status: string | null
        }
        Insert: {
          applicant_id?: string | null
          id?: string
          invitation_date?: string | null
          notes?: string | null
          status?: string | null
        }
        Update: {
          applicant_id?: string | null
          id?: string
          invitation_date?: string | null
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "screening_invitations_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          organization_id?: string | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          applicant_id: string | null
          created_at: string
          id: string
          last_updated: string | null
          lease_end_date: string | null
          lease_start_date: string | null
          property_id: string | null
          rent_amount: number | null
          security_deposit: number | null
          status: Database["public"]["Enums"]["tenant_status"] | null
        }
        Insert: {
          applicant_id?: string | null
          created_at?: string
          id?: string
          last_updated?: string | null
          lease_end_date?: string | null
          lease_start_date?: string | null
          property_id?: string | null
          rent_amount?: number | null
          security_deposit?: number | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
        }
        Update: {
          applicant_id?: string | null
          created_at?: string
          id?: string
          last_updated?: string | null
          lease_end_date?: string | null
          lease_start_date?: string | null
          property_id?: string | null
          rent_amount?: number | null
          security_deposit?: number | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_private_info: {
        Row: {
          created_at: string | null
          default_organization: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          default_organization?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          default_organization?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_private_info_default_organization_fkey"
            columns: ["default_organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_private_info_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          user_type: Database["public"]["Enums"]["user_types"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          user_type?: Database["public"]["Enums"]["user_types"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          user_type?: Database["public"]["Enums"]["user_types"]
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      app_admin_get_user_id_by_email: {
        Args: {
          emailarg: string
        }
        Returns: string
      }
      check_if_authenticated_user_owns_email: {
        Args: {
          email: string
        }
        Returns: boolean
      }
      get_invited_organizations_for_user_v2: {
        Args: {
          user_id: string
          user_email: string
        }
        Returns: {
          organization_id: string
        }[]
      }
      get_organization_admin_ids: {
        Args: {
          organization_id: string
        }
        Returns: {
          member_id: string
        }[]
      }
      get_organization_member_ids: {
        Args: {
          organization_id: string
        }
        Returns: {
          member_id: string
        }[]
      }
      get_organizations_for_user: {
        Args: {
          user_id: string
        }
        Returns: {
          organization_id: string
        }[]
      }
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected"
      document_type: "Gas Safety Certificate"
      lease_type: "Monthly" | "Yearly" | "Fixed"
      organization_join_invitation_link_status:
        | "active"
        | "finished_accepted"
        | "finished_declined"
        | "inactive"
      organization_joining_status:
        | "invited"
        | "joinied"
        | "declined_invitation"
        | "joined"
      organization_member_role: "owner" | "admin" | "member" | "readonly"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      property_status: "active" | "closed"
      property_type:
        | "Detached"
        | "Semi Detached"
        | "Terraced"
        | "Flat"
        | "Studio Flat"
        | "Converted Flat"
        | "Purpose Built"
        | "Bungalow"
        | "Corner House"
        | "Commercial"
        | "Other"
      renewal_frequency:
        | "Every Year"
        | "Every 2 Years"
        | "Every 5 Years"
        | "One-time"
      rent_cycle: "Monthly" | "Fortnightly" | "Weekly"
      room_type:
        | "living room"
        | "kitchen"
        | "dining room"
        | "office"
        | "laundry room"
        | "garage"
        | "attic"
        | "basement"
        | "playroom"
        | "guest room"
        | "mudroom"
        | "sunroom"
        | "pantry"
        | "home theater"
        | "other"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
      tenant_status: "active" | "inactive" | "former"
      user_types: "landlord" | "tenant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

