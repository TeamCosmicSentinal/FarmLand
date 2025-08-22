import React from 'react';
import CropPricesForm from './CropPricesForm';

const CropPricesPage = () => {
  return (
    <section className="bg-sky text-olive py-12 px-4 md:px-8 rounded-2xl shadow-card min-h-[60vh]">
      <div className="max-w-6xl mx-auto pt-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2 flex items-center justify-center gap-2">
            <span className="text-gold">🌾</span> Crop Prices
          </h1>
          <div className="divider mx-auto w-1/2" />
          <p className="text-lg text-black max-w-2xl mx-auto font-sans">
            Get the latest mandi prices for crops in your area. Stay informed about market rates 
            to make better selling decisions and maximize your profits.
          </p>
        </div>
        <CropPricesForm />
      </div>
    </section>
  );
};

export default CropPricesPage; 