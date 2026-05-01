import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, MapPin, Building2, Tag, 
  DollarSign, Activity, Image as ImageIcon, Home,
  Loader2, X, Plus, User, ShieldAlert, BarChart3
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

  // Upload Handlers
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

      toast.success(id ? 'Property updated!' : 'Property created!');
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
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight">
              {id ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-[13px] text-gray-400 font-medium">Manage every detail and media asset for this listing.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/properties')}
            className="px-6 h-12 rounded-full bg-white border border-gray-100 text-[13px] font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-8 h-12 rounded-full bg-[#1A1A1A] text-white text-[13px] font-bold flex items-center gap-2 hover:bg-brand transition-all shadow-xl shadow-black/10 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {id ? 'Save Changes' : 'Publish Listing'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PRIMARY DETAILS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Basic Info */}
          <FormSection icon={<Building2 size={18} />} title="Primary Listing Details">
            <div className="space-y-6">
              <Field label="Property Title" required>
                <input 
                  value={form.title} 
                  onChange={e => handleChange('title', e.target.value)}
                  className="input-admin" 
                  placeholder="e.g. Skyline Luxury Penthouse" 
                />
              </Field>
              
              <Field label="Description" required>
                <textarea 
                  value={form.description} 
                  onChange={e => handleChange('description', e.target.value)}
                  className="input-admin min-h-[150px] py-4" 
                  placeholder="Write a compelling description..."
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={form.category} onChange={e => handleChange('category', e.target.value)} className="input-admin">
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="LUXURY">Luxury</option>
                    <option value="VACATION">Vacation</option>
                  </select>
                </Field>
                <Field label="Listing Status">
                  <select value={form.status} onChange={e => handleChange('status', e.target.value)} className="input-admin">
                    <option value="FOR_SALE">For Sale</option>
                    <option value="FOR_RENT">For Rent</option>
                    <option value="OFF_PLAN">Off Plan</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Price">
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number" 
                      value={form.price} 
                      onChange={e => handleChange('price', Number(e.target.value))}
                      className="input-admin pl-10" 
                    />
                  </div>
                </Field>
                <Field label="Currency">
                  <input value={form.currency} onChange={e => handleChange('currency', e.target.value)} className="input-admin" />
                </Field>
              </div>
            </div>
          </FormSection>

          {/* 2. Media Uploads */}
          <FormSection icon={<ImageIcon size={18} />} title="Media & Galleries">
            <div className="space-y-8">
              {/* Primary Image */}
              <div>
                <Label label="Primary Cover Image" />
                <div className="relative group">
                  <div className="aspect-video rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center relative transition-all group-hover:border-brand/30">
                    {form.primaryImage ? (
                      <>
                        <img src={form.primaryImage} alt="" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => handleChange('primaryImage', '')}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <Plus size={20} />
                        </div>
                        <span className="text-[13px] font-medium">Click to upload cover photo</span>
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

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 gap-8">
                <GallerySection 
                  title="Exterior Gallery" 
                  images={form.exteriorGallery || []} 
                  onUpload={e => handleFileUpload(e, 'exteriorGallery', true)}
                  onRemove={idx => removeGalleryImage('exteriorGallery', idx)}
                />
                <GallerySection 
                  title="Living Room Gallery" 
                  images={form.livingGallery || []} 
                  onUpload={e => handleFileUpload(e, 'livingGallery', true)}
                  onRemove={idx => removeGalleryImage('livingGallery', idx)}
                />
                <GallerySection 
                  title="Kitchen Gallery" 
                  images={form.kitchenGallery || []} 
                  onUpload={e => handleFileUpload(e, 'kitchenGallery', true)}
                  onRemove={idx => removeGalleryImage('kitchenGallery', idx)}
                />
              </div>
            </div>
          </FormSection>

          {/* 3. Location Details */}
          <FormSection icon={<MapPin size={18} />} title="Location Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="Street Address">
                <input value={form.address} onChange={e => handleChange('address', e.target.value)} className="input-admin" />
              </Field>
              <Field label="City">
                <input value={form.city} onChange={e => handleChange('city', e.target.value)} className="input-admin" />
              </Field>
              <Field label="Neighborhood">
                <input value={form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)} className="input-admin" />
              </Field>
              <Field label="Country">
                <input value={form.country} onChange={e => handleChange('country', e.target.value)} className="input-admin" />
              </Field>
            </div>
          </FormSection>

          {/* 4. Specifications */}
          <FormSection icon={<Activity size={18} />} title="Specifications & Amenities">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <Field label="Bedrooms">
                <input type="number" value={form.bedrooms} onChange={e => handleChange('bedrooms', Number(e.target.value))} className="input-admin" />
              </Field>
              <Field label="Bathrooms">
                <input type="number" value={form.bathrooms} onChange={e => handleChange('bathrooms', Number(e.target.value))} className="input-admin" />
              </Field>
              <Field label="Area (sqft)">
                <input type="number" value={form.totalArea} onChange={e => handleChange('totalArea', Number(e.target.value))} className="input-admin" />
              </Field>
              <Field label="Year Built">
                <input type="number" value={form.yearBuilt} onChange={e => handleChange('yearBuilt', Number(e.target.value))} className="input-admin" />
              </Field>
            </div>
            
            <div className="space-y-6">
              <Field label="Internal Amenities (Comma separated)">
                <textarea 
                  value={form.internalAmenities} 
                  onChange={e => handleChange('internalAmenities', e.target.value)}
                  className="input-admin min-h-[80px]" 
                  placeholder="e.g. Smart Home, Floor-to-ceiling windows"
                />
              </Field>
              <Field label="External Amenities (Comma separated)">
                <textarea 
                  value={form.externalAmenities} 
                  onChange={e => handleChange('externalAmenities', e.target.value)}
                  className="input-admin min-h-[80px]" 
                  placeholder="e.g. Infinity Pool, Private Gym"
                />
              </Field>
              <Field label="Room Breakdown">
                <textarea 
                  value={form.roomBreakdown} 
                  onChange={e => handleChange('roomBreakdown', e.target.value)}
                  className="input-admin min-h-[80px]" 
                  placeholder="Living: 30x20, Master: 15x15..."
                />
              </Field>
            </div>
          </FormSection>
        </div>

        {/* RIGHT COLUMN: ANALYTICS & STATUS */}
        <div className="space-y-8">
          
          {/* 5. Listing Status */}
          <FormSection icon={<ShieldAlert size={18} />} title="Status & Verification">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A1A]">Verified Listing</p>
                  <p className="text-[11px] text-gray-400">Add verification badge</p>
                </div>
                <button
                  onClick={() => handleChange('isVerified', !form.isVerified)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-all ${form.isVerified ? 'bg-brand' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all ${form.isVerified ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <Field label="Search Tags (Comma separated)">
                <input value={form.tags} onChange={e => handleChange('tags', e.target.value)} className="input-admin" placeholder="Featured, Hot Deal..." />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rating">
                  <input type="number" step="0.1" value={form.rating} onChange={e => handleChange('rating', Number(e.target.value))} className="input-admin" />
                </Field>
                <Field label="Reviews">
                  <input type="number" value={form.reviewsCount} onChange={e => handleChange('reviewsCount', Number(e.target.value))} className="input-admin" />
                </Field>
              </div>
            </div>
          </FormSection>

          {/* 6. Financial Analytics */}
          <FormSection icon={<BarChart3 size={18} />} title="Financial Metrics">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Estimated ROI (%)">
                <input type="number" step="0.1" value={form.estimatedROI} onChange={e => handleChange('estimatedROI', Number(e.target.value))} className="input-admin" />
              </Field>
              <Field label="Rental Yield (%)">
                <input type="number" step="0.1" value={form.rentalYield} onChange={e => handleChange('rentalYield', Number(e.target.value))} className="input-admin" />
              </Field>
              <Field label="Annual Property Tax">
                <input type="number" value={form.propertyTax} onChange={e => handleChange('propertyTax', Number(e.target.value))} className="input-admin" />
              </Field>
              <Field label="Annual Service Charges">
                <input type="number" value={form.serviceCharges} onChange={e => handleChange('serviceCharges', Number(e.target.value))} className="input-admin" />
              </Field>
            </div>
          </FormSection>

          {/* 7. Neighborhood Scores */}
          <FormSection icon={<MapPin size={18} />} title="Local Analytics">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Safety Score">
                <input type="number" max="10" value={form.neighborhoodSafety} onChange={e => handleChange('neighborhoodSafety', Number(e.target.value))} className="input-admin" />
              </Field>
              <Field label="Walk Score">
                <input type="number" value={form.walkScore} onChange={e => handleChange('walkScore', Number(e.target.value))} className="input-admin" />
              </Field>
              <Field label="Transit Score">
                <input type="number" value={form.transitScore} onChange={e => handleChange('transitScore', Number(e.target.value))} className="input-admin" />
              </Field>
              <Field label="Air Quality">
                <input type="number" value={form.airQuality} onChange={e => handleChange('airQuality', Number(e.target.value))} className="input-admin" />
              </Field>
            </div>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Field label="Flood Risk">
                  <input type="number" value={form.floodRisk} onChange={e => handleChange('floodRisk', Number(e.target.value))} className="input-admin" />
                </Field>
                <Field label="Fire Risk">
                  <input type="number" value={form.fireRisk} onChange={e => handleChange('fireRisk', Number(e.target.value))} className="input-admin" />
                </Field>
                <Field label="Heat Risk">
                  <input type="number" value={form.heatRisk} onChange={e => handleChange('heatRisk', Number(e.target.value))} className="input-admin" />
                </Field>
              </div>
              <Field label="Nearby Schools">
                <textarea value={form.nearbySchools} onChange={e => handleChange('nearbySchools', e.target.value)} className="input-admin min-h-[60px]" />
              </Field>
            </div>
          </FormSection>

          {/* 8. Owner Information */}
          <FormSection icon={<User size={18} />} title="Owner/Agency Details">
            <div className="space-y-4">
              <Field label="Name">
                <input value={form.ownerName} onChange={e => handleChange('ownerName', e.target.value)} className="input-admin" />
              </Field>
              <Field label="Title">
                <input value={form.ownerTitle} onChange={e => handleChange('ownerTitle', e.target.value)} className="input-admin" />
              </Field>
              <Field label="Type">
                <select value={form.ownerType} onChange={e => handleChange('ownerType', e.target.value)} className="input-admin">
                  <option value="INDIVIDUAL">Individual Owner</option>
                  <option value="AGENCY">Real Estate Agency</option>
                </select>
              </Field>
            </div>
          </FormSection>

        </div>
      </div>
    </div>
  );
};

/* --- SUBCOMPONENTS --- */

const FormSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <h2 className="text-[14px] font-bold text-[#1A1A1A] tracking-tight uppercase">{title}</h2>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="w-full">
    <Label label={label} required={required} />
    {children}
  </div>
);

const Label: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 ml-1">
    {label} {required && <span className="text-brand ml-0.5">*</span>}
  </label>
);

const GallerySection: React.FC<{ 
  title: string; 
  images: string[]; 
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onRemove: (idx: number) => void;
}> = ({ title, images, onUpload, onRemove }) => (
  <div>
    <Label label={title} />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {images.map((url, idx) => (
        <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative group">
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button 
            onClick={() => onRemove(idx)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 hover:border-brand/30 transition-all relative">
        <Plus size={16} className="text-gray-400" />
        <span className="text-[10px] font-bold text-gray-400 uppercase">Add</span>
        <input 
          type="file" 
          onChange={onUpload}
          className="absolute inset-0 opacity-0 cursor-pointer" 
          accept="image/*"
        />
      </div>
    </div>
  </div>
);

export default AdminPropertyEditor;
