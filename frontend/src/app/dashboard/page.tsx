'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { useAccessibility } from '../../core/context/AccessibilityContext';
import { useRouter } from 'next/navigation';
import { useDashboard, CommandCenterStats } from '../../core/hooks/useDashboard';
import { OperationReportDTO } from '../../core/types';
import { LayoutDashboard, Radio, Leaf, FileText, Send, AlertTriangle, Cpu } from 'lucide-react';

export default function CommandCenter() {
  const { user, loading } = useAuth();
  const { announce } = useAccessibility();
  const router = useRouter();
  const { getStats, getReports, createCrowdAlert, generateReport } = useDashboard();

  const [stats, setStats] = useState<CommandCenterStats | null>(null);
  const [reports, setReports] = useState<OperationReportDTO[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Congestion Alert Form States
  const [sector, setSector] = useState('North Stand');
  const [congestionLevel, setCongestionLevel] = useState('high');
  const [spectatorCount, setSpectatorCount] = useState(14000);
  const [capacity, setCapacity] = useState(15000);
  const [message, setMessage] = useState('');
  const [alertSubmitting, setAlertSubmitting] = useState(false);

  // Report Form States
  const [reportType, setReportType] = useState('daily');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'organizer' && user.role !== 'security'))) {
      router.push('/');
    }
  }, [user, loading, router]);

  const loadDashboard = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);
      
      const reportsData = await getReports();
      setReports(reportsData);
    } catch (err: any) {
      setErrorMsg(`Failed to query dashboard: ${err.message}`);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const handleBroadcastAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setAlertSubmitting(true);

    try {
      await createCrowdAlert({
        sector,
        congestion_level: congestionLevel,
        spectator_count: Number(spectatorCount),
        capacity: Number(capacity),
        message
      });
      setSuccessMsg('Congestion warning broadcasted to operations personnel.');
      announce(`Broadcasted alert: ${congestionLevel} congestion in ${sector}`);
      setMessage('');
      loadDashboard();
    } catch (err: any) {
      setErrorMsg(`Failed to broadcast alert: ${err.message}`);
    } finally {
      setAlertSubmitting(false);
    }
  };

  const handleGenerateReport = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGeneratingReport(true);
    announce("Initiating AI report compilation...");

    try {
      const rep = await generateReport(reportType);
      setSuccessMsg(`AI Report '${rep.title}' compiled and archived!`);
      announce("AI operational report generated successfully.");
      loadDashboard();
    } catch (err: any) {
      setErrorMsg(`Failed to compile report: ${err.message}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Loading Skeletons layout
  if (loading || !user || !stats) {
    return (
      <div className="container animated-fade" style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '320px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '480px', height: '18px' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="glass-panel" style={{ height: '120px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="skeleton" style={{ width: '50%', height: '14px' }} />
              <div className="skeleton" style={{ width: '35%', height: '26px' }} />
              <div className="skeleton" style={{ width: '70%', height: '12px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container animated-fade">
      
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutDashboard size={26} color="var(--color-secondary)" />
          Command Center Operations
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          FIFA World Cup 2026 Central Command dashboard console.
        </p>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--color-danger)', padding: '12px', borderRadius: '6px', marginBottom: '16px', color: 'var(--color-danger)', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--color-primary)', padding: '12px', borderRadius: '6px', marginBottom: '16px', color: 'var(--color-primary)', fontSize: '0.9rem' }}>
          {successMsg}
        </div>
      )}

      {/* Metrics Row Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '4px solid var(--color-primary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CROWD SAFETY INDEX</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {stats.crowd_safety_index}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span className="status-dot status-dot-active" style={{ marginRight: '6px' }} />
            Stable stadium dynamics
          </span>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '4px solid var(--color-accent)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE CROWD WARNINGS</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: stats.active_alerts_count > 0 ? 'var(--color-accent)' : 'var(--text-primary)' }}>
            {stats.active_alerts_count}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Alert bulletins dispatched
          </span>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '4px solid var(--color-danger)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE EMERGENCY ISSUES</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: stats.unresolved_incidents_count > 0 ? 'var(--color-danger)' : 'var(--text-primary)' }}>
            {stats.unresolved_incidents_count}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Dispatches requiring resolution
          </span>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '4px solid var(--color-secondary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>VOLUNTEERS ON SHIFT</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
            {stats.volunteers_on_shift}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Personnel allocated on duty
          </span>
        </div>
      </div>

      <div className="two-col-layout">
        
        {/* Left Col: Broadcast Alert and Reports List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Broadcast Alert Box */}
          <div className="glass-panel">
            <form onSubmit={handleBroadcastAlert}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--color-accent)" />
                Broadcast Congestion Alert
              </h2>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" htmlFor="alert-sector">Target Sector</label>
                  <select
                    id="alert-sector"
                    className="form-input"
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                  >
                    <option value="North Stand">North Stand</option>
                    <option value="South Stand">South Stand</option>
                    <option value="East Stand">East Stand</option>
                    <option value="West Stand">West Stand</option>
                    <option value="Main Concourse">Main Concourse</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="alert-congestion">Congestion Status</label>
                  <select
                    id="alert-congestion"
                    className="form-input"
                    value={congestionLevel}
                    onChange={e => setCongestionLevel(e.target.value)}
                  >
                    <option value="low">Low Density</option>
                    <option value="medium">Medium Load</option>
                    <option value="high">High Congestion</option>
                    <option value="critical">Critical (Limit)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" htmlFor="alert-count">Live Spectators Count</label>
                  <input
                    id="alert-count"
                    type="number"
                    className="form-input"
                    value={spectatorCount}
                    onChange={e => setSpectatorCount(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="alert-capacity">Sector Max Capacity</label>
                  <input
                    id="alert-capacity"
                    type="number"
                    className="form-input"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="alert-msg">Advisory Routing Guidelines</label>
                <input
                  id="alert-msg"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Guide fans to secondary stairwells in Sector West."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={alertSubmitting}>
                <Send size={14} />
                Broadcast Warning Advisory
              </button>
            </form>
          </div>

          {/* AI Operational Reports Archive List */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--color-secondary)" />
              Operational Reports Archive
            </h2>

            {reports.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                No reports generated. Use the AI Compiler to initialize.
              </p>
            ) : (
              <div className="console-table-container">
                <table className="console-table">
                  <thead>
                    <tr>
                      <th>Report Name</th>
                      <th>Type</th>
                      <th>Confidence Score</th>
                      <th>Metrics Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(rep => (
                      <React.Fragment key={rep.id}>
                        <tr
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedReportId(selectedReportId === rep.id ? null : rep.id)}
                        >
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rep.title}</td>
                          <td>
                            <span className="badge badge-info">{rep.report_type.replace('_', ' ')}</span>
                          </td>
                          <td>
                            <span className="badge badge-success">{Math.round(rep.confidence_score * 100)}%</span>
                          </td>
                          <td style={{ color: 'var(--color-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>
                            {selectedReportId === rep.id ? 'Hide Content' : 'View Content'}
                          </td>
                        </tr>
                        {selectedReportId === rep.id && (
                          <tr>
                            <td colSpan={4} style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '16px' }}>
                              <pre style={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                                fontSize: '0.82rem',
                                background: '#05070b',
                                padding: '16px',
                                borderRadius: '6px',
                                color: '#cbd5e1',
                                border: '1px solid var(--border-glass)',
                                overflowX: 'auto',
                                maxHeight: '320px',
                                lineHeight: '1.4'
                              }}>{rep.content}</pre>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Col: AI Report Compiler Control */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Cpu size={18} color="var(--color-primary)" />
              AI Operational Compiler
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Compile instanced markdown logs detailing current attendance load, active volunteer tasks, and unresolved dispatches.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="report-type-select">Select Compilation Scope</label>
              <select
                id="report-type-select"
                className="form-input"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
              >
                <option value="daily">Daily Operations Log</option>
                <option value="post_match">Post Match Crowd Density Review</option>
                <option value="emergency">Emergency Dispatches Log</option>
              </select>
            </div>

            <button
              onClick={handleGenerateReport}
              className="btn btn-secondary"
              style={{ width: '100%', borderColor: 'var(--color-primary)' }}
              disabled={generatingReport}
            >
              {generatingReport ? 'Compiling Markdown Report...' : 'Compile Operational Report'}
            </button>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Leaf size={14} color="var(--color-primary)" />
              SUSTAINABILITY INDEX
            </h3>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              {stats.sustainability_status}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Carbon offset: <strong>{stats.carbon_offset_kg} kg</strong>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
