"use client";

export async function fetcher(url: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ohara-token') : null;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-site-key': process.env.NEXT_PUBLIC_SITE_KEY || ''
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, { headers });
    
    if (!res.ok) {
        if (res.status === 404) return null; // Retorna null passivamente
        throw new Error('Erro na requisição SWR');
    }
    
    return res.json();
}
