import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import Icon from '../components/Icon.jsx';

export default function Checkout() {
  const [status, setStatus] = useState('form'); // form | processing | success
  const [form, setForm] = useState({ name: '', email: '', card: '', exp: '', cvc: '' });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.email) { alert('Please enter your email.'); return; }
    setStatus('processing');
    setTimeout(() => {
      // Record the purchase (mock). Connect Stripe here for real payments.
      try { localStorage.setItem('kwg_purchased', JSON.stringify({ email: form.email, amount: 9, at: Date.now() })); } catch {}
      setStatus('success');
    }, 1600);
  };

  return (
    <AppShell>
      <h1 style={{ marginTop: 0, fontSize: 28 }}>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24, alignItems: 'start' }} className="co-grid">
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '.05em', color: 'var(--indigo-600)' }}>STARTER OFFER</div>
          <h2 style={{ margin: '6px 0', fontSize: 40 }}>$9</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: 14 }}>One-time payment • Instant access</p>
          <ul className="price-list">
            {['Kids Printable Generator', 'Activity Creation Tools', 'Puzzle & Educational Activities', 'Book Builder', 'Export Tools', '500 credits'].map((x) => (
              <li key={x}><Icon name="check" size={18} style={{ color: 'var(--emerald-500)' }} /> {x}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: 30 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
                <Icon name="check" size={32} />
              </div>
              <h2 style={{ margin: '0 0 8px' }}>You're in! 🎉</h2>
              <p style={{ color: 'var(--slate-500)', margin: '0 auto 24px', maxWidth: 420 }}>
                Your Kids Worksheets Generator access is ready. You can start creating printables and
                activity books right away.
              </p>
              <Link to="/create" className="btn btn-primary btn-lg"><Icon name="sparkles" size={18} /> Start Creating</Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3 style={{ marginTop: 0 }}>Billing details</h3>
              <div className="field"><label>Full name</label><input type="text" value={form.name} onChange={set('name')} placeholder="Jane Doe" /></div>
              <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /></div>
              <div className="field"><label>Card number</label><input type="text" inputMode="numeric" value={form.card} onChange={set('card')} placeholder="4242 4242 4242 4242" /></div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="field" style={{ flex: 1 }}><label>Expiry</label><input type="text" value={form.exp} onChange={set('exp')} placeholder="MM/YY" /></div>
                <div className="field" style={{ flex: 1 }}><label>CVC</label><input type="text" value={form.cvc} onChange={set('cvc')} placeholder="123" /></div>
              </div>
              <button className="btn btn-primary btn-lg btn-block" disabled={status === 'processing'}>
                {status === 'processing' ? 'Processing…' : <>Pay $9 — Get Instant Access →</>}
              </button>
              <p style={{ textAlign: 'center', color: 'var(--slate-400)', fontSize: 12, marginTop: 12 }}>
                Secure checkout • Start creating right away
              </p>
              <div style={{ background: 'var(--slate-50)', borderRadius: 10, padding: 12, fontSize: 12.5, color: 'var(--slate-500)' }}>
                <b>Demo mode:</b> This checkout simulates a purchase. Connect a payment provider (e.g.
                Stripe or Lemon Squeezy) to accept real payments. No card is charged.
              </div>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}
