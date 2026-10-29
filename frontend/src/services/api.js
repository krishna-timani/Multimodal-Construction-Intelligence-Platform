const API_BASE = '/api/v1';

export const api = {
  async getHealth() {
    try {
      const res = await fetch('/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (e) {
      return { status: 'offline', llm_connected: false, error: e.message };
    }
  },

  async analyzeSafety(formData) {
    const res = await fetch(`${API_BASE}/safety/analyze`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Safety analysis failed: ${res.statusText}`);
    return await res.json();
  },

  async analyzeCrack(formData) {
    const res = await fetch(`${API_BASE}/crack/analyze`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Crack analysis failed: ${res.statusText}`);
    return await res.json();
  },

  async generateBOQ(payload) {
    const res = await fetch(`${API_BASE}/estimation/boq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`BOQ estimation failed: ${res.statusText}`);
    return await res.json();
  },

  async generateSchedule(payload) {
    const res = await fetch(`${API_BASE}/planning/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Schedule generation failed: ${res.statusText}`);
    return await res.json();
  },

  async evaluateValuation(formData) {
    const res = await fetch(`${API_BASE}/valuation/evaluate`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Property valuation failed: ${res.statusText}`);
    return await res.json();
  },

  async submitDailyLog(formData) {
    const res = await fetch(`${API_BASE}/site/daily-log`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Daily log submission failed: ${res.statusText}`);
    return await res.json();
  },

  async getWeatherAdvisory(payload) {
    const res = await fetch(`${API_BASE}/weather/advisory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Weather advisory failed: ${res.statusText}`);
    return await res.json();
  },

  async queryKnowledge(payload) {
    const res = await fetch(`${API_BASE}/knowledge/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Knowledge query failed: ${res.statusText}`);
    return await res.json();
  },
};

