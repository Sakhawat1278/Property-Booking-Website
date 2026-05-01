import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxdeixjbuuzlprxasquc.supabase.co';
const supabaseAnonKey = 'sb_publishable__svdmh9Fvs26zT4w-h2pMw_5YoTbSO1';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTable() {
    // Try to select one row to see columns
    const { data, error } = await supabase.from('properties').select('*').limit(1);
    if (error) {
        console.error('Error:', error.message);
    } else if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    } else {
        console.log('Table is empty or no columns found.');
        // Try a metadata query if possible (likely restricted)
        const { data: cols, error: err2 } = await supabase.rpc('get_table_columns', { table_name: 'properties' });
        if (err2) console.log('RPC failed (expected)');
    }
}

inspectTable();
