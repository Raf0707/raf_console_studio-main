export const dynamic = 'force-static';

export async function GET() {
  return new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}