import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Grid, TextField, Button } from '@mui/material';

function UrlStatisticsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [singleStat, setSingleStat] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:8081/shorturls/stats');
        if (!res.ok) throw new Error('Failed to fetch statistics');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError('Could not load statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleShortcodeSearch = async (e) => {
    e.preventDefault();
    setSingleLoading(true);
    setSingleError('');
    setSingleStat(null);
    try {
      const res = await fetch(`http://localhost:8081/shorturls/${shortcode}`);
      if (!res.ok) throw new Error('Shortcode not found');
      const data = await res.json();
      setSingleStat(data);
    } catch (err) {
      setSingleError('Shortcode not found or error fetching data.');
    } finally {
      setSingleLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          URL Shortener Statistics
        </Typography>
        <Box component="form" onSubmit={handleShortcodeSearch} sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Search by Shortcode"
            value={shortcode}
            onChange={e => setShortcode(e.target.value)}
            size="small"
          />
          <Button type="submit" variant="contained" disabled={singleLoading || !shortcode}>
            {singleLoading ? 'Searching...' : 'Search'}
          </Button>
        </Box>
        {singleError && <Typography color="error">{singleError}</Typography>}
        {singleStat && (
          <Paper sx={{ p: 2, my: 1, background: '#f5f5f5' }}>
            <Typography><b>Short URL:</b> <a href={singleStat.shortLink} target="_blank" rel="noopener noreferrer">{singleStat.shortLink}</a></Typography>
            <Typography><b>Original URL:</b> {singleStat.originalUrl}</Typography>
            <Typography><b>Shortcode:</b> {singleStat.shortcode}</Typography>
            <Typography><b>Created At:</b> {singleStat.createdAt}</Typography>
            <Typography><b>Expiry:</b> {singleStat.expiry}</Typography>
            <Typography><b>Total Clicks:</b> {singleStat.totalClicks}</Typography>
            {singleStat.clicks && singleStat.clicks.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2">Click Details:</Typography>
                <ul>
                  {singleStat.clicks.map((click, cidx) => (
                    <li key={cidx}>
                      {click.timestamp} | Referrer: {click.referrer || 'N/A'} | Location: {click.location || 'N/A'}
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Paper>
        )}
        <Typography variant="h6" sx={{ mt: 4 }}>All Shortened URLs</Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && stats.length === 0 && (
          <Typography>No shortened URLs found.</Typography>
        )}
        {!loading && !error && stats.length > 0 && (
          <Grid container spacing={2}>
            {stats.map((item, idx) => (
              <Grid item xs={12} key={idx}>
                <Paper sx={{ p: 2, my: 1 }}>
                  <Typography><b>Short URL:</b> <a href={item.shortLink} target="_blank" rel="noopener noreferrer">{item.shortLink}</a></Typography>
                  <Typography><b>Original URL:</b> {item.originalUrl}</Typography>
                  <Typography><b>Shortcode:</b> {item.shortcode}</Typography>
                  <Typography><b>Created At:</b> {item.createdAt}</Typography>
                  <Typography><b>Expiry:</b> {item.expiry}</Typography>
                  <Typography><b>Total Clicks:</b> {item.totalClicks}</Typography>
                  {item.clicks && item.clicks.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2">Click Details:</Typography>
                      <ul>
                        {item.clicks.map((click, cidx) => (
                          <li key={cidx}>
                            {click.timestamp} | Referrer: {click.referrer || 'N/A'} | Location: {click.location || 'N/A'}
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

export default UrlStatisticsPage; 