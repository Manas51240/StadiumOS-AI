import React from 'react';
import { OperationReportDTO } from '../../../core/types';
import { FileText, Cpu } from 'lucide-react';

interface ReportsTableProps {
  reports: OperationReportDTO[];
  reportType: string;
  setReportType: (val: string) => void;
  generatingReport: boolean;
  handleGenerateReport: () => void;
  selectedReportId: number | null;
  setSelectedReportId: (id: number | null) => void;
}

export default function ReportsTable({
  reports,
  reportType,
  setReportType,
  generatingReport,
  handleGenerateReport,
  selectedReportId,
  setSelectedReportId
}: ReportsTableProps) {
  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <FileText size={18} color="var(--color-secondary)" />
          Archived AI Reports
        </h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            aria-label="Select report compile frequency"
            className="form-input"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
            value={reportType}
            onChange={e => setReportType(e.target.value)}
          >
            <option value="daily">Daily Brief</option>
            <option value="matchday">Matchday Log</option>
            <option value="incident_summary">Emergency Summary</option>
          </select>
          <button
            onClick={handleGenerateReport}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            disabled={generatingReport}
          >
            <Cpu size={14} />
            {generatingReport ? 'Compiling...' : 'Run AI Compilation'}
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="console-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th scope="col">Report Code</th>
              <th scope="col">Frequency</th>
              <th scope="col">Created Timestamp</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No compiled operations reports available. Click compilation above.
                </td>
              </tr>
            ) : (
              reports.map(rep => (
                <React.Fragment key={rep.id}>
                  <tr>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{rep.title}</span>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--color-secondary)' }}>
                        {rep.report_type}
                      </span>
                    </td>
                    <td>{new Date(rep.created_at).toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedReportId(selectedReportId === rep.id ? null : rep.id)}
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      >
                        {selectedReportId === rep.id ? 'Close Details' : 'View Report'}
                      </button>
                    </td>
                  </tr>
                  {selectedReportId === rep.id && (
                    <tr>
                      <td colSpan={4} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>REPORT SUMMARY METRICS</h4>
                          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary)', background: 'rgba(0, 0, 0, 0.2)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {rep.content}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
