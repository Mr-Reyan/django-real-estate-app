import React, { useState } from 'react';
import { Search, MapPin,Building2, DollarSign, Home } from 'lucide-react'

const PropertySearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState({
    title: '',
    country: 'Pakistan',
    maxPrice: '',
    type: 'residential'
  })


  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 md:p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Keyword Search */}
          <div className="relative w-full grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5" />
            <input
              name="title"
              type="text"
              placeholder="Search Title..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-gray-700"
              onChange={handleChange}
            />
          </div>

          {/* Location Select */}
          <div className="relative w-full md:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5" />
            <select
              name="country"
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-gray-50 focus:ring-2 focus:ring-blue-500 appearance-none outline-none text-gray-700 cursor-pointer"
              onChange={handleChange}
            >
              <option value="pakistan">Pakistan</option>
              <option value="india">India</option>
              <option value="uae">UAE</option>
            </select>
          </div>


          <div className="relative md:col-span-2">
            <select
              name="type"
              className="w-full px-4 py-4 rounded-2xl border-none bg-gray-50 focus:ring-2 focus:ring-blue-500 appearance-none outline-none text-gray-700 cursor-pointer"
              onChange={handleChange}
            >
              <option value="residential">Residential</option>
              <option value="industrial">Industrial</option>
              <option value="agricultural">Agricultural</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Price Input */}
          <div className="relative w-full md:w-48">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5" />
            <input
              name="maxPrice"
              type="number"
              placeholder="Max Price"
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
              onChange={handleChange}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => onSearch(query)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            Search
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default PropertySearchBar;