
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch((process.env.REACT_APP_API_BASE||'http://localhost:5000') + '/api/auth/signup', {
        method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      setMessage('Signup success. Please login.');
      setTimeout(()=> navigate('/login'), 1200);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h3>Sign Up</h3>
      <form onSubmit={submit}>
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{marginBottom:12}}>
          <label><input type="radio" checked={role==='student'} onChange={()=>setRole('student')} /> Student</label>
          <label style={{marginLeft:12}}><input type="radio" checked={role==='admin'} onChange={()=>setRole('admin')} /> Admin</label>
        </div>
        <button className="button" type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
