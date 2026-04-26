import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import './App.css';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [newJob, setNewJob] = useState({ title: '', location: '', jobType: 'Full-time', description: '' });
  const [editingId, setEditingId] = useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      if (savedUser && savedUser !== "undefined") {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/jobs', {
        params: {
          keyword: keyword.trim() || null,
          location: location.trim() || null,
          page: page,
          size: 10
        }
      });

      if (response.data && response.data.content) {
        setJobs(response.data.content);
        setTotalPages(response.data.totalPages);
      } else if (Array.isArray(response.data)) {
        setJobs(response.data);
        setTotalPages(1);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Məlumat yüklənərkən xəta:", error);
      setJobs([]);
    }
    setLoading(false);
  }, [keyword, location, jobType, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchJobs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = { ...newJob, owner: user };
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/jobs/${editingId}`, jobData);
        alert("✅ Elan yeniləndi!");
      } else {
        await axios.post('http://localhost:8080/api/jobs', jobData);
        alert("✅ Elan paylaşıldı!");
      }
      setEditingId(null);
      setNewJob({ title: '', location: '', jobType: 'Full-time', description: '' });
      fetchJobs();
    } catch (error) {
      console.error("Xəta:", error);
      alert("❌ Problem baş verdi!");
    }
  };

  const handleEdit = (job) => {
    setNewJob({
      title: job.title,
      location: job.location,
      jobType: job.jobType,
      description: job.description || ''
    });
    setEditingId(job.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu elanı silmək istədiyinizə əminsiniz?")) {
      try {
        await axios.delete(`http://localhost:8080/api/jobs/${id}`);
        alert("🗑️ Elan uğurla silindi!");
        fetchJobs();
      } catch (error) {
        alert("Xəta: Bu elanı silmək üçün icazəniz yoxdur!");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
      <div className="container">
        <header className="header-main">
          <h1>💼 CareerQuery</h1>
          <div className="user-nav">
            {user ? (
                <div className="user-info-card">
                  <span className="welcome-msg">Xoş gəldin, <strong>{user.username}</strong>!</span>
                  <button onClick={handleLogout} className="btn-logout">Çıxış</button>
                </div>
            ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn-login-nav">Giriş</Link>
                  <Link to="/register" className="btn-register-nav">Qeydiyyat</Link>
                </div>
            )}
          </div>
        </header>

        {user ? (
            <section className="create-job-section">
              <div className="form-card">
                <h3><i className="fas fa-plus-circle"></i> {editingId ? "Elanı Redaktə Et" : "Yeni İş Elanı Paylaş"}</h3>
                <form onSubmit={handleSubmit} className="form-grid">
                  <input type="text" placeholder="İşin adı" required value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
                  <input type="text" placeholder="Şəhər" required value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
                  <select value={newJob.jobType} onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                  <div className="form-group-full">
                    <textarea placeholder="Məlumat..." required value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}></textarea>
                  </div>
                  <button type="submit" className="btn-submit form-group-full">
                    {editingId ? "Yadda Saxla" : "Paylaş"}
                  </button>
                  {editingId && <button onClick={() => { setEditingId(null); setNewJob({ title: '', location: '', jobType: 'Full-time', description: '' }); }} className="btn-cancel">Ləğv et</button>}
                </form>
              </div>
            </section>
        ) : (
            <div className="auth-notice">
              <p>📢 İş elanı paylaşmaq üçün <Link to="/login">daxil olun</Link>.</p>
            </div>
        )}

        <hr className="separator" />

        <section className="search-section">
          <div className="search-box">
            <div className="search-input-wrapper">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Açar söz..." value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(0); }} />
            </div>
            <div className="search-input-wrapper">
              <i className="fas fa-map-marker-alt"></i>
              <input type="text" placeholder="Məkan..." value={location} onChange={(e) => { setLocation(e.target.value); setPage(0); }} />
            </div>
          </div>
        </section>

        <main className="job-list">
          {loading ? (
              <div className="loader">Yüklənir...</div>
          ) : (jobs && jobs.length > 0) ? (
              jobs.map(job => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <h3>{job.title}</h3>
                      <div className="job-actions">
                        <span className="badge">{job.jobType}</span>
                        <div className="owner-controls">
                          {user && job.owner && (user.id === job.owner.id) ? (
                              <>
                                <button className="btn-edit" onClick={() => handleEdit(job)}>
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn-delete" onClick={() => handleDelete(job.id)}>
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </>
                          ) : (
                              <>
                                <button className="btn-edit-disabled" title="Yalnız öz elanınızı redaktə edə bilərsiniz"><i className="fas fa-edit"></i></button>
                                <button className="btn-delete-disabled" title="Yalnız öz elanınızı silə bilərsiniz"><i className="fas fa-trash-alt"></i></button>
                              </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="job-meta">
                      <span>📍 {job.location}</span>
                      <span className="owner-tag"> | 👤 {job.owner ? job.owner.username : "Anonim"}</span>
                    </div>
                    <p className="desc">{job.description}</p>
                  </div>
              ))
          ) : (
              <div className="no-jobs">Hələ ki, göstəriləcək iş elanı yoxdur.</div>
          )}
        </main>

        {totalPages > 0 && (
            <div className="pagination">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}><i className="fas fa-chevron-left"></i> Əvvəlki</button>
              <span className="page-info">Səhifə <strong>{page + 1}</strong> / {totalPages}</span>
              <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Növbəti <i className="fas fa-chevron-right"></i></button>
            </div>
        )}
      </div>
  );
};

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
  );
}

export default App;