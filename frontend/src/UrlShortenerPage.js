import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const MAX_URLS = 5;

const emptyUrlEntry = { url: '', validity: '', shortcode: '' };

function UrlShortenerPage() {
  const [urlEntries, setUrlEntries] = useState([
    { ...emptyUrlEntry }
  ]);
  const [results, setResults] = useState([]);   
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allUrls, setAllUrls] = useState([]);
  const [allLoading, setAllLoading] = useState(true);
  const [allError, setAllError] = useState('');
  const [selectedStats, setSelectedStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const fetchAllUrls = async () => {
      setAllLoading(true);
      setAllError('');
      try {
        const res = await fetch('http://localhost:8081/shorturls');
        if (!res.ok) throw new Error('Failed to fetch URLs');
        const data = await res.json();
        setAllUrls(data);
      } catch (err) {
        setAllError('Could not load URLs.');
      } finally {
        setAllLoading(false);
      }
    };
    fetchAllUrls();
  }, []);

  const handleChange = (idx, field, value) => {
    const newEntries = urlEntries.map((entry, i) =>
      i === idx ? { ...entry, [field]: value } : entry
    );
    setUrlEntries(newEntries);
  };

  const addEntry = () => {
    if (urlEntries.length < MAX_URLS) {
      setUrlEntries([...urlEntries, { ...emptyUrlEntry }]);
    }
  };

  const removeEntry = (idx) => {
    setUrlEntries(urlEntries.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const responses = await Promise.all(
        urlEntries.map(async (entry) => {
          if (!entry.url) return null;
          const payload = {
            url: entry.url,
            ...(entry.validity && { validity: parseInt(entry.validity) }),
            ...(entry.shortcode && { shortcode: entry.shortcode })
          };
          const res = await fetch('http://localhost:8081/shorturls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error('Failed to shorten URL');
          const data = await res.json();
          return { ...data, originalUrl: entry.url };
        })
      );
      setResults(responses.filter(Boolean));
      // Refresh all URLs after successful creation
      setAllLoading(true);
      try {
        const res = await fetch('http://localhost:8081/shorturls');
        if (res.ok) {
          const data = await res.json();
          setAllUrls(data);
        }
      } catch {}
      setAllLoading(false);
    } catch (err) {
      setError('Failed to shorten one or more URLs. Please check your input and backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', minHeight: '100vh', bgcolor: '#f9f9f9', py: { xs: 2, md: 4 } }}>
      <Paper sx={{ p: { xs: 1, sm: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          URL Shortener
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {urlEntries.map((entry, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Long URL"
                    value={entry.url}
                    onChange={e => handleChange(idx, 'url', e.target.value)}
                    required
                    fullWidth
                    type="url"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Validity (min)"
                    value={entry.validity}
                    onChange={e => handleChange(idx, 'validity', e.target.value.replace(/[^0-9]/g, ''))}
                    fullWidth
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 1 }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Shortcode"
                    value={entry.shortcode}
                    onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-end', md: 'center' } }}>
                  {urlEntries.length > 1 && (
                    <Button color="error" onClick={() => removeEntry(idx)} size="small">-</Button>
                  )}
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={addEntry}
                disabled={urlEntries.length >= MAX_URLS}
                sx={{ mr: 2 }}
                size="small"
              >
                Add URL
              </Button>
              <Button type="submit" variant="contained" disabled={loading} size="small">
                {loading ? 'Shortening...' : 'Shorten URLs'}
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Shortened URLs</Typography>
            {results.map((res, idx) => (
              <Paper key={idx} sx={{ p: 2, my: 1 }}>
                <Typography>Original: {res.originalUrl}</Typography>
                <Typography>Short Link: <a href={res.shortLink} target="_blank" rel="noopener noreferrer">{res.shortLink}</a></Typography>
                <Typography>Expiry: {res.expiry}</Typography>
              </Paper>
            ))}
          </Box>
        )}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>All Shortened URLs</Typography>
          {allLoading && <CircularProgress />}
          {allError && <Typography color="error">{allError}</Typography>}
          {!allLoading && !allError && allUrls.length === 0 && (
            <Typography>No shortened URLs found.</Typography>
          )}
          {!allLoading && !allError && allUrls.length > 0 && (
            <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Shortcode</TableCell>
                    <TableCell>Short URL</TableCell>
                    <TableCell>Original URL</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Expiry</TableCell>
                    <TableCell>Total Clicks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allUrls.map((item, idx) => {
                    const createdAt = new Date(item.createdAt).toLocaleString();
                    const expiry = new Date(item.expiry).toLocaleString();
                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <a href={`http://localhost:8081/shorturls/${item.shortcode}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}>
                            {item.shortcode}
                          </a>
                        </TableCell>
                        <TableCell>
                          <a href={`http://localhost:8081/shorturls/${item.shortcode}`} target="_blank" rel="noopener noreferrer">
                            {`http://localhost:8081/shorturls/${item.shortcode}`}
                          </a>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <a href={item.originalUrl} target="_blank" rel="noopener noreferrer">
                            {item.originalUrl}
                          </a>
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>{createdAt}</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>{expiry}</TableCell>
                        <TableCell>{item.totalClicks}</TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined" onClick={async () => {
                            setStatsLoading(true);
                            setStatsError('');
                            setSelectedStats(null);
                            try {
                              const res = await fetch(`http://localhost:8081/shorturls/${item.shortcode}`);
                              if (!res.ok) throw new Error('Failed to fetch stats');
                              const data = await res.json();
                              setSelectedStats({ ...data, shortcode: item.shortcode });
                            } catch (err) {
                              setStatsError('Could not load statistics.');
                            } finally {
                              setStatsLoading(false);
                            }
                          }}>Stats</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        {(statsLoading || statsError || selectedStats) && (
          <Box sx={{ mt: 4 }}>
            {statsLoading && <CircularProgress />}
            {statsError && <Typography color="error">{statsError}</Typography>}
            {selectedStats && !statsLoading && !statsError && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6">Statistics for <b>{selectedStats.shortcode}</b></Typography>
                <Typography><b>Original URL:</b> {selectedStats.originalUrl}</Typography>
                <Typography><b>Short URL:</b> <a href={`http://localhost:8081/shorturls/${selectedStats.shortcode}`} target="_blank" rel="noopener noreferrer">{`http://localhost:8081/shorturls/${selectedStats.shortcode}`}</a></Typography>
                <Typography><b>Created At:</b> {new Date(selectedStats.createdAt).toLocaleString()}</Typography>
                <Typography><b>Expiry:</b> {new Date(selectedStats.expiry).toLocaleString()}</Typography>
                <Typography><b>Total Clicks:</b> {selectedStats.totalClicks}</Typography>
                {selectedStats.clicks && selectedStats.clicks.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Click Details:</Typography>
                    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto', mt: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Referrer</TableCell>
                            <TableCell>Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedStats.clicks.map((click, cidx) => (
                            <TableRow key={cidx}>
                              <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                              <TableCell>{click.referrer || 'N/A'}</TableCell>
                              <TableCell>{click.location || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Paper>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default UrlShortenerPage;