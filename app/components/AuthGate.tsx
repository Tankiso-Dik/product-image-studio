import React, { useState, useEffect, ReactNode } from 'react';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin_pass');
    if (stored === 'PaperMoon') {
      setAuthed(true);
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password === 'PaperMoon') {
      localStorage.setItem('admin_pass', 'PaperMoon');
      setAuthed(true);
    }
  }

  if (authed) {
    return <>{children}</>;
  }

  return (
    <form onSubmit={submit}>
      <label>
        Admin Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Enter</button>
    </form>
  );
}
