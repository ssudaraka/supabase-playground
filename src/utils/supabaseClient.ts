import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// const supabaseUrl = "https://eqlhlgiwpbnovlxwmitu.supabase.co";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbGhsZ2l3cGJub3ZseHdtaXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwOTIxNTMsImV4cCI6MjAyOTY2ODE1M30.4terd0DEOy28nA3Tp3s0AFr4anRRVqVnqiSJi9V934g";

// const supabaseUrl = "http://127.0.0.1:54321";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// const options = {
//   global: {
//     headers: {
//       "x-my-custom-header": "1234",
//     },
//   },
// };

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   global: {
//     headers: {
//       "x-forwarded-for": "10.10.10.10",
//     },
//   },
// });

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
