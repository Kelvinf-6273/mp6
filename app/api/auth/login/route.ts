import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Debug logs
    // console.log('ENV CHECK in login route:');
    // console.log('GOOGLE_CLIENT_ID:', clientId || 'undefined');
    // console.log('NEXT_PUBLIC_BASE_URL:', baseUrl || 'undefined');

    if (!clientId) {
        return NextResponse.json(
            { error: "Server configuration error - GOOGLE_CLIENT_ID not set" },
            { status: 500 }
        );
    }

    if (!baseUrl) {
        return NextResponse.json(
            { error: "Server configuration error - NEXT_PUBLIC_BASE_URL not set" },
            { status: 500 }
        );
    }

    const redirectUri = `${baseUrl}/api/auth/callback`;
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('access_type', 'offline');


    authUrl.searchParams.set('prompt', 'consent select_account');

    return NextResponse.redirect(authUrl.toString());
}
