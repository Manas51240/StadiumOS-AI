'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/core/context/AuthContext';
import { useAccessibility } from '@/core/context/AccessibilityContext';
import { useRouter } from 'next/navigation';
import { useEmergencyIncidents } from '@/core/hooks/useEmergency';
import { IncidentDTO } from '@/core/types';
import { ShieldAlert } from 'lucide-react';
import IncidentForm from '../../features/emergency/components/IncidentForm';
import IncidentLogsTable from '../../features/emergency/components/IncidentLogsTable';

export default function EmergencyCenter() {
  const { user, loading } = useAuth();
  const { announce } = useAccessibility();
  const router = useRouter();
  const { getIncidents, createIncident, resolveIncident } = useEmergencyIncidents();

  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [category, setCategory] = useState('medical');
  const [severity, setSeverity] = useState('low');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const loadIncidents = useCallback(async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (err: any) {
      setErrorMsg(`Failed to query incident logs: ${err.message}`);
    }
  }, [getIncidents]);

  useEffect(() => {
    if (user) {
      loadIncidents();
    }
  }, [user, loadIncidents]);

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
        <IncidentForm
          category={category}
          setCategory={setCategory}
          severity={severity}
          setSeverity={setSeverity}
          location={location}
          setLocation={setLocation}
          description={description}
          setDescription={setDescription}
          submitting={submitting}
          handleReport={handleReport}
        />
        {showLogs && (
          <IncidentLogsTable
            incidents={incidents}
            userRole={user.role}
            handleResolve={handleResolve}
            selectedIncidentId={selectedIncidentId}
            setSelectedIncidentId={setSelectedIncidentId}
          />
        )}
      </div>
    </div>
  );
}
