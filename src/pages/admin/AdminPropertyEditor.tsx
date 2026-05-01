import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, MapPin, Building2, Tag, 
  DollarSign, Activity, Image as ImageIcon, Home,
  Loader2, X, Plus, User, ShieldAlert, BarChart3,
  Calendar, Info, School, Zap, Droplets, Flame, Sun, Wind,
  ChevronDown, Bed, Bath
} from 'lucide-react';
import { supabase, uploadImage } from '../../lib/supabase';
import type { Property } from '../../data/properties';
import { toast } from 'sonner';

const AdminPropertyEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id ? true : false);
  
  const [form, setForm] = useState<Partial<Property>>({
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
    rating: 4.5,
    reviewsCount: 0,
    estimatedROI: 0,
    rentalYield: 0,
    neighborhoodSafety: 9,
    nearbySchools: '',
    roomBreakdown: '',
    serviceCharges: 0,
    propertyTax: 0,
    yearBuilt: new Date().getFullYear(),
    walkScore: 85,
    transitScore: 80,
    floodRisk: 1,
    fireRisk: 1,
    heatRisk: 1,
    airQuality: 90,
    ownerName: '',
    ownerTitle: 'Property Owner',
    ownerImage: '',
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
      
      // Auto-generate slug if missing
      const slug = form.slug || form.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const payload = {
        ...form,
        slug,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('properties')
        .upsert(payload);

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

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 px-2">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand hover:shadow-lg hover:shadow-brand/5 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight">
              {id ? 'Edit Listing' : 'New Property Listing'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${id ? 'bg-brand' : 'bg-green-500'} animate-pulse`} />
              <p className="text-[13px] text-gray-500 font-medium">
                {id ? `Editing ID: ${id.slice(0, 8)}...` : 'Ready to reach thousands of buyers.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="px-7 h-12 rounded-2xl bg-white border border-gray-200 text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-8 h-12 rounded-2xl bg-[#1A1A1A] text-white text-[13px] font-bold flex items-center gap-3 hover:bg-brand transition-all shadow-xl shadow-black/10 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {id ? 'Save Changes' : 'Publish Property'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SECTION: CONTENT (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Card 1: Listing Details */}
          <SectionCard title="General Information" icon={<Building2 size={16} />}>
            <div className="space-y-7">
              <Field label="Property Title" required hint="Make it catchy and descriptive">
                <input 
                  value={form.title} 
                  onChange={e => handleChange('title', e.target.value)}
                  className="input-modern" 
                  placeholder="e.g. Modern Minimalist Villa with Ocean View" 
                />
              </Field>
              
              <Field label="Description" required>
                <textarea 
                  value={form.description} 
                  onChange={e => handleChange('description', e.target.value)}
                  className="input-modern min-h-[160px] py-4 resize-none" 
                  placeholder="Tell potential buyers why they should love this home..."
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Property Category">
                  <div className="relative">
                    <select value={form.category} onChange={e => handleChange('category', e.target.value)} className="input-modern appearance-none cursor-pointer">
                      <option value="RESIDENTIAL">🏠 Residential</option>
                      <option value="COMMERCIAL">🏢 Commercial</option>
                      <option value="LUXURY">✨ Luxury</option>
                      <option value="VACATION">🏖️ Vacation</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </Field>
                <Field label="Availability Status">
                  <div className="relative">
                    <select value={form.status} onChange={e => handleChange('status', e.target.value)} className="input-modern appearance-none cursor-pointer">
                      <option value="FOR_SALE">🟢 For Sale</option>
                      <option value="FOR_RENT">🔵 For Rent</option>
                      <option value="OFF_PLAN">🟡 Off Plan</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Card 2: Media Management */}
          <SectionCard title="Visual Media" icon={<ImageIcon size={16} />}>
            <div className="space-y-10">
              {/* Primary Image */}
              <div>
                <Label label="Primary Cover Photo" hint="This is the first image buyers will see." />
                <div className="mt-4 relative group">
                  <div className={`aspect-video rounded-[28px] overflow-hidden border-2 border-dashed transition-all duration-300 flex items-center justify-center relative ${
                    form.primaryImage ? 'border-transparent shadow-lg' : 'border-gray-200 bg-gray-50 hover:border-brand/40 hover:bg-brand/5'
                  }`}>
                    {form.primaryImage ? (
                      <>
                        <img src={form.primaryImage} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <button 
                            onClick={() => handleChange('primaryImage', '')}
                            className="w-12 h-12 rounded-full bg-white text-red-500 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                          >
                            <X size={22} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-center gap-4 p-8">
                        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-sm text-brand">
                          <ImageIcon size={28} />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#1A1A1A]">Drop cover image here</p>
                          <p className="text-[12px] text-gray-400 mt-1">PNG, JPG or WebP. Max 5MB.</p>
                        </div>
                        <input 
                          type="file" 
                          onChange={e => handleFileUpload(e, 'primaryImage')}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          accept="image/*"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Multi-Galleries */}
              <div className="space-y-12">
                <GalleryUploader 
                  title="Exterior & Architecture" 
                  icon={<MapPin size={14} />}
                  images={form.exteriorGallery || []} 
                  onUpload={e => handleFileUpload(e, 'exteriorGallery', true)}
                  onRemove={idx => removeGalleryImage('exteriorGallery', idx)}
                  loading={loading}
                />
                <GalleryUploader 
                  title="Living & Interior" 
                  icon={<Home size={14} />}
                  images={form.livingGallery || []} 
                  onUpload={e => handleFileUpload(e, 'livingGallery', true)}
                  onRemove={idx => removeGalleryImage('livingGallery', idx)}
                  loading={loading}
                />
                <GalleryUploader 
                  title="Kitchen & Dining" 
                  icon={<Activity size={14} />}
                  images={form.kitchenGallery || []} 
                  onUpload={e => handleFileUpload(e, 'kitchenGallery', true)}
                  onRemove={idx => removeGalleryImage('kitchenGallery', idx)}
                  loading={loading}
                />
              </div>
            </div>
          </SectionCard>

          {/* Card 3: Location & Specs */}
          <SectionCard title="Location & Specifications" icon={<MapPin size={16} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
              <Field label="Street Address" icon={<MapPin size={14} />}>
                <input value={form.address} onChange={e => handleChange('address', e.target.value)} className="input-modern" placeholder="e.g. 123 Luxury Ave" />
              </Field>
              <Field label="City">
                <input value={form.city} onChange={e => handleChange('city', e.target.value)} className="input-modern" placeholder="e.g. Dubai" />
              </Field>
              <Field label="Neighborhood">
                <input value={form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)} className="input-modern" placeholder="e.g. Downtown" />
              </Field>
              <Field label="Country">
                <input value={form.country} onChange={e => handleChange('country', e.target.value)} className="input-modern" placeholder="e.g. UAE" />
              </Field>

              <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <Field label="Bedrooms" icon={<Bed size={14} />}>
                  <input type="number" value={form.bedrooms} onChange={e => handleChange('bedrooms', Number(e.target.value))} className="input-modern text-center" />
                </Field>
                <Field label="Bathrooms" icon={<Bath size={14} />}>
                  <input type="number" value={form.bathrooms} onChange={e => handleChange('bathrooms', Number(e.target.value))} className="input-modern text-center" />
                </Field>
                <Field label="Area (sqft)" icon={<Activity size={14} />}>
                  <input type="number" value={form.totalArea} onChange={e => handleChange('totalArea', Number(e.target.value))} className="input-modern text-center" />
                </Field>
                <Field label="Year Built" icon={<Calendar size={14} />}>
                  <input type="number" value={form.yearBuilt} onChange={e => handleChange('yearBuilt', Number(e.target.value))} className="input-modern text-center" />
                </Field>
              </div>

              <div className="col-span-full pt-4 space-y-7">
                <Field label="Internal Amenities" hint="Comma separated list (e.g. Smart Home, Gym)">
                  <textarea value={form.internalAmenities} onChange={e => handleChange('internalAmenities', e.target.value)} className="input-modern min-h-[100px] py-4 resize-none" />
                </Field>
                <Field label="External Amenities" hint="Comma separated list (e.g. Pool, Garden)">
                  <textarea value={form.externalAmenities} onChange={e => handleChange('externalAmenities', e.target.value)} className="input-modern min-h-[100px] py-4 resize-none" />
                </Field>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT SECTION: SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Card 4: Price & ROI */}
          <SectionCard title="Financials" icon={<BarChart3 size={16} />}>
            <div className="space-y-6">
              <Field label="Price" icon={<DollarSign size={14} />}>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="number" 
                    value={form.price} 
                    onChange={e => handleChange('price', Number(e.target.value))}
                    className="input-modern pl-10" 
                  />
                </div>
              </Field>
              
              <div className="grid grid-cols-2 gap-4">
                <Field label="ROI (%)">
                  <input type="number" step="0.1" value={form.estimatedROI} onChange={e => handleChange('estimatedROI', Number(e.target.value))} className="input-modern text-center" />
                </Field>
                <Field label="Yield (%)">
                  <input type="number" step="0.1" value={form.rentalYield} onChange={e => handleChange('rentalYield', Number(e.target.value))} className="input-modern text-center" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Tax (Annual)">
                  <input type="number" value={form.propertyTax} onChange={e => handleChange('propertyTax', Number(e.target.value))} className="input-modern text-center" />
                </Field>
                <Field label="Service Fees">
                  <input type="number" value={form.serviceCharges} onChange={e => handleChange('serviceCharges', Number(e.target.value))} className="input-modern text-center" />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Card 5: Local Analytics */}
          <SectionCard title="Neighborhood Insights" icon={<Activity size={16} />}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Safety Score" icon={<ShieldAlert size={12} />}>
                  <input type="number" max="10" value={form.neighborhoodSafety} onChange={e => handleChange('neighborhoodSafety', Number(e.target.value))} className="input-modern text-center" />
                </Field>
                <Field label="Air Quality" icon={<Wind size={12} />}>
                  <input type="number" value={form.airQuality} onChange={e => handleChange('airQuality', Number(e.target.value))} className="input-modern text-center" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Walk Score" icon={<Home size={12} />}>
                  <input type="number" value={form.walkScore} onChange={e => handleChange('walkScore', Number(e.target.value))} className="input-modern text-center" />
                </Field>
                <Field label="Transit Score" icon={<Activity size={12} />}>
                  <input type="number" value={form.transitScore} onChange={e => handleChange('transitScore', Number(e.target.value))} className="input-modern text-center" />
                </Field>
              </div>

              <div className="pt-4 border-t border-gray-50 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Flood</span>
                  <input type="number" value={form.floodRisk} onChange={e => handleChange('floodRisk', Number(e.target.value))} className="w-full h-8 rounded-lg bg-gray-50 border border-gray-100 text-[11px] text-center font-bold" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Fire</span>
                  <input type="number" value={form.fireRisk} onChange={e => handleChange('fireRisk', Number(e.target.value))} className="w-full h-8 rounded-lg bg-gray-50 border border-gray-100 text-[11px] text-center font-bold" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Heat</span>
                  <input type="number" value={form.heatRisk} onChange={e => handleChange('heatRisk', Number(e.target.value))} className="w-full h-8 rounded-lg bg-gray-50 border border-gray-100 text-[11px] text-center font-bold" />
                </div>
              </div>

              <Field label="Nearby Schools" icon={<School size={12} />}>
                <textarea value={form.nearbySchools} onChange={e => handleChange('nearbySchools', e.target.value)} className="input-modern min-h-[60px] py-3 text-[12px] resize-none" placeholder="e.g. British International, Green School" />
              </Field>
            </div>
          </SectionCard>

          {/* Card 6: Visibility & Verification */}
          <SectionCard title="Publish Settings" icon={<ShieldAlert size={16} />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand border border-gray-100">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#1A1A1A]">Verified Badge</p>
                    <p className="text-[11px] text-gray-400 font-medium">Build trust with buyers</p>
                  </div>
                </div>
                <button
                  onClick={() => handleChange('isVerified', !form.isVerified)}
                  className={`w-11 h-6 rounded-full p-1 transition-all duration-300 ${form.isVerified ? 'bg-brand' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${form.isVerified ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <Field label="Custom Tags" icon={<Tag size={12} />}>
                <input value={form.tags} onChange={e => handleChange('tags', e.target.value)} className="input-modern" placeholder="e.g. Featured, Hot Deal, Exclusive" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Public Rating">
                  <input type="number" step="0.1" value={form.rating} onChange={e => handleChange('rating', Number(e.target.value))} className="input-modern text-center" />
                </Field>
                <Field label="Reviews Count">
                  <input type="number" value={form.reviewsCount} onChange={e => handleChange('reviewsCount', Number(e.target.value))} className="input-modern text-center" />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Card 7: Owner Info */}
          <SectionCard title="Contact / Agency" icon={<User size={16} />}>
            <div className="space-y-6">
              <Field label="Representative Name">
                <input value={form.ownerName} onChange={e => handleChange('ownerName', e.target.value)} className="input-modern" placeholder="e.g. John Doe" />
              </Field>
              <Field label="Official Title">
                <input value={form.ownerTitle} onChange={e => handleChange('ownerTitle', e.target.value)} className="input-modern" placeholder="e.g. Senior Portfolio Manager" />
              </Field>
              <Field label="Ownership Type">
                <div className="relative">
                  <select value={form.ownerType} onChange={e => handleChange('ownerType', e.target.value)} className="input-modern appearance-none">
                    <option value="INDIVIDUAL">Private Owner</option>
                    <option value="AGENCY">Real Estate Agency</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </Field>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

/* --- ENHANCED SUBCOMPONENTS --- */

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
    <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/40 flex items-center gap-4">
      <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand transition-colors">
        {icon}
      </div>
      <h2 className="text-[13px] font-bold text-[#1A1A1A] tracking-widest uppercase">{title}</h2>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const Field: React.FC<{ label: string; icon?: React.ReactNode; required?: boolean; hint?: string; children: React.ReactNode }> = ({ label, icon, required, hint, children }) => (
  <div className="w-full group/field">
    <div className="flex flex-col mb-3 px-1">
      <div className="flex items-center gap-2">
        {icon && <div className="text-gray-400">{icon}</div>}
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          {label} {required && <span className="text-brand ml-0.5">*</span>}
        </label>
      </div>
      {hint && <span className="text-[10px] text-gray-400 mt-0.5 font-medium">{hint}</span>}
    </div>
    {children}
  </div>
);

const Label: React.FC<{ label: string; required?: boolean; hint?: string }> = ({ label, required, hint }) => (
  <div className="flex flex-col mb-4 px-1">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
      {label} {required && <span className="text-brand ml-0.5">*</span>}
    </label>
    {hint && <span className="text-[10px] text-gray-400 mt-0.5 font-medium">{hint}</span>}
  </div>
);

const GalleryUploader: React.FC<{ 
  title: string; 
  icon: React.ReactNode;
  images: string[]; 
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onRemove: (idx: number) => void;
  loading: boolean;
}> = ({ title, icon, images, onUpload, onRemove, loading }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 px-1">
      <div className="text-brand">{icon}</div>
      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{title}</span>
      <span className="ml-auto text-[10px] font-bold text-gray-300">{images.length} Photos</span>
    </div>
    
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
      {images.map((url, idx) => (
        <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative group/item border border-gray-50">
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button 
            onClick={() => onRemove(idx)}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/50 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover/item:opacity-100 transition-all hover:bg-red-500"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      
      <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center gap-1.5 hover:border-brand/30 hover:bg-brand/5 transition-all relative group cursor-pointer">
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-brand group-hover:scale-110 transition-all">
          <Plus size={14} />
        </div>
        <span className="text-[9px] font-bold text-gray-400 uppercase group-hover:text-brand">Upload</span>
        <input 
          type="file" 
          onChange={onUpload}
          className="absolute inset-0 opacity-0 cursor-pointer" 
          accept="image/*"
          disabled={loading}
        />
      </div>
    </div>
  </div>
);

export default AdminPropertyEditor;
