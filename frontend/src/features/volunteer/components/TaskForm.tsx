import React from 'react';
import { Calendar } from 'lucide-react';

interface TaskFormProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  sector: string;
  setSector: (val: string) => void;
  shiftStart: string;
  setShiftStart: (val: string) => void;
  shiftEnd: string;
  setShiftEnd: (val: string) => void;
  handleCreateTask: (e: React.FormEvent) => void;
}

export default function TaskForm({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  sector,
  setSector,
  shiftStart,
  setShiftStart,
  shiftEnd,
  setShiftEnd,
  handleCreateTask
}: TaskFormProps) {
  return (
    <div className="glass-panel" style={{ height: 'fit-content' }}>
      <form onSubmit={handleCreateTask}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--color-primary)" />
          Dispatch Volunteer Duty
        </h2>

        <div className="form-group">
          <label className="form-label" htmlFor="task-title">Duty Title</label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g. Assist gate evacuation"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-desc">Task Instructions</label>
          <textarea
            id="task-desc"
            className="form-input"
            rows={3}
            placeholder="Describe coordinates, steps, security radio protocols..."
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
              <option value="low">Low Priority</option>
              <option value="medium">Medium Load</option>
              <option value="high">High Evac</option>
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="task-sector">Stadium Sector</label>
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
              <option value="Main Concourse">Main Concourse</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
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

          <div>
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
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Dispatch Task
        </button>
      </form>
    </div>
  );
}
