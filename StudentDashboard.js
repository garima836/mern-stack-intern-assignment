
import React, { useEffect, useState } from 'react';
import { authFetch, useAuth } from '../auth/AuthContext';

export default function StudentDashboard(){
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', course:'' });
  const { user } = useAuth();

  const load = async () => {
    const res = await authFetch('/api/students/me/profile');
    const data = await res.json();
    if (res.ok){ setStudent(data.student); setForm({ name:data.student.name, email:data.student.email, course:data.student.course }); }
    else alert(data.message||'Error');
  };

  useEffect(()=>{ load(); }, []);

  const save = async () => {
    const res = await authFetch('/api/students/me/profile', { method:'PUT', body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok){ setStudent(data.student); alert('Saved'); }
    else alert(data.message||'Error');
  };

  if (!student) return <div>Loading...</div>;
  return (
    <div>
      <h3>Student Dashboard</h3>
      <p>Welcome, {user.name} — view and update your profile.</p>
      <div>
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="input" placeholder="Course" value={form.course} onChange={e=>setForm({...form, course:e.target.value})} />
        <button className="button" onClick={save}>Save</button>
      </div>
    </div>
  );
}
