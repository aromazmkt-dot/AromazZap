export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type UserRole = 'admin' | 'sales' | 'contractor' | 'warehouse' | 'accounting'
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'won' | 'lost'
export type LeadPriority = 'low' | 'medium' | 'high'
export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'expired' | 'converted'
export type InvoiceStatus = 'draft' | 'sent' | 'signed' | 'paid' | 'partial' | 'overdue' | 'void'
export type ProductType = 'inventory' | 'non_inventory' | 'service'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: UserRole
          location_id: string | null
          active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          source: string | null
          stage: LeadStage
          priority: LeadPriority
          assigned_to_id: string | null
          notes: string | null
          converted_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      customers: {
        Row: {
          id: string
          display_name: string
          tax_id: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      products: {
        Row: {
          id: string
          sku: string
          name: string
          type: ProductType
          uom: string
          cost: number
          price: number
          category: string | null
          track_stock: boolean
          stock_qty: number
          active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      quotes: {
        Row: {
          id: string
          number: string
          customer_id: string
          status: QuoteStatus
          subtotal: number
          tax_total: number
          total: number
          valid_until: string | null
          notes: string | null
          created_by_id: string
          converted_invoice_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>
      }
      quote_lines: {
        Row: {
          id: string
          quote_id: string
          product_id: string | null
          description: string
          qty: number
          unit_price: number
          discount_pct: number
          tax_pct: number
          total: number
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['quote_lines']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['quote_lines']['Insert']>
      }
      invoices: {
        Row: {
          id: string
          number: string
          customer_id: string
          quote_id: string | null
          status: InvoiceStatus
          subtotal: number
          tax_total: number
          total: number
          amount_paid: number
          due_date: string
          notes: string | null
          created_by_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

// Convenience row types
export type UserRow = Database['public']['Tables']['users']['Row']
export type LeadRow = Database['public']['Tables']['leads']['Row']
export type CustomerRow = Database['public']['Tables']['customers']['Row']
export type ProductRow = Database['public']['Tables']['products']['Row']
export type QuoteRow = Database['public']['Tables']['quotes']['Row']
export type QuoteLineRow = Database['public']['Tables']['quote_lines']['Row']
export type InvoiceRow = Database['public']['Tables']['invoices']['Row']
