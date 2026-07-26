import type { Schema } from '../../data/resource';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import ExcelJS from 'exceljs';

const s3 = new S3Client({});
const BUCKET = process.env.BUCKET_NAME as string;
const KEY = 'enquiries/customer-enquiries.xlsx';
const SHEET = 'Enquiries';
const HEADERS = [
  'Timestamp (IST)',
  'Type',
  'Name',
  'Phone',
  'Email',
  'Practice Area',
  'Preferred',
  'Message',
  'Language',
];

async function loadWorkbook(): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: KEY }));
    const bytes = await res.Body!.transformToByteArray();
    // Cast: exceljs's Buffer type differs from @types/node's generic Buffer.
    await wb.xlsx.load(Buffer.from(bytes) as any);
  } catch (e: any) {
    // First submission — the file doesn't exist yet.
    if (e?.name !== 'NoSuchKey' && e?.$metadata?.httpStatusCode !== 404) throw e;
  }
  let ws = wb.getWorksheet(SHEET);
  if (!ws) {
    ws = wb.addWorksheet(SHEET);
    ws.addRow(HEADERS);
    ws.getRow(1).font = { bold: true };
    ws.columns = HEADERS.map((h) => ({ width: h === 'Message' ? 50 : 20 }));
  }
  return wb;
}

/**
 * Appends one customer enquiry as a row (with a server-side IST timestamp) to a
 * single Excel workbook in S3. The file is not publicly accessible — only this
 * Lambda's IAM role can read/write it.
 */
export const handler: Schema['logEnquiry']['functionHandler'] = async (event) => {
  const a = event.arguments;
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
  });

  const wb = await loadWorkbook();
  const ws = wb.getWorksheet(SHEET)!;
  ws.addRow([
    timestamp,
    a.type ?? '',
    a.name ?? '',
    a.phone ?? '',
    a.email ?? '',
    a.service ?? '',
    a.preferred ?? '',
    a.message ?? '',
    a.language ?? '',
  ]);

  const buffer = await wb.xlsx.writeBuffer();
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: KEY,
      Body: Buffer.from(buffer as ArrayBuffer),
      ContentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
  );

  return true;
};
