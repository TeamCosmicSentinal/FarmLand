import React, { useEffect, useState } from 'react';

function SchemesExplorer() {
  const [state, setState] = useState('All');
  const allSchemes = [
  // Pan-India
  { name: 'PM-KISAN', summary: 'Direct income support to all small & marginal farmers.', state: 'All', url: 'https://pmkisan.gov.in/' },
  { name: 'Soil Health Card', summary: 'Soil health cards for farmers to promote balanced fertilization.', state: 'All', url: 'https://soilhealth.dac.gov.in/' },
  { name: 'PM Fasal Bima Yojana', summary: 'Crop insurance scheme for risk mitigation.', state: 'All', url: 'https://pmfby.gov.in/' },
  { name: 'PM Krishi Sinchai Yojana', summary: 'Irrigation and water-saving scheme.', state: 'All', url: 'https://pmksy.gov.in/' },
  { name: 'e-NAM', summary: 'National Agriculture Market for transparent agri-trade.', state: 'All', url: 'https://enam.gov.in/web/' },
  { name: 'Kisan Credit Card', summary: 'Timely credit to farmers for inputs and requirements.', state: 'All', url: 'https://pmkisan.gov.in/Documents/KCC.pdf' },
  { name: 'Rashtriya Krishi Vikas Yojana', summary: 'Boosts agricultural growth.', state: 'All', url: 'https://rkvy.nic.in/' },
  { name: 'National Food Security Mission', summary: 'Increase production of rice, wheat, pulses, etc.', state: 'All', url: 'https://nfsm.gov.in/' },
  { name: 'Sub-Mission on Agricultural Mechanization', summary: 'Promotes farm mechanization.', state: 'All', url: 'https://farmech.dac.gov.in/' },
  { name: 'Paramparagat Krishi Vikas Yojana', summary: 'Promotes organic farming.', state: 'All', url: 'https://pgsindia-ncof.gov.in/pkvy/' },
  // State-specific
  { name: 'KALIA', summary: 'Comprehensive assistance for cultivators in Odisha.', state: 'Odisha', url: 'https://kalia.odisha.gov.in/' },
  { name: 'Rythu Bandhu', summary: 'Investment support for farmers in Telangana.', state: 'Telangana', url: 'https://treasury.telangana.gov.in/rythubandhu/' },
  { name: 'Mukhya Mantri Krishi Ashirwad', summary: 'Direct benefit transfer for Jharkhand farmers.', state: 'Jharkhand', url: 'https://mmkay.jharkhand.gov.in/' },
  { name: 'Krishi Yantra Subsidy', summary: 'Subsidy on farm machinery in Maharashtra.', state: 'Maharashtra', url: 'https://mahadbtmahait.gov.in/' },
  { name: 'YSR Rythu Bharosa', summary: 'Income support for Andhra Pradesh farmers.', state: 'Andhra Pradesh', url: 'https://ysrrythubharosa.ap.gov.in/' },
  { name: 'Bhoochetana', summary: 'Soil health and productivity in Karnataka.', state: 'Karnataka', url: 'https://raitamitra.karnataka.gov.in/' },
  { name: 'Samriddhi Yojana', summary: 'Agricultural development in Bihar.', state: 'Bihar', url: 'https://dbtagriculture.bihar.gov.in/' },
  { name: 'Mukhya Mantri Krishi Saathi Yojana', summary: 'Support for West Bengal farmers.', state: 'West Bengal', url: 'https://matirkatha.net/' },
  { name: 'Krishak Bandhu', summary: 'Income and insurance for West Bengal farmers.', state: 'West Bengal', url: 'https://krishakbandhu.net/' },
  { name: 'Zero Budget Natural Farming', summary: 'Natural farming in Andhra Pradesh.', state: 'Andhra Pradesh', url: 'https://apzbnf.in/' },
  { name: 'Pardhan Mantri Krishi Samman Nidhi', summary: 'Direct benefit transfer for farmers in Assam.', state: 'Assam', url: 'https://diragri.assam.gov.in/' },
  { name: 'Mukhyamantri Krishi Udyog Yojana', summary: 'Entrepreneurship in agriculture in Chhattisgarh.', state: 'Chhattisgarh', url: 'https://agriportal.cg.nic.in/' }
];
const states = [
  'All', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];
  const schemes = state === 'All' ? allSchemes : allSchemes.filter(s => s.state === state || s.state === 'All');

  return (
    <div className="space-y-8">
      <div className="card bg-card border border-primary/20 rounded-2xl shadow-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-heading font-bold text-olive flex items-center gap-2">
            <span role="img" aria-label="schemes">🏛️</span> Active Farmer Schemes
          </h2>
          <div>
            <label className="mr-2 font-medium text-leaf">Search by State:</label>
            <select className="border border-hemlock bg-offwhite text-black rounded-lg p-2 focus:ring-2 focus:ring-leaf outline-none transition" value={state} onChange={e => setState(e.target.value)}>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {schemes.map((scheme, i) => (
            <div key={i} className={`${i % 2 === 0 ? 'feature-gold' : 'feature-green'} border border-hemlock rounded-xl p-4 shadow-card hover:scale-[1.03] transition group text-black`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌱</span>
                <span className="text-lg font-heading font-bold text-olive">{scheme.name}</span>
                <span className="ml-auto text-xs bg-gold text-black rounded px-2 py-0.5">{scheme.state}</span>
              </div>
              <div className="text-black mb-2 font-sans">{scheme.summary}</div>
              <a href={scheme.url} target="_blank" rel="noopener noreferrer" className="btn btn-green font-heading rounded shadow-card px-4 py-2 mt-2 inline-block transition-all duration-200 hover:scale-105 active:scale-100">Apply / Learn More →</a>
            </div>
          ))}
        </div>
      </div>
      <div className="card bg-card border border-primary/20 rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-heading font-bold text-leaf mb-2 flex items-center gap-2">
          <span role="img" aria-label="links">🔗</span> Important Government Links
        </h3>
        <div className="flex flex-wrap gap-3">
          <a href="https://pmkisan.gov.in/" className="btn btn-gold font-heading" target="_blank" rel="noopener noreferrer">PM-KISAN Portal</a>
          <a href="https://agriwelfare.gov.in/" className="btn btn-green font-heading" target="_blank" rel="noopener noreferrer">Farmer's Welfare</a>
          <a href="https://www.india.gov.in/farmers-portal" className="btn btn-gold font-heading" target="_blank" rel="noopener noreferrer">Farmer Portal</a>
          <a href="https://dbtagriculture.bihar.gov.in/" className="btn btn-green font-heading" target="_blank" rel="noopener noreferrer">DBT Agriculture</a>
          <a href="https://enam.gov.in/web/" className="btn btn-gold font-heading" target="_blank" rel="noopener noreferrer">e-NAM</a>
          <a href="https://pmfby.gov.in/" className="btn btn-green font-heading" target="_blank" rel="noopener noreferrer">PM Fasal Bima Yojana</a>
        </div>
      </div>
    </div>
  );
}
export default SchemesExplorer;
