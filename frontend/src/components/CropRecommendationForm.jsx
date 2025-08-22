import React, { useState } from 'react';
import { recommendCrop } from '../api/api';

const soilTypes = [
  { name: 'Sandy', img: 'https://static.vecteezy.com/system/resources/thumbnails/009/977/736/small/wet-sand-background-texture-photo.jpg' },
  { name: 'Clay', img: 'https://www.gardendesign.com/pictures/images/900x705Max/dream-team-s-portland-garden_6/dry-clay-soil-clay-soil-shutterstock-com_18182.jpg' },
  { name: 'Silty', img: 'https://media.istockphoto.com/id/135180443/photo/soil.jpg?s=612x612&w=0&k=20&c=DIBzjfkSe1PJv_uzPRfBgxvsDxe25cLia-pMFyn-Qm0=' },
  { name: 'Peaty', img: 'https://www.boughton.co.uk/wp-content/uploads/sites/14/2019/07/Peat-Soil.jpg' },
  { name: 'Chalky', img: 'https://media.istockphoto.com/id/1225735654/photo/chalk-mining-limestone-quarry.jpg?s=612x612&w=0&k=20&c=gUMq0oWoIKJ-pZPpGWso_EE4MOoVirGRYzbOfPMxbEw=' },
  { name: 'Loamy', img: 'https://plantcaretoday.com/wp-content/uploads/garden-loam-good.jpg' }
];
const seasons = ['Summer', 'Autumn', 'Winter', 'Spring', 'Monsoon'];
const loadingQuotes = [
  "Good crops come from good choices. Fetching the best options for you...",
  "Patience is the key to a bountiful harvest. Gathering expert recommendations...",
  "The right crop for the right season makes all the difference!",
  "Soil and season are the roots of success. Finding your best match..."
];

function parseMarkdownTable(md) {
  if (!md) return null;
  const lines = md.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return null;
  // Parse header
  const header = lines[0].replace(/^\|/, '').replace(/\|$/, '').split('|').map(h => h.trim());
  // Skip alignment row(s)
  let rowStart = 1;
  while (rowStart < lines.length && /^\|?\s*:?[-]+/.test(lines[rowStart])) rowStart++;
  const rows = lines.slice(rowStart).map(line =>
    line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim())
  ).filter(row => row.length === header.length);
  return { header, rows };
}

function CropRecommendationForm() {
  const [form, setForm] = useState({ soil: '', season: '', location: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    setQuoteIdx(Math.floor(Math.random() * loadingQuotes.length));
    try {
      const res = await recommendCrop({ ...form, user_id: 'guest' });
      setResult(res.data);
    } catch (err) {
      setError('Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  const parsedTable = result && result.table ? parseMarkdownTable(result.table) : null;
  const selectedSoil = soilTypes.find(type => type.name === form.soil);

  return (
    <div className="bg-offwhite rounded-2xl shadow-card p-8 border border-hemlock transition-transform hover:scale-[1.02] max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center bg-gold text-black rounded-full w-10 h-10 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25v19.5m9.75-9.75H2.25" />
          </svg>
        </span>
        <h2 className="text-2xl font-heading font-bold text-olive tracking-tight">Crop Recommendation</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="font-heading font-semibold mb-2 text-leaf">Choose Soil Type:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
            {soilTypes.map((type, idx) => (
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  key={type.name}
                  className={`group aspect-square w-full h-full p-0 border-2 rounded-xl transition shadow-card hover:shadow-lg focus:outline-none overflow-hidden ${form.soil === type.name ? (idx % 2 === 0 ? 'border-gold' : 'border-softgreen') : 'border-transparent'}`}
                  onClick={() => setForm({ ...form, soil: type.name })}
                  style={{ background: 'none' }}
                >
                  <img src={type.img} alt={type.name + ' soil'} className="w-full h-full object-cover" />
                </button>
                <span className="mt-1 text-xs font-medium text-olive text-center">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
        <select className="border border-hemlock bg-offwhite text-black rounded-lg p-2 focus:ring-2 focus:ring-leaf outline-none transition" required value={form.season} onChange={e => setForm({ ...form, season: e.target.value })}>
          <option value="">Season</option>
          {seasons.map(season => <option key={season} value={season}>{season}</option>)}
        </select>
        <input className="border border-hemlock bg-offwhite text-black rounded-lg p-2 focus:ring-2 focus:ring-leaf outline-none transition" placeholder="Enter Location (optional)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <button className="btn btn-green font-heading text-lg rounded-xl shadow-card transition-all duration-200 hover:scale-105 active:scale-100" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Get Recommendation'}</button>
      </form>
      {loading && (
        <div className="mt-8 text-center">
          <div className="bg-sky rounded-xl p-8 border border-hemlock">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-hemlock border-t-leaf rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-heading font-semibold text-olive mb-2">
              Finding the best crops for your field...
            </h3>
            <p className="text-black mb-4 animate-pulse">
              {loadingQuotes[quoteIdx]}
            </p>
            <div className="text-sm text-black">
              <p>⏱️ This may take 10-20 seconds as we consult expert AI and databases</p>
              <p>🌾 The right crop can change your season!</p>
            </div>
          </div>
        </div>
      )}
      {error && <div className="mt-3 text-red-500 bg-offwhite rounded p-2 border border-red-600 animate-pulse">{error}</div>}
      {parsedTable && (
        <div className="mt-6 overflow-x-auto">
          {selectedSoil && (
            <div className={`flex flex-col items-center mb-4 ${soilTypes.findIndex(type => type.name === selectedSoil.name) % 2 === 0 ? 'feature-gold' : 'feature-green'} p-4 rounded-xl`}>
              <img src={selectedSoil.img} alt={selectedSoil.name + ' soil'} className="w-32 h-32 object-cover rounded-xl border-2 border-leaf shadow mb-2" />
              <span className="text-lg font-heading font-bold text-leaf">{selectedSoil.name} Soil</span>
            </div>
          )}
          <table className="min-w-full border-collapse bg-white rounded-2xl shadow-2xl border border-hemlock">
            <thead>
              <tr>
                {parsedTable.header.map((h, i) => (
                  <th key={i} className="px-6 py-3 bg-leaf text-offwhite text-lg font-extrabold uppercase tracking-wide border-b-2 border-hemlock text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedTable.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'feature-gold' : 'feature-green'}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-6 py-3 border-b border-hemlock text-center ${j === 0 ? 'font-bold text-olive text-lg' : 'text-black'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default CropRecommendationForm;
