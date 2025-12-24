import { createClient } from '@/lib/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  
  console.log('--- Auth Callback Start ---')
  console.log('Full URL:', request.url)
  console.log('Code present:', !!code)
  
  if (error) {
    console.error('Auth error from provider:', error, error_description)
  }

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    console.log('Exchanging code for session...')
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      console.log('Success! Redirecting to:', next)
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error('Auth callback exchange error:', exchangeError)
  } else {
    console.warn('No code found in URL search params')
  }

  console.log('--- Auth Callback End (Redirecting to login) ---')
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
