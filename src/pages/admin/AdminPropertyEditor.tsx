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
      toast.error('Error fetching property: ' + err.message);
      navigate('/admin/properties');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (field: keyof Property, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Property, isArray: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadImage(file);
      
      if (isArray) {
        const current = (form[field] as string[]) || [];
        handleChange(field, [...current, url]);
      } else {
        handleChange(field, url);
      }
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeGalleryImage = (field: keyof Property, index: number) => {
    const current = (form[field] as string[]) || [];
    handleChange(field, current.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error('Property title is required');
      return;
    }

    try {
      setLoading(true);
      const slug = form.slug || form.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const payload = {
        ...form,
        slug,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('properties').upsert(payload);
      if (error) throw error;

      toast.success(id ? 'Property updated successfully!' : 'Property published successfully!');
      navigate('/admin/properties');
    } catch (err: any) {
      toast.error('Error saving property: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  // Selection Step
  if (step === 'SELECTION') {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 px-6 text-center animate-in zoom-in-95 duration-500">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">What type of listing is this?</h1>
        <p className="text-gray-500 mb-12">Select your listing type to see specialized fields.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={() => { handleChange('status', 'FOR_SALE'); setStep('FORM'); }}
            className="group p-10 bg-white border-2 border-gray-100 rounded-[40px] hover:border-brand transition-all text-left"
          >
            <div className="w-16 h-16 rounded-3xl bg-brand/5 text-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <DollarSign size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">For Sale</h2>
            <p className="text-gray-500 text-[14px]">Best for residential, commercial or luxury properties ready for ownership transfer.</p>
          </button>
          
          <button 
            onClick={() => { handleChange('status', 'FOR_RENT'); setStep('FORM'); }}
            className="group p-10 bg-white border-2 border-gray-100 rounded-[40px] hover:border-brand transition-all text-left"
          >
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">For Rent</h2>
            <p className="text-gray-500 text-[14px]">Best for apartments, short-term stays, or lease-based commercial spaces.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="w-10 h-10 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-bold text-[#1A1A1A] tracking-tight">
                {id ? 'Edit Listing' : 'Create Listing'}
              </h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                form.status === 'FOR_SALE' ? 'bg-brand/10 text-brand' : 'bg-blue-50 text-blue-600'
              }`}>
                {form.status === 'FOR_SALE' ? 'Selling' : 'Rental'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="px-6 h-11 rounded-xl bg-white border border-gray-300 text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-7 h-11 rounded-xl bg-[#1A1A1A] text-white text-[13px] font-bold flex items-center gap-3 hover:bg-brand transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {id ? 'Save Changes' : 'Publish Property'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SECTION */}
        <div className="lg:col-span-8 space-y-6">
          
          <SectionCard title="General Info" icon={<Building2 size={16} />}>
            <div className="space-y-6">
              <Field label="Property Title" required>
                <input value={form.title} onChange={e => handleChange('title', e.target.value)} className="input-modern" placeholder="e.g. Skyline Luxury Penthouse" />
              </Field>
              <Field label="Quick Summary (Top/Sidebar)" required>
                <textarea value={form.quickDescription} onChange={e => handleChange('quickDescription', e.target.value)} className="input-modern min-h-[80px] py-3 resize-none" placeholder="A short 1-2 sentence hook for the top section..." />
              </Field>
              <Field label="Full Detailed Narrative" required>
                <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="input-modern min-h-[140px] py-3 resize-none" placeholder="Provide a detailed story about this property..." />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Category">
                  <div className="border border-gray-300 rounded-xl bg-white">
                    <CustomDropdown value={form.category || 'RESIDENTIAL'} onChange={val => handleChange('category', val)} options={[
                      { label: 'Residential', value: 'RESIDENTIAL' }, { label: 'Commercial', value: 'COMMERCIAL' },
                      { label: 'Luxury', value: 'LUXURY' }, { label: 'Vacation', value: 'VACATION' },
                    ]} />
                  </div>
                </Field>
                <Field label="Listing Type">
                  <div className="border border-gray-300 rounded-xl bg-white">
                    <CustomDropdown value={form.status || 'FOR_SALE'} onChange={val => handleChange('status', val)} options={[
                      { label: 'For Sale', value: 'FOR_SALE' }, { label: 'For Rent', value: 'FOR_RENT' },
                    ]} />
                  </div>
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Advanced Technical Specs" icon={<Activity size={16} />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="Beds" icon={<Bed size={12} />}><input type="number" value={form.bedrooms} onChange={e => handleChange('bedrooms', Number(e.target.value))} className="input-modern text-center" /></Field>
              <Field label="Baths" icon={<Bath size={12} />}><input type="number" value={form.bathrooms} onChange={e => handleChange('bathrooms', Number(e.target.value))} className="input-modern text-center" /></Field>
              <Field label="Sq Ft" icon={<Hash size={12} />}><input type="number" value={form.totalArea} onChange={e => handleChange('totalArea', Number(e.target.value))} className="input-modern text-center" /></Field>
              <Field label="Year" icon={<Calendar size={12} />}><input type="number" value={form.yearBuilt} onChange={e => handleChange('yearBuilt', Number(e.target.value))} className="input-modern text-center" /></Field>
              
              <Field label="Floor Level" icon={<Layers size={12} />}><input type="number" value={form.floorLevel} onChange={e => handleChange('floorLevel', Number(e.target.value))} className="input-modern text-center" /></Field>
              <Field label="Total Floors" icon={<Layers size={12} />}><input type="number" value={form.totalFloors} onChange={e => handleChange('totalFloors', Number(e.target.value))} className="input-modern text-center" /></Field>
              <Field label="Parking" icon={<Hash size={12} />}><input type="number" value={form.parkingSpaces} onChange={e => handleChange('parkingSpaces', Number(e.target.value))} className="input-modern text-center" /></Field>
              <Field label="Energy Rating" icon={<Zap size={12} />}><input value={form.energyRating} onChange={e => handleChange('energyRating', e.target.value)} className="input-modern text-center" placeholder="A+" /></Field>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <Field label="Internet Type" icon={<Wifi size={12} />}><input value={form.internetType} onChange={e => handleChange('internetType', e.target.value)} className="input-modern" placeholder="e.g. Fiber Optic" /></Field>
              <Field label="Cooling" icon={<Zap size={12} />}><input value={form.coolingSystem} onChange={e => handleChange('coolingSystem', e.target.value)} className="input-modern" placeholder="e.g. Central AC" /></Field>
              <Field label="Heating" icon={<Thermometer size={12} />}><input value={form.heatingSystem} onChange={e => handleChange('heatingSystem', e.target.value)} className="input-modern" placeholder="e.g. Electric" /></Field>
            </div>
          </SectionCard>

          <SectionCard title="Visuals & Amenities" icon={<ImageIcon size={16} />}>
            <div className="space-y-10">
              <GalleryGrid title="Main Cover" images={form.primaryImage ? [form.primaryImage] : []} onUpload={e => handleFileUpload(e, 'primaryImage')} onRemove={() => handleChange('primaryImage', '')} loading={loading} isSingle />
              <div className="space-y-8">
                <GalleryGrid title="Exterior" images={form.exteriorGallery || []} onUpload={e => handleFileUpload(e, 'exteriorGallery', true)} onRemove={idx => removeGalleryImage('exteriorGallery', idx)} loading={loading} />
                <GalleryGrid title="Living Area" images={form.livingGallery || []} onUpload={e => handleFileUpload(e, 'livingGallery', true)} onRemove={idx => removeGalleryImage('livingGallery', idx)} loading={loading} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <Field label="Internal Amenities"><textarea value={form.internalAmenities} onChange={e => handleChange('internalAmenities', e.target.value)} className="input-modern min-h-[100px] py-3 text-[12px]" placeholder="Smart Home, Gym, Marble Floors..." /></Field>
                <Field label="External Amenities"><textarea value={form.externalAmenities} onChange={e => handleChange('externalAmenities', e.target.value)} className="input-modern min-h-[100px] py-3 text-[12px]" placeholder="Pool, Garden, 24/7 Security..." /></Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Location" icon={<MapPin size={16} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Address"><input value={form.address} onChange={e => handleChange('address', e.target.value)} className="input-modern" /></Field>
              <Field label="City"><input value={form.city} onChange={e => handleChange('city', e.target.value)} className="input-modern" /></Field>
              <Field label="Neighborhood"><input value={form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)} className="input-modern" /></Field>
              <Field label="Country"><input value={form.country} onChange={e => handleChange('country', e.target.value)} className="input-modern" /></Field>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT SECTION: CONDITIONAL */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SPECIALIZED FINANCIALS */}
          <SectionCard title={form.status === 'FOR_SALE' ? 'Sales Financials' : 'Rental Terms'} icon={<CreditCard size={16} />}>
            <div className="space-y-4">
              <Field label={form.status === 'FOR_SALE' ? 'Asking Price' : 'Monthly Rent'}>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" value={form.price} onChange={e => handleChange('price', Number(e.target.value))} className="input-modern pl-10" />
                </div>
              </Field>

              {form.status === 'FOR_SALE' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Annual Tax"><input type="number" value={form.propertyTax} onChange={e => handleChange('propertyTax', Number(e.target.value))} className="input-modern text-center" /></Field>
                    <Field label="HOA Fees"><input type="number" value={form.hoaFees} onChange={e => handleChange('hoaFees', Number(e.target.value))} className="input-modern text-center" /></Field>
                  </div>
                  <Field label="Est. Mortgage/mo"><input type="number" value={form.mortgageEstimate} onChange={e => handleChange('mortgageEstimate', Number(e.target.value))} className="input-modern" /></Field>
                  <Field label="Tenure">
                    <div className="border border-gray-300 rounded-xl bg-white">
                      <CustomDropdown value={form.tenure || 'FREEHOLD'} onChange={val => handleChange('tenure', val)} options={[{ label: 'Freehold', value: 'FREEHOLD' }, { label: 'Leasehold', value: 'LEASEHOLD' }]} />
                    </div>
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Security Deposit"><input type="number" value={form.securityDeposit} onChange={e => handleChange('securityDeposit', Number(e.target.value))} className="input-modern" /></Field>
                  <Field label="Lease Duration"><input value={form.leaseDuration} onChange={e => handleChange('leaseDuration', e.target.value)} className="input-modern" placeholder="e.g. 1 Year Min" /></Field>
                  <Field label="Furnishing">
                    <div className="border border-gray-300 rounded-xl bg-white">
                      <CustomDropdown value={form.furnishingStatus || 'UNFURNISHED'} onChange={val => handleChange('furnishingStatus', val)} options={[
                        { label: 'Unfurnished', value: 'UNFURNISHED' }, { label: 'Semi-Furnished', value: 'SEMI' }, { label: 'Fully Furnished', value: 'FULLY' }
                      ]} />
                    </div>
                  </Field>
                  <div className="flex gap-4 pt-2">
                    <button onClick={() => handleChange('petsAllowed', !form.petsAllowed)} className={`flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 text-[12px] font-bold transition-all ${form.petsAllowed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                      <CheckCircle2 size={14} /> Pets Allowed
                    </button>
                    <button onClick={() => handleChange('utilitiesIncluded', !form.utilitiesIncluded)} className={`flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 text-[12px] font-bold transition-all ${form.utilitiesIncluded ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                      <Droplets size={14} /> Utilities Inc.
                    </button>
                  </div>
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Performance" icon={<BarChart3 size={16} />}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Est. ROI %"><input type="number" step="0.1" value={form.estimatedROI} onChange={e => handleChange('estimatedROI', Number(e.target.value))} className="input-modern text-center" /></Field>
              <Field label="Yield %"><input type="number" step="0.1" value={form.rentalYield} onChange={e => handleChange('rentalYield', Number(e.target.value))} className="input-modern text-center" /></Field>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Field label="Maintenance/yr"><input type="number" value={form.maintenanceFee} onChange={e => handleChange('maintenanceFee', Number(e.target.value))} className="input-modern" /></Field>
            </div>
          </SectionCard>

          <SectionCard title="Verification" icon={<ShieldCheck size={16} />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-xl">
                <div>
                  <p className="text-[12px] font-bold text-[#1A1A1A]">Verified Listing</p>
                  <p className="text-[10px] text-gray-400 font-medium">Internal review complete</p>
                </div>
                <button
                  onClick={() => handleChange('isVerified', !form.isVerified)}
                  className={`w-10 h-5 rounded-full p-1 transition-all ${form.isVerified ? 'bg-brand' : 'bg-gray-300'}`}
                >
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${form.isVerified ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <Field label="Search Tags"><input value={form.tags} onChange={e => handleChange('tags', e.target.value)} className="input-modern" placeholder="e.g. Luxury, View, Waterfront" /></Field>
            </div>
          </SectionCard>

          <SectionCard title="Publisher" icon={<User size={16} />}>
            <div className="space-y-4">
              <Field label="Name"><input value={form.ownerName} onChange={e => handleChange('ownerName', e.target.value)} className="input-modern" /></Field>
              <Field label="Entity">
                <div className="border border-gray-300 rounded-xl bg-white">
                  <CustomDropdown value={form.ownerType || 'INDIVIDUAL'} onChange={val => handleChange('ownerType', val)} options={[
                    { label: 'Private Owner', value: 'INDIVIDUAL' }, { label: 'Agency', value: 'AGENCY' },
                  ]} />
                </div>
              </Field>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

/* --- SUBCOMPONENTS --- */

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-300">
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3 rounded-t-2xl">
      <div className="text-gray-400">{icon}</div>
      <h2 className="text-[12px] font-bold text-[#1A1A1A] tracking-wider uppercase">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field: React.FC<{ label: string; icon?: React.ReactNode; required?: boolean; children: React.ReactNode }> = ({ label, icon, required, children }) => (
  <div className="w-full">
    <label className="flex items-center gap-2 mb-2 px-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
      {icon} {label} {required && <span className="text-brand">*</span>}
    </label>
    {children}
  </div>
);

const GalleryGrid: React.FC<{ title: string; images: string[]; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; onRemove: (idx: number) => void; loading: boolean; isSingle?: boolean }> = ({ title, images, onUpload, onRemove, loading, isSingle }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center px-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
      {!isSingle && <span className="text-[10px] text-gray-300">{images.length} / 12</span>}
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
      {images.map((url, idx) => (
        <div key={idx} className="aspect-square rounded-xl border border-gray-200 overflow-hidden relative group bg-gray-50">
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button onClick={() => onRemove(idx)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <X size={14} className="text-white" />
          </button>
        </div>
      ))}
      {(!isSingle || images.length === 0) && (
        <div className="aspect-square rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center relative cursor-pointer hover:bg-gray-100 transition-colors">
          <Plus size={16} className="text-gray-400" />
          <input type="file" onChange={onUpload} disabled={loading} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
        </div>
      )}
    </div>
  </div>
);

export default AdminPropertyEditor;
