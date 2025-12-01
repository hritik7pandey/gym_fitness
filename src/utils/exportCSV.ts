/**
 * Utility function to export data to CSV (client-side)
 * TODO: integrate with admin export route for server-side generation
 */

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((row) =>
    Object.values(row)
      .map((v) => `"${v}"`)
      .join(',')
  );
  const csv = [headers, ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Example admin export route (server-side) would be:
 * 
 * File: src/app/api/admin/export/route.ts
 * 
 * import { NextRequest, NextResponse } from 'next/server';
 * 
 * export async function GET(request: NextRequest) {
 *   // TODO: authenticate admin user
 *   // TODO: fetch data from database
 *   const data = [
 *     { id: 1, name: 'John Doe', workouts: 12 },
 *     { id: 2, name: 'Jane Smith', workouts: 18 }
 *   ];
 * 
 *   const headers = Object.keys(data[0]).join(',');
 *   const rows = data.map((row) =>
 *     Object.values(row)
 *       .map((v) => `"${v}"`)
 *       .join(',')
 *   );
 *   const csv = [headers, ...rows].join('\\n');
 * 
 *   return new NextResponse(csv, {
 *     headers: {
 *       'Content-Type': 'text/csv',
 *       'Content-Disposition': 'attachment; filename="export.csv"'
 *     }
 *   });
 * }
 */
