import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, MapPin, Building2, Tag, 
  DollarSign, Activity, Image as ImageIcon, Home
} from 'lucide-react';
import { properties } from '../../data/properties';
import type { Property } from '../../data/properties';
import { toast } from 'sonner';

const defaultProperty: Partial<Property> = {
  title: '',
  slug: '',
  category: 'RESIDENTIAL',
  status: 'FOR_SALE',
  price: 0,
  currency: 'USD',
  bedrooms: 0,
  bathrooms: 0,
  totalArea: 0,
  address: '',
  city: '',
  neighborhood: '',
  country: '',
  primaryImage: '',
  imageGallery: '',
  description: '',
  internalAmenities: '',
  externalAmenities: '',
  tags: '',
  isVerified: false,
  rating: 0,
  reviewsCount: 0,
};

const AdminPropertyEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Property>>(defaultProperty);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const existing = properties.find(p => p.id === id);
      if (existing) {
        setForm({ ...existing });
      } else {
        toast.error('Property not found');
        navigate('/admin/properties');
      }
    }
    setIsLoading(false);
  }, [id, navigate]);

  const handleChange = (field: keyof Property, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // In a real app, send data to backend here.
    toast.success(id ? 'Property updated successfully!' : 'Property created successfully!');
    navigate('/admin/properties');
  };

  if (isLoading) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#1A1A1A]">
              {id ? 'Edit Property' : 'Create New Property'}
            </h1>
            <p className="text-[13px] text-gray-400 mt-0.5">
              {id ? form.title : 'Fill in the details below'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="px-5 h-10 rounded-full border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-white transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            className="px-6 h-10 rounded-full bg-brand hover:bg-brand-dark text-white text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_4px_12px_rgba(255,77,0,0.2)] hover:shadow-[0_4px_16px_rgba(255,77,0,0.3)] hover:-translate-y-0.5"
          >
            <Save size={16} />
            Save Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Details) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Info */}
          <SectionCard icon={<Building2 size={18} />} title="Basic Information">
            <div className="space-y-4">
              <Field label="Property Title">
                <input 
                  value={form.title} 
                  onChange={e => handleChange('title', e.target.value)} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all" 
                  placeholder="e.g. Modern Downtown Loft"
                />
              </Field>
              <Field label="Description">
                <textarea 
                  value={form.description} 
                  onChange={e => handleChange('description', e.target.value)} 
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[13px] text-[#1A1A1A] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all resize-none" 
                  placeholder="Detailed description of the property..."
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select 
                    value={form.category} 
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="LUXURY">Luxury</option>
                    <option value="VACATION">Vacation</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select 
                    value={form.status} 
                    onChange={e => handleChange('status', e.target.value)}
                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none"
                  >
                    <option value="FOR_SALE">For Sale</option>
                    <option value="FOR_RENT">For Rent</option>
                    <option value="OFF_PLAN">Off Plan</option>
                  </select>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Pricing & Financials */}
          <SectionCard icon={<DollarSign size={18} />} title="Pricing & Financials">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price">
                <input 
                  type="number"
                  value={form.price} 
                  onChange={e => handleChange('price', Number(e.target.value))} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                />
              </Field>
              <Field label="Currency">
                <select 
                  value={form.currency} 
                  onChange={e => handleChange('currency', e.target.value)}
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </Field>
              <Field label="Estimated ROI (%)">
                <input 
                  type="number"
                  value={form.estimatedROI || ''} 
                  onChange={e => handleChange('estimatedROI', Number(e.target.value))} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                  placeholder="e.g. 5.5"
                />
              </Field>
              <Field label="Rental Yield (%)">
                <input 
                  type="number"
                  value={form.rentalYield || ''} 
                  onChange={e => handleChange('rentalYield', Number(e.target.value))} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                  placeholder="e.g. 4.2"
                />
              </Field>
              <Field label="Property Tax (Annual)">
                <input 
                  type="number"
                  value={form.propertyTax || ''} 
                  onChange={e => handleChange('propertyTax', Number(e.target.value))} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                />
              </Field>
              <Field label="Service Charges (Annual)">
                <input 
                  type="number"
                  value={form.serviceCharges || ''} 
                  onChange={e => handleChange('serviceCharges', Number(e.target.value))} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                />
              </Field>
            </div>
          </SectionCard>

          {/* Location Details */}
          <SectionCard icon={<MapPin size={18} />} title="Location Details">
            <div className="space-y-4">
              <Field label="Street Address">
                <input 
                  value={form.address} 
                  onChange={e => handleChange('address', e.target.value)} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="City">
                  <input 
                    value={form.city} 
                    onChange={e => handleChange('city', e.target.value)} 
                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                  />
                </Field>
                <Field label="Neighborhood">
                  <input 
                    value={form.neighborhood} 
                    onChange={e => handleChange('neighborhood', e.target.value)} 
                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                  />
                </Field>
                <Field label="Country">
                  <input 
                    value={form.country} 
                    onChange={e => handleChange('country', e.target.value)} 
                    className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Specs & Amenities */}
          <SectionCard icon={<Home size={18} />} title="Specifications & Amenities">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Field label="Bedrooms">
                <input 
                  type="number"
                  value={form.bedrooms} 
                  onChange={e => handleChange('bedrooms', Number(e.target.value))} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                />
              </Field>
              <Field label="Bathrooms">
                <input 
                  type="number"
                  value={form.bathrooms} 
                  onChange={e => handleChange('bathrooms', Number(e.target.value))} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                />
              </Field>
              <Field label="Area (Sqft)">
                <input 
                  type="number"
                  value={form.totalArea} 
                  onChange={e => handleChange('totalArea', Number(e.target.value))} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                />
              </Field>
            </div>
            <div className="space-y-4">
              <Field label="Internal Amenities (Comma separated)">
                <textarea 
                  value={form.internalAmenities} 
                  onChange={e => handleChange('internalAmenities', e.target.value)} 
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[13px] text-[#1A1A1A] outline-none resize-none" 
                  placeholder="e.g. Smart Home, Floor-to-ceiling windows"
                />
              </Field>
              <Field label="External Amenities (Comma separated)">
                <textarea 
                  value={form.externalAmenities} 
                  onChange={e => handleChange('externalAmenities', e.target.value)} 
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[13px] text-[#1A1A1A] outline-none resize-none" 
                  placeholder="e.g. Infinity Pool, Gym, Concierge"
                />
              </Field>
            </div>
          </SectionCard>

        </div>

        {/* Right Column (Sidebar Items) */}
        <div className="space-y-6">
          
          {/* Status Panel */}
          <SectionCard icon={<Activity size={18} />} title="Platform Status">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-[13px] font-bold text-[#1A1A1A]">Verified Listing</p>
                <p className="text-[11px] text-gray-400">Display verified badge</p>
              </div>
              <button
                onClick={() => handleChange('isVerified', !form.isVerified)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ${form.isVerified ? 'bg-brand' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${form.isVerified ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="mt-4">
               <Field label="Tags (Comma separated)">
                <input 
                  value={form.tags} 
                  onChange={e => handleChange('tags', e.target.value)} 
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none" 
                  placeholder="e.g. Featured, Hot Deal"
                />
              </Field>
            </div>
          </SectionCard>

          {/* Media & Images */}
          <SectionCard icon={<ImageIcon size={18} />} title="Media & Images">
            <Field label="Primary Image URL">
              <input 
                value={form.primaryImage} 
                onChange={e => handleChange('primaryImage', e.target.value)} 
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-[13px] text-[#1A1A1A] outline-none mb-3" 
                placeholder="https://..."
              />
            </Field>
            {form.primaryImage && (
              <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-200">
                <img src={form.primaryImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <Field label="Image Gallery URLs (Comma separated)">
              <textarea 
                value={form.imageGallery} 
                onChange={e => handleChange('imageGallery', e.target.value)} 
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[13px] text-[#1A1A1A] outline-none resize-none" 
                placeholder="https://image1.jpg, https://image2.jpg"
              />
            </Field>
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

/* tiny reusable field wrapper */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
    {children}
  </div>
);

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
      <div className="text-gray-400">{icon}</div>
      <h2 className="text-[14px] font-bold text-[#1A1A1A]">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

export default AdminPropertyEditor;
