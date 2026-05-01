import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxdeixjbuuzlprxasquc.supabase.co';
const supabaseAnonKey = 'sb_publishable__svdmh9Fvs26zT4w-h2pMw_5YoTbSO1';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumns() {
    const { data, error } = await supabase.from('properties').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Columns found:', Object.keys(data[0] || {}));
    }
}

checkColumns();
