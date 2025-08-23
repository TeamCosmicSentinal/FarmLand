import React, { useEffect, useState } from 'react';
import { getMarketplaceListings, suVerifyCrop, suDeleteCrop, suListEquipmentRequests, suVerifyEquipment, suDeleteEquipment } from '../api/api';
import { useAuth } from './AuthContext';

export default function SuperuserDashboard() {
  const { user } = useAuth();
  const isSuperuser = (user?.role === 'superuser');
  const [crops, setCrops] = useState([]);
  const [eqReqs, setEqReqs] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const [lc, le] = await Promise.all([
        getMarketplaceListings(),
        isSuperuser ? suListEquipmentRequests() : Promise.resolve({ data: [] })
      ]);
      setCrops(lc.data || []);
      setEqReqs(le.data || []);
    } catch (e) {
      setError('Failed to load data');
    }
  };

  useEffect(() => { load(); }, []);

  if (!isSuperuser) {
    return (
      <div className="bg-error-light border border-error/30 text-error p-4 rounded-xl">Forbidden: Superuser only.</div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-sky via-background to-sky-light text-olive rounded-2xl shadow-lg">
      <div className="w-full max-w-6xl mx-auto pt-4 pb-8 px-4 md:px-8">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3 mb-2">
            <span className="bg-gold/30 text-primary p-2 rounded-full w-12 h-12 flex items-center justify-center shadow-sm">🛡️</span>
            <span className="bg-gradient-to-r from-primary to-leaf bg-clip-text text-transparent">Superuser Dashboard</span>
          </h2>
          <p className="text-olive/80 ml-16 max-w-2xl">Approve or delete farmer uploads and equipment verification requests.</p>
        </div>
        <div className="divider" />

        {error && <div className="text-red-700 bg-error-light rounded-lg p-4 border border-error/30 mb-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background-alt p-4 rounded-2xl border border-primary/20 shadow">
            <h3 className="text-xl font-heading font-bold text-primary mb-3">Crops</h3>
            <div className="space-y-3">
              {crops.map(c => (
                <div key={c.id} className="p-3 bg-white/70 rounded-xl border border-primary/10 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-primary">{c.crop_name}</div>
                    <div className="text-xs text-olive/70">{c.location} • ₹{c.price} • {c.quantity}</div>
                    {c.verified_by_superuser ? <div className="text-green-700 text-xs mt-1">🛡️ Verified by AgriGuru</div> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    {!c.verified_by_superuser && (
                      <button onClick={async() => { try { await suVerifyCrop(c.id); await load(); } catch {} }} className="btn btn-green">Verify</button>
                    )}
                    <button onClick={async() => { if (confirm('Delete this listing?')) { try { await suDeleteCrop(c.id); await load(); } catch {} } }} className="btn bg-error/10 text-error">Delete</button>
                  </div>
                </div>
              ))}
              {crops.length === 0 && <div className="text-olive/70 text-sm">No crops found.</div>}
            </div>
          </div>

          <div className="bg-background-alt p-4 rounded-2xl border border-primary/20 shadow">
            <h3 className="text-xl font-heading font-bold text-primary mb-3">Equipment Requests</h3>
            <div className="space-y-3">
              {eqReqs.map(e => (
                <div key={e.id} className="p-3 bg-white/70 rounded-xl border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-primary">{e.equipment_name || e.equipment_id || 'Unnamed'}</div>
                      <div className="text-xs text-olive/70">{e.brand} • {e.origin}</div>
                      <div className="text-xs text-olive/60">{e.compliance_info}</div>
                      {e.verified_by_superuser ? <div className="text-green-700 text-xs mt-1">🛡️ Verified by AgriGuru</div> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {!e.verified_by_superuser && (
                        <button onClick={async() => { try { await suVerifyEquipment(e.id); await load(); } catch {} }} className="btn btn-green">Verify</button>
                      )}
                      <button onClick={async() => { if (confirm('Delete this request?')) { try { await suDeleteEquipment(e.id); await load(); } catch {} } }} className="btn bg-error/10 text-error">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {eqReqs.length === 0 && <div className="text-olive/70 text-sm">No equipment requests found.</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}