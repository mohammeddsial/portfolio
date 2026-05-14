async function fetchJobsFromSources() {
  const allJobs = [];
  for (const source of JOB_SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(source.url, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      const jobs = (Array.isArray(data) ? data : data.jobs || data.data || [])
        .map(source.transform)
        .filter(job => job.title && job.company);
      allJobs.push(...jobs);
    } catch (err) {
      console.error(`Failed to fetch ${source.name}:`, err.message);
    }
  }
  const seen = new Set();
  return allJobs.filter(job => {
    if (!job.url || seen.has(job.url)) return false;
    seen.add(job.url);
    return true;
  });
}