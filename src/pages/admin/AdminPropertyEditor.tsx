import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, MapPin, Building2, Tag, 
  DollarSign, Activity, Image as ImageIcon, Home,
  Loader2, X, Plus, User, ShieldAlert, BarChart3,
  Calendar, School, Wind, Bed, Bath, Hash, Layers, 
  Wifi, Zap, Thermometer, ShieldCheck, CheckCircle2,
  Clock, Info, Key, CreditCard, Droplets
} from 'lucide-react';
import { supabase, uploadImage } from '../../lib/supabase';
import type { Property } from '../../data/properties';
import { toast } from 'sonner';
import CustomDropdown from '../../components/ui/CustomDropdown';

const AdminPropertyEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  const [step, setStep] = useState(id ? 'FORM' : 'SELECTION');
  
  const [form, setForm] = useState<Partial<Property>>({
    title: '',
    slug: '',
    category: 'RESIDENTIAL',
    status: 'FOR_SALE',
    price: 0,
    currency: 'USD',
    description: '',
    bedrooms: 0,
    bathrooms: 0,
    totalArea: 0,
    address: '',
    city: '',
    neighborhood: '',
    country: '',
    primaryImage: '',
    internalAmenities: '',
    externalAmenities: '',
    tags: '',
    isVerified: false,
    rating: 4.5,
    reviewsCount: 0,
    // Advanced
    pricePerSqft: 0,
    estimatedROI: 0,
    rentalYield: 0,
    serviceCharges: 0,
    propertyTax: 0,
    hoaFees: 0,
    mortgageEstimate: 0,
    tenure: 'FREEHOLD',
    securityDeposit: 0,
    leaseDuration: '',
    utilitiesIncluded: false,
    petsAllowed: true,
    furnishingStatus: 'UNFURNISHED',
    availableDate: '',
    floorLevel: 1,
    totalFloors: 1,
    parkingSpaces: 0,
    viewType: '',
    energyRating: 'A',
    internetType: 'Fiber',
    coolingSystem: 'Central AC',
    heatingSystem: 'Electric',
    maintenanceFee: 0,
    neighborhoodSafety: 9,
    walkScore: 85,
    transitScore: 80,
    floodRisk: 1,
    fireRisk: 1,
    heatRisk: 1,
    airQuality: 90,
    ownerName: '',
    ownerTitle: 'Property Owner',
    ownerType: 'INDIVIDUAL',
    exteriorGallery: [],
    livingGallery: [],
    kitchenGallery: []
  });

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) setForm(data);
    } catch (err: any) {
      toast.error('Failed to load property: ' + err.message);
      navigate('/admin/properties');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadImage(file);
      handleChange('primaryImage', url);
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.price) {
      toast.error('Title and Price are required');
      return;
    }

    try {
      setLoading(true);
      const propertyData = {
        ...form,
        slug: form.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        updated_at: new Date().toISOString()
      };

      if (id) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);
        if (error) throw error;
        toast.success('Property updated successfully');
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);
        if (error) throw error;
        toast.success('Property published successfully');
      }
      navigate('/admin/properties');
    } catch (err: any) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  if (step === 'SELECTION' && !id) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 py-12 font-poppins">
        <div className="text-center">
          <h1 className="text-[32px] font-bold text-black mb-2">What are you listing today?</h1>
          <p className="text-black/60 text-[16px]">Choose the primary purpose of your new property listing.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={() => { handleChange('status', 'FOR_SALE'); setStep('FORM'); }}
            className="group bg-white p-10 rounded-2xl border border-gray-200 text-left transition-all hover:border-indigo-600 hover:ring-4 hover:ring-indigo-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Tag size={28} />
            </div>
            <h2 className="text-[20px] font-bold text-black mb-2">For Sale</h2>
            <p className="text-black/60 text-[14px]">Best for villas, townhouses, penthouses, or commercial lands available for purchase.</p>
          </button>

          <button 
            onClick={() => { handleChange('status', 'FOR_RENT'); setStep('FORM'); }}
            className="group bg-white p-10 rounded-2xl border border-gray-200 text-left transition-all hover:border-indigo-600 hover:ring-4 hover:ring-indigo-50"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Key size={28} />
            </div>
            <h2 className="text-[20px] font-bold text-black mb-2">For Rent</h2>
            <p className="text-black/60 text-[14px]">Best for apartments, short-term stays, or lease-based commercial spaces.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-poppins pb-24 animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-black hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[20px] font-bold text-black">
              {id ? 'Edit Property' : 'New Listing'}
            </h1>
            <p className="text-[12px] text-black/60 font-medium">Drafting: {form.title || 'Untitled'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="px-5 h-10 rounded-lg bg-white border border-gray-200 text-[13px] font-bold text-black hover:bg-gray-50 transition-all"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-6 h-10 rounded-lg bg-indigo-600 text-white text-[13px] font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {id ? 'Update Listing' : 'Publish Property'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-8 space-y-6">
          <SectionCard title="Primary Information" icon={<Building2 size={16} />}>
            <div className="space-y-6">
              <Field label="Property Title" required>
                <input value={form.title} onChange={e => handleChange('title', e.target.value)} className="modern-input" placeholder="e.g. Skyline Luxury Penthouse" />
              </Field>
              <Field label="Description" required>
                <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="modern-input min-h-[140px] py-3 resize-none" placeholder="Provide a detailed overview..." />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Category">
                  <CustomDropdown value={form.category || 'RESIDENTIAL'} onChange={val => handleChange('category', val)} options={[
                    { label: 'Residential', value: 'RESIDENTIAL' }, { label: 'Commercial', value: 'COMMERCIAL' },
                    { label: 'Luxury', value: 'LUXURY' }, { label: 'Vacation', value: 'VACATION' },
                  ]} />
                </Field>
                <Field label="Listing Status">
                  <CustomDropdown value={form.status || 'FOR_SALE'} onChange={val => handleChange('status', val)} options={[
                    { label: 'For Sale', value: 'FOR_SALE' }, { label: 'For Rent', value: 'FOR_RENT' },
                  ]} />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Location & Access" icon={<MapPin size={16} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="City" required><input value={form.city} onChange={e => handleChange('city', e.target.value)} className="modern-input" placeholder="e.g. Dubai" /></Field>
              <Field label="Neighborhood" required><input value={form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)} className="modern-input" placeholder="e.g. Downtown" /></Field>
              <div className="md:col-span-2">
                <Field label="Full Address" required><input value={form.address} onChange={e => handleChange('address', e.target.value)} className="modern-input" placeholder="e.g. Sheikh Zayed Road, Suite 402" /></Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Key Specifications" icon={<Activity size={16} />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="Beds" icon={<Bed size={12} />}><input type="number" value={form.bedrooms} onChange={e => handleChange('bedrooms', Number(e.target.value))} className="modern-input text-center" /></Field>
              <Field label="Baths" icon={<Bath size={12} />}><input type="number" value={form.bathrooms} onChange={e => handleChange('bathrooms', Number(e.target.value))} className="modern-input text-center" /></Field>
              <Field label="Sq Ft" icon={<Hash size={12} />}><input type="number" value={form.totalArea} onChange={e => handleChange('totalArea', Number(e.target.value))} className="modern-input text-center" /></Field>
              <Field label="Year" icon={<Calendar size={12} />}><input type="number" value={form.yearBuilt} onChange={e => handleChange('yearBuilt', Number(e.target.value))} className="modern-input text-center" /></Field>
            </div>
          </SectionCard>
        </div>

        {/* Right Column - Media & Pricing */}
        <div className="lg:col-span-4 space-y-6">
          <SectionCard title="Pricing & Value" icon={<DollarSign size={16} />}>
            <div className="space-y-6">
              <Field label="Market Price" required>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-black">$</span>
                  <input type="number" value={form.price} onChange={e => handleChange('price', Number(e.target.value))} className="modern-input pl-8" placeholder="0.00" />
                </div>
              </Field>
              <Field label="Currency">
                <CustomDropdown value={form.currency || 'USD'} onChange={val => handleChange('currency', val)} options={[
                  { label: 'USD ($)', value: 'USD' }, { label: 'EUR (€)', value: 'EUR' }, { label: 'AED (د.إ)', value: 'AED' },
                ]} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Featured Media" icon={<ImageIcon size={16} />}>
            <div className="space-y-4">
              {form.primaryImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={form.primaryImage} alt="" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleChange('primaryImage', '')}
                    className="absolute top-2 right-2 w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center mb-2 shadow-sm">
                    <Plus size={20} className="text-black" />
                  </div>
                  <span className="text-[11px] font-bold text-black uppercase tracking-widest">Upload Cover</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
              <p className="text-[10px] text-black/40 font-medium text-center">Recommended size: 1920x1080 (JPG, PNG)</p>
            </div>
          </SectionCard>
        </div>
      </div>
      
      {/* Internal Classes for the modern inputs */}
      <style>{`
        .modern-input {
          width: 100%;
          height: 40px;
          padding: 0 16px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 13px;
          color: black;
          transition: all 0.2s;
        }
        .modern-input:focus {
          outline: none;
          border-color: #4F46E5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.05);
        }
        .modern-input::placeholder {
          color: #9CA3AF;
        }
      `}</style>
    </div>
  );
};

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
      <div className="text-black">{icon}</div>
      <h3 className="text-[14px] font-bold text-black">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field: React.FC<{ label: string; required?: boolean; icon?: React.ReactNode; children: React.ReactNode }> = ({ label, required, icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-widest ml-1">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export default AdminPropertyEditor;
