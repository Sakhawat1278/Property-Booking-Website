import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxdeixjbuuzlprxasquc.supabase.co';
const supabaseAnonKey = 'sb_publishable__svdmh9Fvs26zT4w-h2pMw_5YoTbSO1';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBuckets() {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Buckets:', data.map(b => b.name));
    }
}

checkBuckets();
