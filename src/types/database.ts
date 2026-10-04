export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          slug: string;
          price: number;
          currency: string;
          duration_hours: number;
          description: string | null;
          permissions: Json;
          level: number;
          active: boolean;
          checkout_url: string | null;
          escalepay_product_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          price: number;
          currency?: string;
          duration_hours: number;
          description?: string | null;
          permissions?: Json;
          level?: number;
          active?: boolean;
          checkout_url?: string | null;
          escalepay_product_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          price?: number;
          currency?: string;
          duration_hours?: number;
          description?: string | null;
          permissions?: Json;
          level?: number;
          active?: boolean;
          checkout_url?: string | null;
          escalepay_product_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: "active" | "expired" | "cancelled" | "pending";
          started_at: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: "active" | "expired" | "cancelled" | "pending";
          started_at?: string;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          status?: "active" | "expired" | "cancelled" | "pending";
          started_at?: string;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      contents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content_type: "video" | "photo" | "audio";
          storage_path: string;
          thumbnail_path: string | null;
          required_plan_id: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          content_type: "video" | "photo" | "audio";
          storage_path: string;
          thumbnail_path?: string | null;
          required_plan_id?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          content_type?: "video" | "photo" | "audio";
          storage_path?: string;
          thumbnail_path?: string | null;
          required_plan_id?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          content_id: string;
          duration: number | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          content_id: string;
          duration?: number | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          content_id?: string;
          duration?: number | null;
          metadata?: Json | null;
        };
      };
      photos: {
        Row: {
          id: string;
          content_id: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          content_id: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          content_id?: string;
          metadata?: Json | null;
        };
      };
      audios: {
        Row: {
          id: string;
          content_id: string;
          duration: number | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          content_id: string;
          duration?: number | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          content_id?: string;
          duration?: number | null;
          metadata?: Json | null;
        };
      };
      access_codes: {
        Row: {
          id: string;
          code: string;
          plan_id: string;
          user_id: string | null;
          payment_id: string | null;
          status: "available" | "used" | "disabled" | "expired";
          created_at: string;
          activated_at: string | null;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          plan_id: string;
          user_id?: string | null;
          payment_id?: string | null;
          status?: "available" | "used" | "disabled" | "expired";
          created_at?: string;
          activated_at?: string | null;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          plan_id?: string;
          user_id?: string | null;
          payment_id?: string | null;
          status?: "available" | "used" | "disabled" | "expired";
          created_at?: string;
          activated_at?: string | null;
          expires_at?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          amount: number;
          currency: string;
          status: "pending" | "approved" | "rejected" | "refunded";
          external_payment_id: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          amount: number;
          currency?: string;
          status?: "pending" | "approved" | "rejected" | "refunded";
          external_payment_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          amount?: number;
          currency?: string;
          status?: "pending" | "approved" | "rejected" | "refunded";
          external_payment_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      platform_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      user_can_access_plan: {
        Args: { required_plan_id: string };
        Returns: boolean;
      };
      user_max_plan_level: {
        Args: Record<string, never>;
        Returns: number;
      };
      redeem_access_code: {
        Args: { code_input: string };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
