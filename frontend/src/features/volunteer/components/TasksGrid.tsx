import React from 'react';
import { VolunteerTaskDTO } from '../../../core/types';
import { ClipboardList, Calendar, CheckSquare } from 'lucide-react';

interface TasksGridProps {
  tasks: VolunteerTaskDTO[];
  userId: number;
  handleUpdateStatus: (id: number, updates: any) => void;
}

export default function TasksGrid({ tasks, userId, handleUpdateStatus }: TasksGridProps) {
  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', margin: 0 }}>
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
            const isAssignedToMe = task.assigned_to_id === userId;
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
                gap: '10px'
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

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', justifyContent: 'flex-end' }}>
                  {isUnassigned && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, { assigned_to_id: userId, status: 'active' })}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      Claim Duty
                    </button>
                  )}
                  {isAssignedToMe && task.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, { status: 'completed' })}
                      className="btn btn-primary"
                      style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckSquare size={12} />
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
