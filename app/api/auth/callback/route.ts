import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');


    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Debug logs
    // console.log('ENV CHECK in callback route:');
    // console.log('GOOGLE_CLIENT_ID:', clientId || 'undefined');
    // console.log('GOOGLE_CLIENT_SECRET:', clientSecret ? '***exists***' : 'undefined');
    // console.log('NEXT_PUBLIC_BASE_URL:', baseUrl || 'undefined');
    // console.log('Authorization code received:', code ? 'Yes' : 'No');


    if (!clientId || !clientSecret || !baseUrl) {
        return NextResponse.json(
            { error: "Server configuration error - Missing environment variables" },
            { status: 500 }
        );
    }


    if (error) {
        console.error('OAuth error:', error);
        return NextResponse.redirect(`${baseUrl}?error=${encodeURIComponent(error)}`);
    }


    if (!code) {
        return NextResponse.redirect(`${baseUrl}?error=${encodeURIComponent('No authorization code received')}`);
    }

    try {

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: `${baseUrl}/api/auth/callback`,
                grant_type: 'authorization_code'
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token exchange error:', tokenData);
            return NextResponse.redirect(`${baseUrl}?error=${encodeURIComponent('Failed to exchange code for token')}`);
        }


        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        const userData = await userInfoResponse.json();

        if (!userInfoResponse.ok) {
            console.error('User info error:', userData);
            return NextResponse.redirect(`${baseUrl}?error=${encodeURIComponent('Failed to fetch user data')}`);
        }


        const userDataParam = encodeURIComponent(JSON.stringify(userData));
        return NextResponse.redirect(`${baseUrl}?user=${userDataParam}`);

    } catch (error) {
        console.error('OAuth flow error:', error);
        return NextResponse.redirect(`${baseUrl}?error=${encodeURIComponent('Authentication failed')}`);
    }
}