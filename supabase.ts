import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vdktwffemhxhcaxtyvks.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase