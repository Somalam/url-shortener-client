import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [url, setUrl]         = useState('');
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied]   = useState(false);

  async function handleShorten() {
    if (!url) return;
    setError(''); setResult(null); setLoading(true);
    try {
      const res = await axios.post(`${API}/api/url/shorten`, { url });
      setResult(res.data);
      setHistory(prev => [res.data, ...prev].slice(0, 10));
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong.');
    } finally { setLoading(false); }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleShorten();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #0a0a0f;
          --surface:  #13131a;
          --border:   #2a2a3a;
          --accent:   #7c6aff;
          --accent2:  #ff6a9b;
          --text:     #e8e8f0;
          --muted:    #6b6b80;
          --success:  #4fffb0;
          --error:    #ff5c7a;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* animated noise grain overlay */
        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        .wrapper {
          position: relative; z-index: 1;
          max-width: 780px;
          margin: 0 auto;
          padding: 60px 24px 100px;
        }

        /* ── HEADER ── */
        .header {
          text-align: center;
          margin-bottom: 56px;
          animation: fadeUp 0.6s ease both;
        }
        .badge {
          display: inline-block;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--accent);
          border: 1px solid var(--accent);
          border-radius: 100px;
          padding: 4px 14px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: clamp(2.8rem, 8vw, 5rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -2px;
          background: linear-gradient(135deg, #fff 30%, var(--accent) 70%, var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .subtitle {
          margin-top: 14px;
          color: var(--muted);
          font-size: 1rem;
          letter-spacing: 0.5px;
        }

        /* ── INPUT CARD ── */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          animation: fadeUp 0.6s 0.1s ease both;
          position: relative;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(124,106,255,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .input-group {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }
        .url-input {
          flex: 1;
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 18px 20px;
          font-family: 'Space Mono', monospace;
          font-size: 0.95rem;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          min-width: 0;
        }
        .url-input::placeholder { color: var(--muted); }
        .url-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(124,106,255,0.15);
        }

        .btn-shorten {
          background: linear-gradient(135deg, var(--accent), #9b6aff);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 18px 32px;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.15s, opacity 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(124,106,255,0.35);
          letter-spacing: 0.5px;
        }
        .btn-shorten:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(124,106,255,0.5);
        }
        .btn-shorten:active:not(:disabled) { transform: translateY(0); }
        .btn-shorten:disabled { opacity: 0.6; cursor: not-allowed; }

        /* loading spinner inside button */
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        /* ── RESULT ── */
        .result-card {
          background: rgba(79, 255, 176, 0.05);
          border: 1.5px solid rgba(79, 255, 176, 0.25);
          border-radius: 14px;
          padding: 20px 24px;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          animation: fadeUp 0.3s ease both;
        }
        .result-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--success);
          margin-bottom: 6px;
        }
        .result-link {
          font-family: 'Space Mono', monospace;
          font-size: 1rem;
          color: var(--success);
          text-decoration: none;
          word-break: break-all;
        }
        .result-link:hover { text-decoration: underline; }

        .btn-copy {
          background: rgba(79,255,176,0.1);
          border: 1px solid rgba(79,255,176,0.3);
          color: var(--success);
          border-radius: 8px;
          padding: 10px 18px;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .btn-copy:hover { background: rgba(79,255,176,0.18); }

        /* ── ERROR ── */
        .error-msg {
          background: rgba(255,92,122,0.08);
          border: 1px solid rgba(255,92,122,0.3);
          border-radius: 10px;
          padding: 12px 18px;
          margin-top: 16px;
          color: var(--error);
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
          animation: fadeUp 0.3s ease both;
        }

        /* ── HISTORY TABLE ── */
        .history-section {
          animation: fadeUp 0.6s 0.2s ease both;
        }
        .section-title {
          font-size: 0.75rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--muted);
          font-family: 'Space Mono', monospace;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .table-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
        }
        thead {
          background: rgba(124,106,255,0.08);
          border-bottom: 1px solid var(--border);
        }
        th {
          padding: 14px 20px;
          text-align: left;
          color: var(--muted);
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-size: 0.7rem;
        }
        td {
          padding: 14px 20px;
          border-bottom: 1px solid rgba(42,42,58,0.5);
          color: var(--text);
          vertical-align: middle;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(124,106,255,0.04); }

        .code-pill {
          display: inline-block;
          background: rgba(124,106,255,0.15);
          color: var(--accent);
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
        .orig-url {
          max-width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--muted);
        }
        .short-link {
          color: var(--accent);
          text-decoration: none;
        }
        .short-link:hover { text-decoration: underline; }
        .date-cell { color: var(--muted); font-size: 0.72rem; }

        .empty-state {
          text-align: center;
          padding: 48px 20px;
          color: var(--muted);
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
        }
        .empty-icon {
          font-size: 2rem;
          margin-bottom: 12px;
          display: block;
          opacity: 0.4;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 560px) {
          .input-group { flex-direction: column; }
          .btn-shorten { width: 100%; justify-content: center; }
          th:nth-child(3), td:nth-child(3) { display: none; }
        }
      `}</style>

      <div className="wrapper">
        {/* Header */}
        <header className="header">
          <div className="badge">URL Shortener</div>
          <h1>Make it short.</h1>
          <p className="subtitle">Paste any long URL and get a clean, shareable link instantly.</p>
        </header>

        {/* Input Card */}
        <div className="card">
          <div className="input-group">
            <input
              className="url-input"
              type="url"
              placeholder="https://very-long-url.example.com/with/a/long/path..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn-shorten" onClick={handleShorten} disabled={loading || !url}>
              {loading ? <><span className="spinner"/>Shortening</> : 'Shorten →'}
            </button>
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          {result && (
            <div className="result-card">
              <div>
                <div className="result-label">✓ Your short link</div>
                <a className="result-link" href={result.shortUrl} target="_blank" rel="noreferrer">
                  {result.shortUrl}
                </a>
              </div>
              <button className="btn-copy" onClick={() => handleCopy(result.shortUrl)}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* History / DB Viewer */}
        <div className="history-section">
          <div className="section-title">Session history</div>
          <div className="table-wrap">
            {history.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">⬡</span>
                No links shortened yet — your session history will appear here.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Short URL</th>
                    <th>Original URL</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, i) => (
                    <tr key={i}>
                      <td><span className="code-pill">{item.shortCode}</span></td>
                      <td>
                        <a className="short-link" href={item.shortUrl} target="_blank" rel="noreferrer">
                          {item.shortUrl?.replace(/^https?:\/\//, '')}
                        </a>
                      </td>
                      <td>
                        <div className="orig-url" title={item.originalUrl || ''}>
                          {item.originalUrl || url}
                        </div>
                      </td>
                      <td className="date-cell">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
