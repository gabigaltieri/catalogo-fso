// Tipos escritos a mano para reflejar supabase/migrations/0001_init.sql.
// Una vez provisionado el proyecto de Supabase real, se puede regenerar con:
//   npx supabase gen types typescript --project-id <ref> > lib/database.types.ts
// (y ajustar los helpers de lib/supabase/*.ts si algo cambió de nombre).

export type BannerColor = 'red' | 'dark' | 'darkred';

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          color: BannerColor;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon?: string;
          color: BannerColor;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
        Relationships: [];
      };
      subcategories: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          sub: string;
          icon: string;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          sub?: string;
          icon?: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['subcategories']['Insert']>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          subcategory_id: string;
          cod: string;
          name: string;
          pres: string;
          description: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          subcategory_id: string;
          cod: string;
          name: string;
          pres?: string;
          description?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
