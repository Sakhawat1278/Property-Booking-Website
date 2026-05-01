import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, MapPin, Building2, Tag, 
  DollarSign, Activity, Image as ImageIcon, Home,
  Loader2, X, Plus, User, ShieldAlert, BarChart3,
  Calendar, School, Zap, Wind, Bed, Bath
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
    <div className="w-full pb-24 animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-4">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="w-10 h-10 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#1A1A1A] tracking-tight">
              {id ? 'Edit Listing' : 'Create Listing'}
            </h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
        
        {/* LEFT SECTION: 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          
          <SectionCard title="General Info" icon={<Building2 size={16} />}>
            <div className="space-y-6">
              <Field label="Property Title" required>
                <input 
                  value={form.title} 
                  onChange={e => handleChange('title', e.target.value)}
                  className="input-modern" 
                  placeholder="Enter property name..." 
                />
              </Field>
              
              <Field label="Description" required>
                <textarea 
                  value={form.description} 
                  onChange={e => handleChange('description', e.target.value)}
                  className="input-modern min-h-[140px] py-3 resize-none" 
                  placeholder="Write a detailed description..."
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <CustomDropdown 
                    label="Category"
                    value={form.category || 'RESIDENTIAL'}
                    onChange={val => handleChange('category', val)}
                    options={[
                      { label: 'Residential', value: 'RESIDENTIAL' },
                      { label: 'Commercial', value: 'COMMERCIAL' },
                      { label: 'Luxury', value: 'LUXURY' },
                      { label: 'Vacation', value: 'VACATION' },
                    ]}
                  />
                </div>
                <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <CustomDropdown 
                    label="Status"
                    value={form.status || 'FOR_SALE'}
                    onChange={val => handleChange('status', val)}
                    options={[
                      { label: 'For Sale', value: 'FOR_SALE' },
                      { label: 'For Rent', value: 'FOR_RENT' },
                      { label: 'Off Plan', value: 'OFF_PLAN' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Media" icon={<ImageIcon size={16} />}>
            <div className="space-y-8">
              <div>
                <Label label="Cover Image" required hint="JPG/PNG/WebP, Max 5MB" />
                <div className={`aspect-video rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group ${
                  form.primaryImage ? 'border-none' : 'bg-gray-50'
                }`}>
                  {form.primaryImage ? (
                    <>
                      <img src={form.primaryImage} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button onClick={() => handleChange('primaryImage', '')} className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center"><X size={20} /></button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Plus size={24} />
                      <span className="text-[12px] font-bold">Add Cover</span>
                      <input type="file" onChange={e => handleFileUpload(e, 'primaryImage')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <GalleryGrid title="Exterior" images={form.exteriorGallery || []} onUpload={e => handleFileUpload(e, 'exteriorGallery', true)} onRemove={idx => removeGalleryImage('exteriorGallery', idx)} loading={loading} />
                <GalleryGrid title="Living Area" images={form.livingGallery || []} onUpload={e => handleFileUpload(e, 'livingGallery', true)} onRemove={idx => removeGalleryImage('livingGallery', idx)} loading={loading} />
                <GalleryGrid title="Kitchen" images={form.kitchenGallery || []} onUpload={e => handleFileUpload(e, 'kitchenGallery', true)} onRemove={idx => removeGalleryImage('kitchenGallery', idx)} loading={loading} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Location & Specs" icon={<MapPin size={16} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Address"><input value={form.address} onChange={e => handleChange('address', e.target.value)} className="input-modern" /></Field>
              <Field label="City"><input value={form.city} onChange={e => handleChange('city', e.target.value)} className="input-modern" /></Field>
              <Field label="Neighborhood"><input value={form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)} className="input-modern" /></Field>
              <Field label="Country"><input value={form.country} onChange={e => handleChange('country', e.target.value)} className="input-modern" /></Field>
              
              <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <Field label="Beds" icon={<Bed size={12} />}><input type="number" value={form.bedrooms} onChange={e => handleChange('bedrooms', Number(e.target.value))} className="input-modern text-center" /></Field>
                <Field label="Baths" icon={<Bath size={12} />}><input type="number" value={form.bathrooms} onChange={e => handleChange('bathrooms', Number(e.target.value))} className="input-modern text-center" /></Field>
                <Field label="Sq Ft" icon={<Activity size={12} />}><input type="number" value={form.totalArea} onChange={e => handleChange('totalArea', Number(e.target.value))} className="input-modern text-center" /></Field>
                <Field label="Year" icon={<Calendar size={12} />}><input type="number" value={form.yearBuilt} onChange={e => handleChange('yearBuilt', Number(e.target.value))} className="input-modern text-center" /></Field>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT SECTION: 4 Cols */}
        <div className="lg:col-span-4 space-y-6">
          <SectionCard title="Pricing & Yield" icon={<BarChart3 size={16} />}>
            <div className="space-y-4">
              <Field label="Price (USD)">
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" value={form.price} onChange={e => handleChange('price', Number(e.target.value))} className="input-modern pl-10" />
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="ROI %"><input type="number" step="0.1" value={form.estimatedROI} onChange={e => handleChange('estimatedROI', Number(e.target.value))} className="input-modern text-center" /></Field>
                <Field label="Yield %"><input type="number" step="0.1" value={form.rentalYield} onChange={e => handleChange('rentalYield', Number(e.target.value))} className="input-modern text-center" /></Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Local Scores" icon={<Activity size={16} />}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Safety"><input type="number" max="10" value={form.neighborhoodSafety} onChange={e => handleChange('neighborhoodSafety', Number(e.target.value))} className="input-modern text-center" /></Field>
                <Field label="Air Quality"><input type="number" value={form.airQuality} onChange={e => handleChange('airQuality', Number(e.target.value))} className="input-modern text-center" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Walk"><input type="number" value={form.walkScore} onChange={e => handleChange('walkScore', Number(e.target.value))} className="input-modern text-center" /></Field>
                <Field label="Transit"><input type="number" value={form.transitScore} onChange={e => handleChange('transitScore', Number(e.target.value))} className="input-modern text-center" /></Field>
              </div>
              <Field label="Nearby Schools" icon={<School size={12} />}><textarea value={form.nearbySchools} onChange={e => handleChange('nearbySchools', e.target.value)} className="input-modern min-h-[60px] py-2 text-[12px]" /></Field>
            </div>
          </SectionCard>

          <SectionCard title="Publisher" icon={<User size={16} />}>
            <div className="space-y-4">
              <Field label="Name"><input value={form.ownerName} onChange={e => handleChange('ownerName', e.target.value)} className="input-modern" /></Field>
              <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
                <CustomDropdown 
                  label="Entity"
                  value={form.ownerType || 'INDIVIDUAL'}
                  onChange={val => handleChange('ownerType', val)}
                  options={[
                    { label: 'Private Owner', value: 'INDIVIDUAL' },
                    { label: 'Agency', value: 'AGENCY' },
                  ]}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-xl">
                <span className="text-[12px] font-bold text-gray-600">Verified Listing</span>
                <button
                  onClick={() => handleChange('isVerified', !form.isVerified)}
                  className={`w-10 h-5 rounded-full p-1 transition-all ${form.isVerified ? 'bg-brand' : 'bg-gray-300'}`}
                >
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${form.isVerified ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

/* --- REFINED SUBCOMPONENTS (Flatter Design) --- */

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <h2 className="text-[12px] font-bold text-[#1A1A1A] tracking-wider uppercase">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
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

const Label: React.FC<{ label: string; required?: boolean; hint?: string }> = ({ label, required, hint }) => (
  <div className="mb-3 px-1">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
      {label} {required && <span className="text-brand">*</span>}
    </label>
    {hint && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{hint}</p>}
  </div>
);

const GalleryGrid: React.FC<{ title: string; images: string[]; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; onRemove: (idx: number) => void; loading: boolean }> = ({ title, images, onUpload, onRemove, loading }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center px-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
      <span className="text-[10px] text-gray-300">{images.length} / 12</span>
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
      {images.map((url, idx) => (
        <div key={idx} className="aspect-square rounded-xl border border-gray-200 overflow-hidden relative group">
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button onClick={() => onRemove(idx)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <X size={14} className="text-white" />
          </button>
        </div>
      ))}
      <div className="aspect-square rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center relative cursor-pointer hover:bg-gray-100 transition-colors">
        <Plus size={16} className="text-gray-400" />
        <input type="file" onChange={onUpload} disabled={loading} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
      </div>
    </div>
  </div>
);

export default AdminPropertyEditor;
