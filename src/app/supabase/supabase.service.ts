import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// *** SUBSTITUA AQUI COM SUAS CREDENCIAIS DO SUPABASE ***
const supabaseUrl = 'https://ujepvzsfizwbebwcdqhy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZXB2enNmaXp3YmVid2NkcWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTQxODIsImV4cCI6MjA3ODAzMDE4Mn0.ewzr7Ij0DhynJYnwT4r9QgN0Sy7T3_zqXDx05je_XMg';
// ****************************************************

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Inicializa o cliente Supabase
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
