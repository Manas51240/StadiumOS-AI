'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { useAccessibility } from '../../core/context/AccessibilityContext';
import { useRouter } from 'next/navigation';
import { useEmergencyIncidents } from '../../core/hooks/useEmergency';
import { IncidentDTO } from '../../core/types';
import { ShieldAlert, Radio, CheckCircle, Clock } from 'lucide-react';

export default function EmergencyHub() {
  const { user, loading } = useAuth();
  const { announce } = useAccessibility();
  const router = useRouter();
  const { getIncidents, createIncident, resolveIncident } = useEmergencyIncidents();

  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [category, setCategory] = useState('medical');
  const [severity, setSeverity] = useState('medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const loadIncidents = async () => {
    try {
      if (user?.role !== 'spectator') {
        const data = await getIncidents();
        setIncidents(data);
      }
    } catch (err: any) {
      setErrorMsg(`Failed to query incident logs: ${err.message}`);
    }
  };

  useEffect(() => {
    if (user) {
      loadIncidents();
    }
  }, [user]);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await createIncident({
        category,
        severity,
        location,
        description
      });
      
      setSuccessMsg('Incident reported! Dispatcher guidelines compiled by AI.');
      announce(`Incident logged: ${category} at ${location}`);
      
      // Reset form
      setLocation('');
      setDescription('');
      
      loadIncidents();
    } catch (err: any) {
      setErrorMsg(`Failed to log incident: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id: number) => {
    setErrorMsg('');
    try {
      await resolveIncident(id);
      setSuccessMsg('Incident status set to Resolved.');
      announce('Incident marked resolved');
      loadIncidents();
    } catch (err: any) {
      setErrorMsg(`Failed to resolve incident: ${err.message}`);
    }
  };

  if (loading || !user) {
    return (
      <div className="container animated-fade" style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '320px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '480px', height: '18px' }} />
        </div>

        <div className="two-col-layout">
          <div className="glass-panel" style={{ height: '250px' }}>
            <div className="skeleton" style={{ width: '50%', height: '22px', marginBottom: '16px' }} />
            <div className="skeleton" style={{ width: '90%', height: '40px', marginBottom: '16px' }} />
            <div className="skeleton" style={{ width: '100%', height: '40px' }} />
          </div>
        </div>
      </div>
    );
  }

  const showLogs = user.role !== 'spectator';

  return (
    <div className="container animated-fade">
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)' }}>
          <ShieldAlert size={26} />
          Emergency Operations Command
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Log localized stadium safety issues, review active emergencies, and access AI-generated dispatcher instructions.
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

      <div className="two-col-layout">
        
        {/* Incident Report Form */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <form onSubmit={handleReport}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Report Incident</h2>

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" htmlFor="incident-category">Category</label>
                <select
                  id="incident-category"
                  className="form-input"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="medical">Medical Alert</option>
                  <option value="security">Security Issue</option>
                  <option value="facilities">Facilities Hazard</option>
                  <option value="fire">Fire Threat</option>
                  <option value="other">Other Hazard</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="incident-severity">Severity Rating</label>
                <select
                  id="incident-severity"
                  className="form-input"
                  value={severity}
                  onChange={e => setSeverity(e.target.value)}
                >
                  <option value="low">Low (Minor Issue)</option>
                  <option value="medium">Medium (Requires Steward)</option>
                  <option value="high">High (Priority Response)</option>
                  <option value="critical">Critical (Evacuation Threat)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="incident-location">Stadium Coordinate Location</label>
              <input
                id="incident-location"
                type="text"
                className="form-input"
                placeholder="e.g. Sector West, Row 10, Seat 4"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="incident-desc">Incident Description Details</label>
              <textarea
                id="incident-desc"
                className="form-input"
                rows={3}
                placeholder="Describe: collapsed fan, smoke visibility, blocked accessibility paths..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            <button type="submit" className="btn btn-danger" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Registering Dispatch Report...' : 'Transmit Emergency Dispatch'}
            </button>
          </form>
        </div>

        {/* Dispatch Logs (Visible to Staff only) */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} color="var(--color-primary)" />
            Active Emergency Logs
          </h2>

          {!showLogs ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
              <p>Security logging console restricted to Operations Staff and First Responders.</p>
            </div>
          ) : incidents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '30px 0' }}>
              All clear. No unresolved emergencies logged in MetLife Stadium.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '500px', overflowY: 'auto' }}>
              {incidents.map(inc => {
                let severityClass = 'badge-info';
                if (inc.severity === 'critical') severityClass = 'badge-danger';
                else if (inc.severity === 'high') severityClass = 'badge-warning';

                return (
                  <div key={inc.id} style={{
                    background: 'rgba(15, 23, 42, 0.3)',
                    border: `1px solid ${inc.status === 'resolved' ? 'var(--border-glass)' : 'rgba(239, 68, 68, 0.3)'}`,
                    borderLeft: `4px solid ${inc.status === 'resolved' ? 'var(--color-primary)' : 'var(--color-danger)'}`,
                    padding: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${severityClass}`}>
                        {inc.category} - {inc.severity}
                      </span>

                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {inc.status === 'resolved' ? (
                          <>
                            <CheckCircle size={12} color="var(--color-primary)" />
                            Resolved
                          </>
                        ) : (
                          <>
                            <Clock size={12} color="var(--color-danger)" />
                            Active
                          </>
                        )}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-primary)' }}>{inc.description}</p>
                    
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Coordinate Location: <strong>{inc.location}</strong>
                    </div>

                    {inc.response_instructions && (
                      <div style={{
                        background: 'rgba(10, 20, 35, 0.6)',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        borderLeft: '3px solid var(--color-secondary)',
                        color: 'var(--text-secondary)'
                      }}>
                        <strong>AI Dispatcher Guidance:</strong> {inc.response_instructions}
                      </div>
                    )}

                    {/* Resolve action */}
                    {inc.status !== 'resolved' && (user.role === 'organizer' || user.role === 'security') && (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', alignSelf: 'flex-end', marginTop: '4px' }}
                        onClick={() => handleResolve(inc.id)}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
