import React, { useEffect, useState } from 'react';
import { addMarketplaceListing, getMarketplaceListings, deleteMarketplaceListing } from '../api/api';

export default function MarketplacePage() {
  const [form, setForm] = useState({
    crop_name: '',
    quantity: '',
    price: '',
    location: '',
    contact: '',
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadListings = async () => {
    try {
      setError(null);
      const res = await getMarketplaceListings();
      setListings(res.data || []);
    } catch (e) {
      setError('Failed to load listings');
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      await addMarketplaceListing(payload);
      setForm({ crop_name: '', quantity: '', price: '', location: '', contact: '' });
      await loadListings();
    } catch (e) {
      setError('Failed to add listing. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteMarketplaceListing(id);
      await loadListings();
    } catch (e) {
      alert('Delete failed');
    }
  };

  return (
    <section className="bg-gradient-to-br from-sky via-background to-sky-light text-olive rounded-2xl shadow-lg min-h-[40vh]">
      <div className="w-full max-w-6xl mx-auto pt-4 pb-6 px-4 md:px-8">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3 mb-3">
            <span className="bg-gold/30 text-primary p-2 rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
              <span role="img" aria-label="market" className="text-2xl">🛒</span>
            </span>
            <span className="bg-gradient-to-r from-primary to-leaf bg-clip-text text-transparent">Crop Marketplace</span>
          </h2>
          <p className="text-olive/80 ml-16 max-w-2xl">Buy and sell agricultural products directly from farmers. Add your listing or browse available crops below.</p>
        </div>
        <div className="divider" />

        <form onSubmit={onSubmit} className="card bg-background-alt p-6 rounded-2xl border border-primary/20 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 shadow-lg">
          <div className="md:col-span-2 mb-2">
            <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
              <span className="bg-accent text-white p-1 rounded-full w-7 h-7 flex items-center justify-center">+</span>
              Add New Listing
            </h3>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-olive text-sm font-semibold flex items-center gap-1">
              <span className="text-accent">🌾</span> Crop Name
            </label>
            <input
              className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200"
              placeholder="e.g., Wheat"
              name="crop_name"
              value={form.crop_name}
              onChange={onChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-olive text-sm font-semibold flex items-center gap-1">
              <span className="text-accent">⚖️</span> Quantity
            </label>
            <input
              className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200"
              placeholder="e.g., 500 kg"
              name="quantity"
              value={form.quantity}
              onChange={onChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-olive text-sm font-semibold flex items-center gap-1">
              <span className="text-accent">₹</span> Price (INR per unit)
            </label>
            <input
              className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200"
              placeholder="e.g., 2400"
              name="price"
              type="number"
              step="any"
              value={form.price}
              onChange={onChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-olive text-sm font-semibold flex items-center gap-1">
              <span className="text-accent">📍</span> Location
            </label>
            <input
              className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200"
              placeholder="e.g., Pune"
              name="location"
              value={form.location}
              onChange={onChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-olive text-sm font-semibold flex items-center gap-1">
              <span className="text-accent">📞</span> Contact Details
            </label>
            <input
              className="px-3 py-2 rounded-lg border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-200"
              placeholder="Phone or email"
              name="contact"
              value={form.contact}
              onChange={onChange}
              required
            />
          </div>
          <button
            className="btn btn-green w-full md:w-auto md:col-span-2 flex items-center justify-center gap-2 mt-2 hover:scale-105 transition-transform duration-200"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <span>Add Listing</span>
                <span className="text-white">+</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="text-red-700 bg-error-light rounded-lg p-4 border border-error/30 mb-6 flex items-center gap-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <h3 className="text-2xl font-heading font-bold text-primary mb-4 flex items-center gap-2">
          <span className="text-gold">📋</span> Available Listings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(item => {
            // Generate a consistent color based on crop name
            const colors = ['bg-softgreen/20', 'bg-gold/20', 'bg-sky/40', 'bg-background-alt'];
            const colorIndex = item.crop_name.length % colors.length;
            const cardColor = colors[colorIndex];
            
            return (
              <div key={item.id} className={`relative overflow-hidden ${cardColor} border border-primary/10 p-6 rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="bg-accent text-white text-xs font-bold px-4 py-1 rotate-45 transform origin-bottom-right translate-y-7 shadow-sm">CROP</div>
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-heading font-bold text-primary">{item.crop_name}</h3>
                </div>
                
                <div className="text-sm text-olive space-y-3 mb-4">
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
                    <span className="text-accent">⚖️</span>
                    <span className="font-semibold">Quantity:</span>
                    <span className="ml-auto font-medium">{item.quantity}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
                    <span className="text-accent">₹</span>
                    <span className="font-semibold">Price:</span>
                    <span className="ml-auto font-medium text-lg text-primary">₹{item.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
                    <span className="text-accent">📍</span>
                    <span className="font-semibold">Location:</span>
                    <span className="ml-auto font-medium">{item.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-accent">📞</span>
                    <span className="font-semibold">Contact:</span>
                    <span className="ml-auto font-medium truncate max-w-[160px]">{item.contact}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-primary/10">
                  <span className="text-[11px] text-olive/70 whitespace-nowrap">{new Date(item.created_at).toLocaleString()}</span>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="btn bg-white/80 border-primary/30 text-olive hover:bg-error/10 hover:text-error flex items-center gap-1"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          
          {listings.length === 0 && (
            <div className="col-span-full text-center py-12 bg-background-alt rounded-2xl border border-primary/10 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-olive/80 text-lg font-heading">No listings yet. Be the first to add!</p>
              <p className="text-olive/60 mt-2">Use the form above to create a new listing.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}