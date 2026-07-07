'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { useAccessibility } from '../../core/context/AccessibilityContext';
import { useRouter } from 'next/navigation';
import { useVolunteerTasks } from '../../core/hooks/useVolunteer';
import { VolunteerTaskDTO } from '../../core/types';
import { Users, ClipboardList, Plus, AlertCircle, Calendar } from 'lucide-react';

export default function VolunteerHub() {
  const { user, loading } = useAuth();
  const { announce } = useAccessibility();
  const router = useRouter();
  const { getTasks, createTask, updateTask } = useVolunteerTasks();

  const [tasks, setTasks] = useState<VolunteerTaskDTO[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create Task Form States (Organizer only)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [sector, setSector] = useState('North Stand');
  const [shiftStart, setShiftStart] = useState('2026-07-07T12:00');
  const [shiftEnd, setShiftEnd] = useState('2026-07-07T18:00');

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
      setErrorMsg(`Failed to fetch tasks: ${err.message}`);
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
      
      // Reset fields
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
            {[1, 2, 3].map(idx => (
              <div key={idx} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div className="skeleton" style={{ width: '60%', height: '18px' }} />
                  <div className="skeleton" style={{ width: '15%', height: '18px' }} />
                </div>
                <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '12px' }} />
                <div className="skeleton" style={{ width: '40%', height: '12px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isOrganizer = user.role === 'organizer';

  return (
    <div className="container animated-fade">
      
      {/* Header */}
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
        
        {/* Active Tasks List Checklist */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <ClipboardList size={18} color="var(--color-secondary)" />
            Shift Duties & Checklists
          </h2>

          {tasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '30px 0' }}>
              No volunteer tasks logged in this sector.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tasks.map(task => {
                const isAssignedToMe = task.assigned_to_id === user.id;
                const isUnassigned = !task.assigned_to_id;
                
                let priorityClass = 'badge-info';
                if (task.priority === 'high') priorityClass = 'badge-danger';
                else if (task.priority === 'medium') priorityClass = 'badge-warning';

                let statusClass = 'badge-info';
                if (task.status === 'completed') statusClass = 'badge-success';
                else if (task.status === 'active') statusClass = 'badge-warning';

                return (
                  <div key={task.id} style={{
                    background: 'rgba(15, 23, 42, 0.3)',
                    border: '1px solid var(--border-glass)',
                    padding: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'var(--transition-smooth)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{task.title}</h4>
                      <span className={`badge ${priorityClass}`}>{task.priority}</span>
                    </div>

                    <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-secondary)' }}>{task.description}</p>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>Sector: <strong style={{ color: 'var(--text-secondary)' }}>{task.sector}</strong></span>
                      <span>Status: <span className={`badge ${statusClass}`} style={{ padding: '2px 8px', fontSize: '0.72rem' }}>{task.status}</span></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {new Date(task.shift_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(task.shift_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>

                    {/* Action buttons based on Role */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', justifyContent: 'flex-end' }}>
                      
                      {/* Claim Duty (Volunteers can claim empty jobs) */}
                      {!isOrganizer && isUnassigned && (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                          onClick={() => handleUpdateStatus(task.id, { assigned_to_id: user.id })}
                        >
                          Claim Duty
                        </button>
                      )}

                      {/* State transitions for assigned duty */}
                      {!isOrganizer && isAssignedToMe && (
                        <>
                          {task.status === 'pending' && (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                              onClick={() => handleUpdateStatus(task.id, { status: 'active' })}
                            >
                              Start Duty Shift
                            </button>
                          )}
                          {task.status === 'active' && (
                            <button
                              className="btn btn-danger"
                              style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                              onClick={() => handleUpdateStatus(task.id, { status: 'completed' })}
                            >
                              Complete Shift
                            </button>
                          )}
                        </>
                      )}

                      {/* Organizer controls to mark complete */}
                      {isOrganizer && task.status !== 'completed' && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                          onClick={() => handleUpdateStatus(task.id, { status: 'completed' })}
                        >
                          Verify Completed
                        </button>
                      )}
                      
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Create Task Form (Organizer only) */}
        {isOrganizer ? (
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <h2>Dispatch Shift Duty</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Assign and log tasks for local stadium sectors. Dispatches are routed immediately.
            </p>

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label" htmlFor="task-title">Duty Title</label>
                <input
                  id="task-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Check elevator alignment"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-desc">Task Description</label>
                <textarea
                  id="task-desc"
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="Describe step-by-step expectations"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" htmlFor="task-priority">Priority</label>
                  <select
                    id="task-priority"
                    className="form-input"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="task-sector">Target Sector</label>
                  <select
                    id="task-sector"
                    className="form-input"
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                  >
                    <option value="North Stand">North Stand</option>
                    <option value="South Stand">South Stand</option>
                    <option value="East Stand">East Stand</option>
                    <option value="West Stand">West Stand</option>
                    <option value="Main Concourse">Concourse</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-start">Shift Start</label>
                <input
                  id="task-start"
                  type="datetime-local"
                  className="form-input"
                  value={shiftStart}
                  onChange={e => setShiftStart(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-end">Shift End</label>
                <input
                  id="task-end"
                  type="datetime-local"
                  className="form-input"
                  value={shiftEnd}
                  onChange={e => setShiftEnd(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={14} />
                Dispatch Task
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <h3>Volunteer Dashboard</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Welcome back to your Copilot portal! Here you can check off assigned roles, review sector priorities, and claim available jobs.
            </p>
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} color="var(--color-primary)" />
              <span>Make sure to wear your official badge at checkpoints.</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
