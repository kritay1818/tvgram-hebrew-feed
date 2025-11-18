export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      article_categories: {
        Row: {
          article_id: string
          category_id: string
        }
        Insert: {
          article_id: string
          category_id: string
        }
        Update: {
          article_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_categories_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      article_comments: {
        Row: {
          article_id: string
          author_name: string | null
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          status: string
        }
        Insert: {
          article_id: string
          author_name?: string | null
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          status?: string
        }
        Update: {
          article_id?: string
          author_name?: string | null
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "article_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      article_likes: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          session_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          session_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_views: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          session_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          session_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author: string | null
          body_html: string | null
          bottom_likes: number | null
          bottom_views: number
          comments_count: number | null
          content_type: string
          cover_url: string | null
          created_at: string | null
          homepage_rank: number | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          is_top_story: boolean | null
          likes_count: number | null
          primary_category_id: string | null
          published_at: string | null
          slug: string
          status: string
          summary: string | null
          tags: string[] | null
          title: string
          top_likes: number
          top_views: number | null
          updated_at: string | null
          video_id: string | null
          views_count: number | null
        }
        Insert: {
          author?: string | null
          body_html?: string | null
          bottom_likes?: number | null
          bottom_views?: number
          comments_count?: number | null
          content_type?: string
          cover_url?: string | null
          created_at?: string | null
          homepage_rank?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          is_top_story?: boolean | null
          likes_count?: number | null
          primary_category_id?: string | null
          published_at?: string | null
          slug: string
          status?: string
          summary?: string | null
          tags?: string[] | null
          title: string
          top_likes?: number
          top_views?: number | null
          updated_at?: string | null
          video_id?: string | null
          views_count?: number | null
        }
        Update: {
          author?: string | null
          body_html?: string | null
          bottom_likes?: number | null
          bottom_views?: number
          comments_count?: number | null
          content_type?: string
          cover_url?: string | null
          created_at?: string | null
          homepage_rank?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          is_top_story?: boolean | null
          likes_count?: number | null
          primary_category_id?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          top_likes?: number
          top_views?: number | null
          updated_at?: string | null
          video_id?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_primary_category_id_fkey"
            columns: ["primary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_in_nav: boolean | null
          name: string
          order_index: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_in_nav?: boolean | null
          name: string
          order_index?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_in_nav?: boolean | null
          name?: string
          order_index?: number | null
          slug?: string
        }
        Relationships: []
      }
      categories_videos: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      category_poll_options: {
        Row: {
          id: string
          option_text: string
          order_index: number | null
          poll_id: string
        }
        Insert: {
          id?: string
          option_text: string
          order_index?: number | null
          poll_id: string
        }
        Update: {
          id?: string
          option_text?: string
          order_index?: number | null
          poll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "category_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      category_poll_votes: {
        Row: {
          created_at: string | null
          id: string
          option_id: string
          poll_id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_id: string
          poll_id: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          option_id?: string
          poll_id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "category_poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "category_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      category_polls: {
        Row: {
          allow_multiple: boolean | null
          category_id: string | null
          created_at: string | null
          description: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          allow_multiple?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          allow_multiple?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_polls_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      short_urls: {
        Row: {
          article_id: string | null
          click_count: number
          created_at: string
          full_url: string
          id: string
          short_code: string
        }
        Insert: {
          article_id?: string | null
          click_count?: number
          created_at?: string
          full_url: string
          id?: string
          short_code: string
        }
        Update: {
          article_id?: string | null
          click_count?: number
          created_at?: string
          full_url?: string
          id?: string
          short_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "short_urls_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          homepage_rank: number | null
          id: string
          is_featured: boolean | null
          is_live: boolean | null
          live_ended_at: string | null
          live_started_at: string | null
          live_status: string | null
          platform: string
          source_id: string | null
          thumb_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
          viewer_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          homepage_rank?: number | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          live_ended_at?: string | null
          live_started_at?: string | null
          live_status?: string | null
          platform?: string
          source_id?: string | null
          thumb_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          viewer_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          homepage_rank?: number | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          live_ended_at?: string | null
          live_started_at?: string | null
          live_status?: string | null
          platform?: string
          source_id?: string | null
          thumb_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          viewer_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
