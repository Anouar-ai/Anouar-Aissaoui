
import { NextResponse } from 'next/server';

const WP_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

if (!WP_GRAPHQL_ENDPOINT || !CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error('Missing required environment variables for GraphQL proxy.');
}

export async function POST(request: Request) {
    const { query, variables } = await request.json();

    const auth = 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);

    try {
        const response = await fetch(WP_GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
            },
            body: JSON.stringify({ query, variables }),
            // Increase cache time or use revalidation strategy if needed
            next: { revalidate: 60 } 
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Upstream GraphQL API Error:', response.status, data);
            return NextResponse.json(
                { error: 'Failed to fetch from upstream GraphQL API', details: data },
                { status: response.status }
            );
        }
        
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error in GraphQL proxy route:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
