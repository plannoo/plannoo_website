import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
export interface DetRow {
  id: string; date: string; employee: string; role: string;
  location: string; plannedTime: string; timeTracking: string;
  breakInterval: string; nachtzuschlag: string; sonntagszuschlag: string;
  feiertagszuschlag: string; duration: string;
}
export interface SumRow {
  id?: number;
  name: string; shifts: string; holidays: string; correction: string;
  late: number; total: string; nz: string; sz: string;
  nz2: string; sz2: string; fz: string;
}

/* ══════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════ */
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica', fontSize: 6.5,
    paddingTop: 28, paddingBottom: 28, paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  // Page header
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
  pageTitle:  { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1a1a1a' },
  pageRange:  { fontSize: 7, color: '#555' },
  company:    { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#1a1a1a' },

  // Table
  table:     { width: '100%', borderTopWidth: 0.5, borderTopColor: '#ccc', borderTopStyle: 'solid' },
  headerRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderBottomWidth: 0.5, borderBottomColor: '#aaa', borderBottomStyle: 'solid' },
  dataRow:   { flexDirection: 'row', borderBottomWidth: 0.3, borderBottomColor: '#ddd', borderBottomStyle: 'solid' },
  altRow:    { flexDirection: 'row', backgroundColor: '#fafafa', borderBottomWidth: 0.3, borderBottomColor: '#ddd', borderBottomStyle: 'solid' },
  sumRow:    { flexDirection: 'row', borderTopWidth: 0.8, borderTopColor: '#888', borderTopStyle: 'solid', backgroundColor: '#f5f5f5', marginTop: 2 },
  finalRow:  { flexDirection: 'row', borderTopWidth: 1.2, borderTopColor: '#333', borderTopStyle: 'solid', backgroundColor: '#e8f0fe', marginTop: 8 },

  // Cells
  th:   { fontFamily: 'Helvetica-Bold', fontSize: 6, paddingVertical: 3, paddingHorizontal: 3, color: '#333' },
  td:   { paddingVertical: 2.5, paddingHorizontal: 3, color: '#222' },
  bold: { fontFamily: 'Helvetica-Bold' },
  gray: { color: '#888' },

  // Footer
  pageFooter: { position: 'absolute', bottom: 14, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 6, color: '#aaa' },
});

/* ══════════════════════════════════════════════════════════
   COLUMN WIDTHS  (must sum to 100%)
  Datum / Mitarbeiter / Rolle / Standort / Planzeit / Zeiterfassung
  Pause / Nacht / Sonntag / Feiertag / Dauer
══════════════════════════════════════════════════════════ */
const DET_COLS = [
  { key:'date',             label:'Datum',          w:'7%',  align:'left'  as const },
  { key:'employee',         label:'Mitarbeiter',    w:'13%', align:'left'  as const },
  { key:'role',             label:'Rolle',          w:'7%',  align:'left'  as const },
  { key:'location',         label:'Standort',       w:'8%',  align:'left'  as const },
  { key:'plannedTime',      label:'Planzeit',       w:'14%', align:'left'  as const },
  { key:'timeTracking',     label:'Zeiterfassung',  w:'14%', align:'left'  as const },
  { key:'breakInterval',    label:'Pausenintervall',w:'9%',  align:'right' as const },
  { key:'nachtzuschlag',    label:'Nacht...',       w:'7%',  align:'right' as const },
  { key:'sonntagszuschlag', label:'Sonntag...',     w:'7%',  align:'right' as const },
  { key:'feiertagszuschlag',label:'Feiertag...',    w:'7%',  align:'right' as const },
  { key:'duration',         label:'Dauer',          w:'7%',  align:'right' as const },
];

