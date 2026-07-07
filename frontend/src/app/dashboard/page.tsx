'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/context/AuthContext';
import { useAccessibility } from '@/core/context/AccessibilityContext';
import { useRouter } from 'next/navigation';
import { useDashboard, CommandCenterStats } from '@/core/hooks/useDashboard';
import { OperationReportDTO } from '@/core/types';
import { LayoutDashboard } from 'lucide-react';
import StatsCards from '../../features/dashboard/components/StatsCards';
import CongestionAlertForm from '../../features/dashboard/components/CongestionAlertForm';
import ReportsTable from '../../features/dashboard/components/ReportsTable';

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

      <StatsCards stats={stats} />

      <div className="two-col-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <CongestionAlertForm
            sector={sector}
            setSector={setSector}
            congestionLevel={congestionLevel}
            setCongestionLevel={setCongestionLevel}
            spectatorCount={spectatorCount}
            setSpectatorCount={setSpectatorCount}
            capacity={capacity}
            setCapacity={setCapacity}
            message={message}
            setMessage={setMessage}
            alertSubmitting={alertSubmitting}
            handleBroadcastAlert={handleBroadcastAlert}
          />
          <ReportsTable
            reports={reports}
            reportType={reportType}
            setReportType={setReportType}
            generatingReport={generatingReport}
            handleGenerateReport={handleGenerateReport}
            selectedReportId={selectedReportId}
            setSelectedReportId={setSelectedReportId}
          />
        </div>
      </div>
    </div>
  );
}
