
import React, { useEffect, useState } from 'react';
import { authFetch, useAuth } from '../auth/AuthContext';

export default function AdminDashboard(){
  const [students, setStudents] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [form, setForm] = useState({ name:'', email:'', course:'' });
  const { user } = useAuth();

  const load = async (page=1) => {
    const res = await authFetch('/api/students?page='+page+'&limit=10');
    const data = await res.json();
    if (res.ok) {
      setStudents(data.students);
      setPageInfo({ page:data.page, pages:data.pages, total:data.total });
    } else {
      alert(data.message || 'Error');
    }
  };

  useEffect(()=>{ load(); }, []);

  const createStudent = async () => {
    const res = await authFetch('/api/students', { method:'POST', body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok){ setForm({ name:'', email:'', course:'' }); load(); }
    else alert(data.message || 'Error');
  };

  const deleteStudent = async (id) => {
    if (!window.confirm('Delete?')) return;
    const res = await authFetch('/api/students/'+id, { method:'DELETE' });
    const data = await res.json();
    if (res.ok) load();
    else alert(data.message || 'Error');
  };

  const startEdit = (s) => setForm({ ...s, enrollmentDate: s.enrollmentDate });
  const saveEdit = async () => {
    if (!form._id) return createStudent();
    const res = await authFetch('/api/students/'+form._id, { method:'PUT', body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setForm({ name:'', email:'', course:'' }); load(); } else alert(data.message||'Error');
  };

  return (
    <div>
      <h3>Admin Dashboard</h3>
      <p>Welcome, {user.name}. Manage students below.</p>
      <div style={{marginBottom:16}}>
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="input" placeholder="Course" value={form.course} onChange={e=>setForm({...form, course:e.target.value})} />
        <button className="button" onClick={saveEdit}>{form._id? 'Save' : 'Add Student'}</button>
      </div>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Enrolled</th><th>Actions</th></tr></thead>
        <tbody>
          {students.map(s=>(
            <tr key={s._id}>
              <td>{s.name}</td><td>{s.email}</td><td>{s.course}</td><td>{new Date(s.enrollmentDate).toLocaleDateString()}</td>
              <td>
                <button className="button" onClick={()=>startEdit(s)}>Edit</button>
                <button className="button" style={{marginLeft:8}} onClick={()=>deleteStudent(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:12}}>
        {pageInfo.page > 1 && <button className="button" onClick={()=>load(pageInfo.page-1)}>Prev</button>}
        <span style={{margin:'0 8px'}}> Page {pageInfo.page || 1} of {pageInfo.pages || 1} </span>
        {pageInfo.page < pageInfo.pages && <button className="button" onClick={()=>load((pageInfo.page||1)+1)}>Next</button>}
      </div>
    </div>
  );
}
