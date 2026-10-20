// Public anonymous API key, as used by PlayApp; never a service-role key.
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0d3l3Z3BidHRucXhpaGx4aHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjA4NzAsImV4cCI6MjA5NDEzNjg3MH0.bQXeRdgnsYEStJwc_EuhHMx1pQpSKesfk_JHsHe3FVs';
const endpoint = 'https://atwywgpbttnqxihlxhqj.supabase.co/functions/v1/score-sync';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const matchId = location.hash.slice(1);
const form = document.querySelector('form');
const button = document.querySelector('#submit');
const error = document.querySelector('#error');
const fields = ['easeOfUse', 'scoreboardReadability', 'improvedPlayingExperience', 'useScoredAgain', 'improvement'];
const storageKey = `scored-feedback:${matchId}`;
let sending = false;
function read(key) { try { return localStorage.getItem(key); } catch { return null; } }
function store(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage may be unavailable in private browsing. */ } }
let installId = read('scored-feedback-browser');
if (!uuid.test(installId || '')) { installId = crypto.randomUUID(); store('scored-feedback-browser', installId); }
let draft;
try { draft = JSON.parse(read(storageKey)); } catch { /* Ignore corrupt local drafts. */ }
if (!draft || !uuid.test(draft.requestId || '')) draft = { requestId: crypto.randomUUID(), answers: {} };
function showThanks() {
  document.querySelector('#survey').hidden = true;
  const thanks = document.querySelector('#thanks');
  thanks.hidden = false;
  thanks.focus();
}
if (!uuid.test(matchId)) {
  form.hidden = true;
  document.querySelector('#match-note').textContent = 'Scan the QR code shown on the scoreboard after your match to leave feedback for that match.';
} else if (draft.submitted) {
  showThanks();
} else {
  for (const name of fields) {
    const value = draft.answers?.[name];
    if (typeof value === 'string') form.elements.namedItem(name).value = value;
  }
}
function answers() { return Object.fromEntries(new FormData(form)); }
form.addEventListener('input', () => {
  if (sending) return;
  draft = { requestId: crypto.randomUUID(), answers: answers() };
  store(storageKey, JSON.stringify(draft));
  error.textContent = '';
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending || !uuid.test(matchId) || !form.reportValidity()) return;
  const values = answers();
  draft.answers = values;
  store(storageKey, JSON.stringify(draft));
  sending = true;
  error.textContent = '';
  for (const control of form.elements) control.disabled = true;
  button.textContent = 'Sending…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({ action: 'submit_feedback', installId, matchId,
        requestId: draft.requestId,
        easeOfUse: Number(values.easeOfUse), scoreboardReadability: Number(values.scoreboardReadability),
        improvedPlayingExperience: values.improvedPlayingExperience, useScoredAgain: values.useScoredAgain,
        improvement: values.improvement.trim() }),
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Feedback was not accepted');
    // Keep the receipt, but remove the saved answers from this browser after success.
    store(storageKey, JSON.stringify({ requestId: draft.requestId, submitted: true }));
    showThanks();
  } catch {
    error.textContent = 'We couldn’t send your feedback. Your answers are still here—please try again.';
  } finally {
    clearTimeout(timeout);
    sending = false;
    for (const control of form.elements) control.disabled = false;
    button.textContent = 'Submit feedback';
  }
});
