import React, { useState } from 'react';
import { verifyCertification, reportSuspiciousProduct } from '../api/api';
import QrScannerInline from './QrScannerInline';

function mapStatus(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('likely certified') || s === 'certified') {
    return { label: 'Certified', icon: '✅', pillClass: 'bg-green-100 text-green-800 border-green-300', textClass: 'text-green-700', barClass: 'bg-green-500' };
  }
  if (s.includes('likely not certified') || s.includes('not certified')) {
    return { label: 'Not Certified', icon: '⚠️', pillClass: 'bg-red-100 text-red-800 border-red-300', textClass: 'text-red-700', barClass: 'bg-red-500' };
  }
  return { label: 'Unverified', icon: 'ℹ️', pillClass: 'bg-gray-100 text-gray-700 border-gray-300', textClass: 'text-gray-700', barClass: 'bg-olive/50' };
}

function StatusBadge({ status }) {
  const ui = mapStatus(status);
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border ${ui.pillClass}`}>
      {ui.icon} {ui.label}
    </span>
  );
}

export default function CertificationPage() {
  const [form, setForm] = useState({ equipment_id: '', equipment_name: '', brand: '', origin: '', compliance_info: '' });
  const [extraJson, setExtraJson] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState({ reason: '', details: '' });
  const [reportMsg, setReportMsg] = useState('');
  const [scanMode, setScanMode] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      let extra = undefined;
      if (extraJson.trim()) {
        try { extra = JSON.parse(extraJson); } catch (e) { throw new Error('Extra must be valid JSON'); }
      }
      const res = await verifyCertification({ ...form, extra });
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const onReport = async (e) => {
    e.preventDefault();
    setReportMsg('');
    try {
      await reportSuspiciousProduct({ product_id: form.equipment_id, crop_name: form.equipment_name, reason: report.reason, details: report.details });
      setReportMsg('Report submitted. Thank you!');
      setReport({ reason: '', details: '' });
    } catch (e) {
      setReportMsg('Failed to submit report');
    }
  };

  const onScan = (decoded) => {
    setForm(prev => ({ ...prev, equipment_id: decoded }));
    setScanMode(false);
  };

  return (
    <section className="bg-gradient-to-br from-sky via-background to-sky-light text-olive rounded-2xl shadow-lg">
      <div className="w-full max-w-5xl mx-auto pt-4 pb-8 px-4 md:px-8">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3 mb-2">
            <span className="bg-gold/30 text-primary p-2 rounded-full w-12 h-12 flex items-center justify-center shadow-sm">🔎</span>
            <span className="bg-gradient-to-r from-primary to-leaf bg-clip-text text-transparent">Certification Verification</span>
          </h2>
          <p className="text-olive/80 ml-16 max-w-2xl">Enter Equipment ID or equipment details. We’ll ask Gemini to estimate certification status and show an explanation based on safety and industry standards.</p>
        </div>
        <div className="divider" />

        <form onSubmit={onVerify} className="card bg-background-alt p-6 rounded-2xl border border-primary/20 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shadow-lg">
          <div className="md:col-span-2 flex items-center justify-between">
            <h3 className="text-xl font-heading font-bold text-primary">Check Equipment</h3>
            <button type="button" onClick={() => setScanMode(s => !s)} className="btn btn-green">
              {scanMode ? 'Close Scanner' : 'Scan QR'}
            </button>
          </div>
          {scanMode && (
            <div className="md:col-span-2">
              <QrScannerInline onResult={onScan} />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-olive font-semibold">Equipment ID (QR/Serial)</label>
            <input name="equipment_id" value={form.equipment_id} onChange={onChange} placeholder="e.g., EQP-QR-12345" className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-olive font-semibold">Equipment Name</label>
            <input name="equipment_name" value={form.equipment_name} onChange={onChange} placeholder="e.g., Mini Rotary Tiller" className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-olive font-semibold">Brand</label>
            <input name="brand" value={form.brand} onChange={onChange} placeholder="e.g., FarmFresh" className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-olive font-semibold">Origin/Location</label>
            <input name="origin" value={form.origin} onChange={onChange} placeholder="e.g., Nashik, MH" className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-olive font-semibold">Compliance / Marks Observed</label>
            <input name="compliance_info" value={form.compliance_info} onChange={onChange} placeholder="e.g., ISI/BIS mark, CE, ISO 9001" className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="text-sm text-olive font-semibold">Extra (JSON)</label>
            <textarea value={extraJson} onChange={(e) => setExtraJson(e.target.value)} rows={3} placeholder='{"dealer":"Authorized dealer invoice","safety":"PTO guard present"}' className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"></textarea>
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <button type="submit" disabled={loading} className="btn btn-green">{loading ? 'Verifying...' : 'Verify'}</button>
          </div>
        </form>

        {error && (
          <div className="text-red-700 bg-error-light rounded-lg p-4 border border-error/30 mb-6">{error}</div>
        )}

        {result && (() => {
          const ui = mapStatus(result.status);
          const percent = typeof result.confidence === 'number' ? Math.round(result.confidence * 100) : null;
          return (
            <div className="bg-white/80 border border-primary/10 rounded-2xl p-6 shadow-card mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-2xl font-heading font-bold flex items-center gap-2">
                    <span className={`${ui.textClass}`}>{ui.icon}</span>
                    <span className={`${ui.textClass}`}>{ui.label}</span>
                  </h4>
                  {percent !== null && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm text-olive/70 mb-1">
                        <span>Confidence</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-2 w-full bg-olive/10 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full transition-all duration-500 ${ui.barClass}`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                <StatusBadge status={result.status} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-green-100 text-green-800 border-green-300">
                  🛡️ Verified Analysis
                </span>
                {percent !== null && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-gold/20 text-primary border-gold/40">
                    📊 Confidence: {percent}%
                  </span>
                )}
                {form.brand && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-background-alt text-olive border-primary/20">
                    🏷️ Brand: {form.brand}
                  </span>
                )}
                {form.origin && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-background-alt text-olive border-primary/20">
                    📍 Origin: {form.origin}
                  </span>
                )}
                {form.compliance_info && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-background-alt text-olive border-primary/20">
                    ✅ Compliance: {form.compliance_info}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background-alt/60 border border-primary/10 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-olive mb-2">Summary</h5>
                  {(() => {
                    const raw = String(result.explanation || '').trim();
                    let summaryText = raw;
                    try {
                      // Strip code fences if present and parse JSON
                      let jsonText = raw;
                      if (/```/m.test(raw)) {
                        jsonText = raw.replace(/^([\s\S]*?)```(?:json)?/i, '')
                                       .replace(/```[\s\S]*$/i, '')
                                       .trim();
                      }
                      if (jsonText.startsWith('{') && jsonText.endsWith('}')) {
                        const obj = JSON.parse(jsonText);
                        if (obj && typeof obj === 'object') {
                          if (obj.explanation) summaryText = String(obj.explanation);
                          else summaryText = Object.entries(obj).map(([k, v]) => `${k}: ${String(v)}`).join('; ');
                        }
                      }
                    } catch (e) {
                      // Fallback to raw text
                    }
                    return <p className="text-olive/90 leading-relaxed"><span className="font-medium">{summaryText}</span></p>;
                  })()}
                </div>
                <div className="bg-background-alt/60 border border-primary/10 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-olive mb-2">Details Provided</h5>
                  <ul className="text-sm text-olive/90 space-y-1">
                    <li><span className="font-medium">Equipment ID:</span> {result.equipment_id || '—'}</li>
                    <li><span className="font-medium">Name:</span> {result.equipment_name || '—'}</li>
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="bg-background-alt p-6 rounded-2xl border border-primary/20 shadow-lg mb-8">
          <h3 className="text-xl font-heading font-bold text-primary mb-2">Why Certification Matters?</h3>
          <ul className="list-disc pl-5 text-olive/90 space-y-1">
            <li>Certified products follow safety and quality standards.</li>
            <li>Helps avoid counterfeit or adulterated products.</li>
            <li>Supports fair pricing and transparency.</li>
          </ul>
        </div>

        <div className="bg-background-alt p-6 rounded-2xl border border-primary/20 shadow-lg">
          <h3 className="text-xl font-heading font-bold text-primary mb-2">Report Suspicious Product</h3>
          <form onSubmit={onReport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm text-olive font-semibold">Reason</label>
              <input value={report.reason} onChange={(e) => setReport({ ...report, reason: e.target.value })} placeholder="e.g., Packaging looks fake" className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none" />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm text-olive font-semibold">Details</label>
              <textarea rows={3} value={report.details} onChange={(e) => setReport({ ...report, details: e.target.value })} placeholder="Describe what you found suspicious" className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"></textarea>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <button type="submit" className="btn btn-gold">Submit Report</button>
              {reportMsg && <span className="text-olive/80 text-sm">{reportMsg}</span>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}