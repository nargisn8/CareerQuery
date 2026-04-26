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
          // jobType: jobType || null,  <-- Bura müvəqqəti rəyə al
          page: page,
          size: 10
        }
      });

      // SPRING BOOT PAGE FORMATI SÖRTALANIR (Datanın görünməsi üçün ən kritik yer)
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

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = { ...newJob, owner: user };
      const response = await axios.post('http://localhost:8080/api/jobs', jobData);

      // Əgər bura çatırsa, deməli hər şey superdir
      alert("✅ Təbriklər! Elan paylaşıldı!");
      setNewJob({ title: '', location: '', jobType: 'Full-time', description: '' });
      fetchJobs();
    } catch (error) {
      // Əgər bazada elanı görürsənsə, deməli sadəcə Response formatında problem var
      console.error("Xətanın detalları:", error.response);

      // Diaqnostika üçün:
      if (error.response && error.response.status === 200) {
        alert("✅ Elan əslində yaradıldı! (Response format xətası)");
        fetchJobs();
      } else {
        alert("❌ Həqiqi xəta baş verdi. Konsola bax.");
      }
    }
  };

  // DELETE FUNKSİYASI - Tam işlək vəziyyətdə
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
                <h3><i className="fas fa-plus-circle"></i> Yeni İş Elanı Paylaş</h3>
                <form onSubmit={handleCreateJob} className="form-grid">
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
                  <button type="submit" className="btn-submit form-group-full">Paylaş</button>
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
                                <button className="btn-edit" onClick={() => alert("Edit funksiyası hazırlanır!")}>
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
                      {/* Sığortalı göstərim: Əgər owner gəlməsə xəta verməsin */}
                      {job.owner ? <span className="owner-tag"> | 👤 {job.owner ? job.owner.username : "Sistem İstifadəçisi"}</span> : <span className="owner-tag"> | 👤 Anonim</span>}
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