// /lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irjmdwyrovzirqyvtqtb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyam1kd3lyb3Z6aXJxeXZ0cXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTI5MjAsImV4cCI6MjA2MDM4ODkyMH0.J2pBY5UVY-oNNaVx4J8LEMUvsempsGBce65dprmSfgE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
