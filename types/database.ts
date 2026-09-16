export type CustomerStatus = "active" | "overdue" | "paid" | "closed";
export type FollowUpStatus = "pending" | "done" | "skipped";

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          contact: string | null;
          job: string | null;
          amount_owed: number;
          status: CustomerStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          contact?: string | null;
          job?: string | null;
          amount_owed?: number;
          status?: CustomerStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          contact?: string | null;
          job?: string | null;
          amount_owed?: number;
          status?: CustomerStatus;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      follow_ups: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
          reason: string;
          due_date: string | null;
          status: FollowUpStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          customer_id: string;
          reason: string;
          due_date?: string | null;
          status?: FollowUpStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_id?: string;
          reason?: string;
          due_date?: string | null;
          status?: FollowUpStatus;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follow_ups_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
