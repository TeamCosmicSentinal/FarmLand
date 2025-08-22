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
    <div className="bg-card rounded-2xl shadow-md p-6 sm:p-8 border border-primary/10 text-text hover:shadow-lg transition-all duration-300 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <span className="inline-flex items-center justify-center bg-gold text-olive rounded-full w-12 h-12 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25v19.5m9.75-9.75H2.25" />
          </svg>
        </span>
        <h2 className="text-2xl font-heading font-bold text-olive tracking-tight">Crop Recommendation</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-background-alt p-5 rounded-xl border border-primary/5 shadow-sm mb-6">
        <div>
          <div className="font-heading font-semibold mb-3 text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Choose Soil Type:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
            {soilTypes.map((type, idx) => (
              <div className="flex flex-col items-center" key={type.name}>
                <button
                  type="button"
                  className={`group aspect-square w-full h-full p-0 border-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent overflow-hidden transform hover:scale-105 ${form.soil === type.name ? (idx % 2 === 0 ? 'border-gold' : 'border-primary') : 'border-transparent'}`}
                  onClick={() => setForm({ ...form, soil: type.name })}
                  style={{ background: 'none' }}
                >
                  <img src={type.img} alt={type.name + ' soil'} className="w-full h-full object-cover" />
                </button>
                <span className="mt-2 text-sm font-medium text-olive text-center">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <select 
            className="w-full border border-primary/10 bg-offwhite text-text rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-accent focus:border-accent/50 outline-none transition-all duration-200 shadow-sm appearance-none" 
            required 
            value={form.season} 
            onChange={e => setForm({ ...form, season: e.target.value })}
          >
            <option value="">Select Season</option>
            {seasons.map(season => <option key={season} value={season}>{season}</option>)}
          </select>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input 
            className="w-full border border-primary/10 bg-offwhite text-text rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-accent focus:border-accent/50 outline-none transition-all duration-200 shadow-sm" 
            placeholder="Enter Location (optional)" 
            value={form.location} 
            onChange={e => setForm({ ...form, location: e.target.value })} 
          />
        </div>
        
        <button 
          className="btn btn-green font-heading text-lg rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-100 flex items-center justify-center gap-2 mt-2" 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Get Recommendation</span>
            </>
          )}
        </button>
      </form>
      
      {loading && (
        <div className="mt-8 text-center animate-fade-in">
          <div className="bg-background-alt rounded-xl p-6 sm:p-8 border border-primary/10 shadow-md">
            <div className="flex items-center justify-center mb-5">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">🌱</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-heading font-semibold text-primary mb-3">
              Finding the best crops for your field...
            </h3>
            <p className="text-text mb-5 animate-pulse">
              {loadingQuotes[quoteIdx]}
            </p>
            <div className="text-sm text-text-muted bg-background p-3 rounded-lg border border-primary/5">
              <p className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This may take 10-20 seconds as we consult expert AI and databases
              </p>
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                The right crop can change your season!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 bg-error-light text-error rounded-lg p-4 border border-error/20 animate-fade-in">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {parsedTable && (
        <div className="mt-8 overflow-x-auto animate-fade-in">
          {selectedSoil && (
            <div className={`flex flex-col items-center mb-6 ${soilTypes.findIndex(type => type.name === selectedSoil.name) % 2 === 0 ? 'feature-gold' : 'feature-green'} p-5 rounded-xl shadow-md`}>
              <img 
                src={selectedSoil.img} 
                alt={selectedSoil.name + ' soil'} 
                className="w-32 h-32 object-cover rounded-xl border-2 border-primary/20 shadow-md mb-3" 
              />
              <span className="text-lg font-heading font-bold text-primary">{selectedSoil.name} Soil</span>
            </div>
          )}
          
          <div className="rounded-xl overflow-hidden shadow-lg border border-primary/10">
            <table className="min-w-full border-collapse bg-card">
              <thead>
                <tr>
                  {parsedTable.header.map((h, i) => (
                    <th key={i} className="px-6 py-4 bg-primary text-white text-lg font-bold uppercase tracking-wide text-center">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedTable.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-background-alt' : 'bg-card'}>
                    {row.map((cell, j) => (
                      <td key={j} className={`px-6 py-4 border-t border-primary/10 text-center ${j === 0 ? 'font-bold text-primary text-lg' : 'text-text'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default CropRecommendationForm;
