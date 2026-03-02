export interface Organization {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  max_users: number;
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  stripe_customer_id?: string;
}

export interface OrganizationMember {
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  user_email?: string;
  user_name?: string;
}

export interface OrganizationSubscription {
  license_id: string;
  plan_id: string;
  plan_name: string;
  plan_code: string;
  status: 'active' | 'cancelled' | 'expired';
  starts_at: string;
  expires_at?: string;
  billing_cycle: string;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  max_users?: number;
  settings?: Record<string, unknown>;
}

export interface UpdateOrganizationInput {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  max_users?: number;
  settings?: Record<string, unknown>;
}

export interface AddMemberInput {
  organization_id: string;
  user_id: string;
  role: string;
}
