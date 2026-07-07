import React from 'react';

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: (val: boolean) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  fullName: string;
  setFullName: (val: string) => void;
  role: 'spectator' | 'volunteer' | 'security' | 'organizer';
  setRole: (val: 'spectator' | 'volunteer' | 'security' | 'organizer') => void;
  errorMsg: string;
  setErrorMsg: (val: string) => void;
  successMsg: string;
  setSuccessMsg: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function AuthForm({
  isLogin,
  setIsLogin,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  role,
  setRole,
  errorMsg,
  setErrorMsg,
  successMsg,
  setSuccessMsg,
  handleSubmit
}: AuthFormProps) {
  return (
    <div className="container animated-fade" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isLogin ? 'Login to StadiumOS AI' : 'Create StadiumOS Account'}
        </h2>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--color-danger)',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            color: 'var(--color-danger)'
          }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--color-primary)',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            color: 'var(--color-primary)'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="register-fullname">Full Name</label>
                <input
                  id="register-fullname"
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-role">Security Role Override</label>
                <select
                  id="register-role"
                  className="form-input"
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                >
                  <option value="spectator">Spectator (Standard Fan)</option>
                  <option value="volunteer">Volunteer (Staff / Logistics)</option>
                  <option value="security">Security Patrol (Emergency Dispatcher)</option>
                  <option value="organizer">Organizer (Command Center Admin)</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