const SUM_COLS = [
  { key:'name',       label:'Mitarbeiter',w:'22%', align:'left'  as const },
  { key:'shifts',     label:'Schichten',  w:'10%', align:'right' as const },
  { key:'holidays',   label:'Feiertage',  w:'10%', align:'right' as const },
  { key:'correction', label:'Korrektur',  w:'10%', align:'right' as const },
  { key:'total',      label:'Gesamt',     w:'12%', align:'right' as const },
  { key:'late',       label:'Spät',       w:'8%',  align:'right' as const },
  { key:'nz',         label:'NZ%',        w:'8%',  align:'right' as const },
  { key:'sz',         label:'SZ%',        w:'8%',  align:'right' as const },
  { key:'nz2',        label:'NZ2%',       w:'6%',  align:'right' as const },
  { key:'sz2',        label:'SZ2%',       w:'6%',  align:'right' as const },
];

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
function sumTimes(vals: string[]): string {
  const total = vals.reduce((acc, v) => {
    if (!v || v === '—') return acc;
    const [h, m] = v.split(':').map(Number);
    return acc + (isNaN(h) ? 0 : h * 60) + (isNaN(m) ? 0 : m);
  }, 0);
  if (total === 0) return '0:00';
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function getDetVal(row: DetRow, key: string): string {
  return (row as any)[key] ?? '';
}
function getSumVal(row: SumRow, key: string): string {
  if (key === 'late') return String(row.late);
  return (row as any)[key] ?? '';
}

/* ══════════════════════════════════════════════════════════
   TABLE HEADER ROW  (repeated at top of each page)
══════════════════════════════════════════════════════════ */
function DetHeader() {
  return (
    <View style={s.headerRow} fixed>
      {DET_COLS.map(c => (
        <Text key={c.key} style={[s.th, { width: c.w, textAlign: c.align }]}>{c.label}</Text>
      ))}
    </View>
  );
}
function SumHeader() {
  return (
    <View style={s.headerRow} fixed>
      {SUM_COLS.map(c => (
        <Text key={c.key} style={[s.th, { width: c.w, textAlign: c.align }]}>{c.label}</Text>
      ))}
    </View>
  );
}

/* ══════════════════════════════════════════════════════════
   DETAILED PDF DOCUMENT
  Matches the uploaded PDF exactly:
  - Company name + date range in page header
  - Column header repeated on each page (fixed)
  - Data rows with subtle alternating shading
  - "Summe:" row at the bottom with column totals
  - Page numbers in footer
══════════════════════════════════════════════════════════ */
export function DetailedReportDocument({
  rows, dateFrom, dateTo, companyName, visibleCols,
}: {
  rows: DetRow[];
  dateFrom: string;
  dateTo: string;
  companyName: string;
  visibleCols?: string[];
}) {
  const activeCols = visibleCols
    ? DET_COLS.filter(c => visibleCols.includes(c.key))
    : DET_COLS;

  // Compute column totals for sum row
  const timeKeys = ['nachtzuschlag','sonntagszuschlag','feiertagszuschlag','duration','breakInterval'];
  const totals: Record<string, string> = {};
  timeKeys.forEach(k => {
    totals[k] = sumTimes(rows.map(r => getDetVal(r, k)));
  });

  return (
    <Document title={`Detailed Report ${dateFrom} - ${dateTo}`} author={companyName}>
      <Page size="A4" orientation="landscape" style={s.page}>
        {/* Page header — fixed so it appears on every page */}
        <View style={s.pageHeader} fixed>
          <View>
            <Text style={s.pageTitle}>Auswertung {dateFrom} - {dateTo}</Text>
          </View>
          <Text style={s.company}>{companyName}</Text>
        </View>

        {/* Table */}
        <View style={s.table}>
          <DetHeader />
          {rows.map((row, i) => (
            <View key={row.id} style={i % 2 === 0 ? s.dataRow : s.altRow} wrap={false}>
              {activeCols.map(c => {
                const val = getDetVal(row, c.key);
                return (
                  <Text key={c.key} style={[s.td, { width: c.w, textAlign: c.align }, !val ? s.gray : {}]}>
                    {val || ''}
                  </Text>
                );
              })}
            </View>
          ))}

          {/* Sum row */}
          <View style={s.sumRow} wrap={false}>
            {activeCols.map((c, i) => {
              let val = '';
              if (i === 0) val = 'Summe:';
              else if (timeKeys.includes(c.key) && totals[c.key] !== '0:00') val = totals[c.key];
              return (
                <Text key={c.key} style={[s.td, s.bold, { width: c.w, textAlign: c.align }]}>
                  {val}
                </Text>
              );
            })}
          </View>
        </View>

        {/* Page footer with page number */}
        <View style={s.pageFooter} fixed>
          <Text style={s.footerText}>{companyName} — {dateFrom} bis {dateTo}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

/* ══════════════════════════════════════════════════════════
   SUMMED PDF DOCUMENT
══════════════════════════════════════════════════════════ */
export function SummedReportDocument({
  rows, dateFrom, dateTo, companyName,
}: {
  rows: SumRow[];
  dateFrom: string;
  dateTo: string;
  companyName: string;
}) {
  const timeKeys = ['shifts','holidays','correction','total','nz','sz','nz2','sz2'];
  const totals: Record<string, string> = {};
  timeKeys.forEach(k => {
    totals[k] = sumTimes(rows.map(r => getSumVal(r, k)));
  });
  const totalLate = rows.reduce((a, r) => a + r.late, 0);

  return (
    <Document title={`Summed Report ${dateFrom} - ${dateTo}`} author={companyName}>
      <Page size="A4" style={s.page}>
        <View style={s.pageHeader} fixed>
          <View>
            <Text style={s.pageTitle}>Zusammenfassung {dateFrom} - {dateTo}</Text>
          </View>
          <Text style={s.company}>{companyName}</Text>
        </View>

        <View style={s.table}>
          <SumHeader />
          {rows.map((row, i) => (
            <View key={row.name} style={i % 2 === 0 ? s.dataRow : s.altRow} wrap={false}>
              {SUM_COLS.map(c => {
                const val = getSumVal(row, c.key);
                const isZ = val === '0:00' || val === '0';
                return (
                  <Text key={c.key} style={[s.td, { width: c.w, textAlign: c.align }, isZ ? s.gray : {}]}>
                    {val}
                  </Text>
                );
              })}
            </View>
          ))}

          {/* Sum / total row */}
          <View style={s.finalRow} wrap={false}>
            {SUM_COLS.map((c, i) => {
              let val = '';
              if (i === 0)      val = 'Summe:';
              else if (c.key === 'late') val = String(totalLate);
              else if (totals[c.key])    val = totals[c.key] !== '0:00' ? totals[c.key] : '0:00';
              return (
                <Text key={c.key} style={[s.td, s.bold, { width: c.w, textAlign: c.align }]}>
                  {val}
                </Text>
              );
            })}
          </View>
        </View>

        <View style={s.pageFooter} fixed>
          <Text style={s.footerText}>{companyName} — {dateFrom} bis {dateTo}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

/* ══════════════════════════════════════════════════════════
   GENERATE + DOWNLOAD HELPERS
══════════════════════════════════════════════════════════ */
export async function downloadDetailedPDF(rows: DetRow[], dateFrom: string, dateTo: string, companyName: string, visibleCols?: string[]) {
  const blob = await pdf(
    <DetailedReportDocument rows={rows} dateFrom={dateFrom} dateTo={dateTo} companyName={companyName} visibleCols={visibleCols} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Auswertung_${dateFrom}_${dateTo}.pdf`.replace(/\./g, '_');
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadSummedPDF(rows: SumRow[], dateFrom: string, dateTo: string, companyName: string) {
  const blob = await pdf(
    <SummedReportDocument rows={rows} dateFrom={dateFrom} dateTo={dateTo} companyName={companyName} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Zusammenfassung_${dateFrom}_${dateTo}.pdf`.replace(/\./g, '_');
  a.click();
  URL.revokeObjectURL(url);
}
