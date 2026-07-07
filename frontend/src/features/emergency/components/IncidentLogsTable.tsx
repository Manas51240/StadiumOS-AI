import React from 'react';
import { IncidentDTO } from '../../../core/types';
import { FileText } from 'lucide-react';

interface IncidentLogsTableProps {
  incidents: IncidentDTO[];
  userRole: string;
  handleResolve: (id: number) => void;
  selectedIncidentId: number | null;
  setSelectedIncidentId: (id: number | null) => void;
}

export default function IncidentLogsTable({
  incidents,
  userRole,
  handleResolve,
  selectedIncidentId,
  setSelectedIncidentId
}: IncidentLogsTableProps) {
  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Active Stadium Emergencies</h2>

      <div style={{ overflowX: 'auto' }}>
        <table className="console-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Category</th>
              <th scope="col">Location</th>
              <th scope="col">Severity</th>
              <th scope="col">Status</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active incidents logged. Sector safety is stable.
                </td>
              </tr>
            ) : (
              incidents.map(inc => (
                <React.Fragment key={inc.id}>
                  <tr>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>INC-{inc.id}</span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{inc.category}</td>
                    <td>{inc.location}</td>
                    <td>
                      <span className={`priority-badge priority-${inc.severity}`}>
                        {inc.severity.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-dot status-dot-${inc.status === 'resolved' ? 'active' : 'inactive'}`} style={{ marginRight: '6px' }} />
                      <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{inc.status}</span>
                    </td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setSelectedIncidentId(selectedIncidentId === inc.id ? null : inc.id)}
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      >
                        {selectedIncidentId === inc.id ? 'Close' : 'View AI Guide'}
                      </button>
                      {inc.status !== 'resolved' && (userRole === 'organizer' || userRole === 'security') && (
                        <button
                          onClick={() => handleResolve(inc.id)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>

                  {selectedIncidentId === inc.id && (
                    <tr>
                      <td colSpan={6} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={16} />
                            AI DISPATCHER GUIDELINES & DIRECTIVES
                          </h4>
                          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary)', background: 'rgba(0, 0, 0, 0.2)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {inc.response_instructions || 'Compiling AI dispatcher response...'}
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
