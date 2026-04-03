import { useState } from 'react';
import axios from 'axios';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleShorten() {
        setError(''); 
        setResult(null); 
        setLoading(true);
        try {
            const res = await axios.post(`${API}/api/url/shorten`, { url });
            setResult(res.data);
        } catch (e) {
            setError(e.response?.data?.error || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='container'>
            <h1>URL Shortener</h1>
            <input
                type='url'
                placeholder='https://very-long-url.example.com/...'
                value={url}
                onChange={e => setUrl(e.target.value)}
            />
            <button onClick={handleShorten} disabled={loading}>
                {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
            
            {error && <p className='error'>{error}</p>}
            
            {result && (
                <div className='result'>
                    <p>Short URL:</p>
                    <a href={result.shortUrl} target='_blank' rel='noreferrer'>
                        {result.shortUrl}
                    </a>
                </div>
            )}
        </div>
    );
}