'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/context/AuthContext';
import { useAccessibility } from '@/core/context/AccessibilityContext';
import { useRouter } from 'next/navigation';
import { useVolunteerTasks } from '@/core/hooks/useVolunteer';
import { VolunteerTaskDTO } from '@/core/types';
import { Users } from 'lucide-react';
import TaskForm from '../../features/volunteer/components/TaskForm';
import TasksGrid from '../../features/volunteer/components/TasksGrid';

export default function VolunteerHub() {
  const { user, loading } = useAuth();
  const { announce } = useAccessibility();
  const router = useRouter();
  const { getTasks, createTask, updateTask } = useVolunteerTasks();

  const [tasks, setTasks] = useState<VolunteerTaskDTO[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [sector, setSector] = useState('North Stand');
  const [shiftStart, setShiftStart] = useState('2026-07-07T18:00');
  const [shiftEnd, setShiftEnd] = useState('2026-07-07T22:00');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err: any) {
      setErrorMsg(`Failed to query volunteer tasks: ${err.message}`);
    }
  };

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await createTask({
        title,
        description,
        priority,
        sector,
        shift_start: new Date(shiftStart).toISOString(),
        shift_end: new Date(shiftEnd).toISOString()
      });
      setSuccessMsg('Volunteer duty task created and dispatched!');
      announce(`Created volunteer task: ${title}`);
      setTitle('');
      setDescription('');
      loadTasks();
    } catch (err: any) {
      setErrorMsg(`Failed to generate task: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (taskId: number, updates: { status?: string; assigned_to_id?: number | null; priority?: string }) => {
    setErrorMsg('');
    try {
      const updated = await updateTask(taskId, updates);
      setSuccessMsg(`Task '${updated.title}' updated successfully.`);
      announce(`Volunteer task updated: ${updated.status}`);
      loadTasks();
    } catch (err: any) {
      setErrorMsg(`Failed to update task: ${err.message}`);
    }
  };

  if (loading || !user) {
    return (
      <div className="container animated-fade" style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '280px', height: '36px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '420px', height: '18px' }} />
        </div>
        <div className="two-col-layout">
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="skeleton" style={{ width: '40%', height: '22px', marginBottom: '10px' }} />
          </div>
        </div>
      </div>
    );
  }

  const isOrganizer = user.role === 'organizer';

  return (
    <div className="container animated-fade">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={26} color="var(--color-primary)" />
          Volunteer Copilot Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage resources, coordinate shift duties, assign sectors, and log task status.
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
        <TasksGrid tasks={tasks} userId={user.id} handleUpdateStatus={handleUpdateStatus} />
        {isOrganizer && (
          <TaskForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            priority={priority}
            setPriority={setPriority}
            sector={sector}
            setSector={setSector}
            shiftStart={shiftStart}
            setShiftStart={setShiftStart}
            shiftEnd={shiftEnd}
            setShiftEnd={setShiftEnd}
            handleCreateTask={handleCreateTask}
          />
        )}
      </div>
    </div>
  );
}
