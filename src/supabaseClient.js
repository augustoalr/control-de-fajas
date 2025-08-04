import { createClient } from "../node_modules/@supabase/supabase-js/dist/index.js"; // Adjust the path if necessary
//supabase/supabase-js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
