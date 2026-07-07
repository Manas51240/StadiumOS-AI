import React from 'react';

interface IncidentFormProps {
  category: string;
  setCategory: (val: string) => void;
  severity: string;
  setSeverity: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  submitting: boolean;
  handleReport: (e: React.FormEvent) => void;
}

export default function IncidentForm({
  category,
  setCategory,
  severity,
  setSeverity,
  location,
  setLocation,
  description,
  setDescription,
  submitting,
  handleReport
}: IncidentFormProps) {
  return (
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
          />
        </div>

        <button type="submit" className="btn btn-danger" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? 'Submitting Report...' : 'Submit Incident Report'}
        </button>
      </form>
    </div>
  );
}
