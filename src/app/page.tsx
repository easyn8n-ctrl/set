'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Globe, Moon, Sun, Star, Check, Zap, Clock,
  Shield, Database, Crown, ArrowRight, Search, X, Menu,
  Mail, Heart, Sparkles, Eye, Send,
  Monitor, Server, FileText, Users, ShoppingBag, Stethoscope,
  Utensils, Scissors, Home as HomeIcon, Building2, Car, GraduationCap,
  CheckCircle2, AlertCircle, MessageCircle, ArrowLeft,
  Lock, DollarSign, TrendingUp, Package, RefreshCw, CreditCard, Loader2, LogOut, ChevronLeft, ChevronRight,
  BarChart3,
  Palette, Languages, MapPin, Download, Bot, UserCircle, Info, MessageSquare, EyeOff, UserPlus,
  ImagePlus, Link2, Copy, Upload, Trash2, ZoomIn, Plus, Tag
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession, signIn, signOut } from 'next-auth/react';

// Product data
const products = [
  {
    id: 1,
    title: 'Dental Clinic Website',
    category: 'Healthcare',
    icon: Stethoscope,
    description: 'Professional dental clinic website with online booking, services showcase, and Google Maps integration',
    services: ['Online Appointment Booking', 'Product Sales / E-commerce', 'Photo Gallery (Before & After)'],
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    badgeColor: 'bg-emerald-500/10 text-emerald-500',
    image: 'dental-clinic',
    popular: true,
  },
  {
    id: 2,
    title: 'Barbershop Website',
    category: 'Beauty & Spa',
    icon: Scissors,
    description: 'Modern barbershop website with online booking, schedule management, and service showcase',
    services: ['Online Appointment Booking', 'Photo Gallery (Portfolio)', 'Service Menu with Pricing'],
    color: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/30',
    badgeColor: 'bg-orange-500/10 text-orange-500',
    image: 'barbershop',
    popular: false,
  },
  {
    id: 3,
    title: 'Restaurant Website',
    category: 'Food & Dining',
    icon: Utensils,
    description: 'Beautiful restaurant website with online menu, table reservations, and Google Maps directions',
    services: ['Online Table Reservation', 'Food Menu Display', 'Online Ordering & Delivery'],
    color: 'from-rose-500/20 to-red-500/20',
    borderColor: 'border-rose-500/30',
    badgeColor: 'bg-rose-500/10 text-rose-500',
    image: 'restaurant',
    popular: true,
  },
  {
    id: 4,
    title: 'Med Spa Website',
    category: 'Healthcare',
    icon: Heart,
    description: 'Elegant med spa website with treatment showcase, before/after gallery, and online booking',
    services: ['Online Appointment Booking', 'Before & After Photo Gallery', 'Product Sales / E-commerce'],
    color: 'from-pink-500/20 to-fuchsia-500/20',
    borderColor: 'border-pink-500/30',
    badgeColor: 'bg-pink-500/10 text-pink-500',
    image: 'beauty-clinic',
    popular: false,
  },
  {
    id: 5,
    title: 'Local Retail Store',
    category: 'Retail',
    icon: ShoppingBag,
    description: 'Local business website with product showcase, store hours, and Google Maps integration',
    services: ['Product Sales / E-commerce', 'Photo Gallery (Products)', 'Contact Form & Map'],
    color: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    badgeColor: 'bg-violet-500/10 text-violet-500',
    image: 'ecommerce',
    popular: true,
  },
  {
    id: 6,
    title: 'Real Estate Agency',
    category: 'Professional',
    icon: Building2,
    description: 'Professional real estate website with MLS listings, property search, and lead capture',
    services: ['Property Listings Search', 'Contact Form & Map', 'Mortgage Calculator'],
    color: 'from-cyan-500/20 to-sky-500/20',
    borderColor: 'border-cyan-500/30',
    badgeColor: 'bg-cyan-500/10 text-cyan-500',
    image: 'real-estate',
    popular: false,
  },
  {
    id: 7,
    title: 'Tutoring Center',
    category: 'Education',
    icon: GraduationCap,
    description: 'Tutoring & learning center website with course catalog, registration, and scheduling',
    services: ['Course / Program Catalog', 'Online Registration & Enrollment', 'Contact Form & Map'],
    color: 'from-yellow-500/20 to-lime-500/20',
    borderColor: 'border-yellow-500/30',
    badgeColor: 'bg-yellow-500/10 text-yellow-500',
    image: 'education',
    popular: false,
  },
  {
    id: 8,
    title: 'Auto Repair Shop',
    category: 'Home & Auto',
    icon: Car,
    description: 'Auto shop website with service menu, online appointment booking, and service reminders',
    services: ['Online Appointment Booking', 'Service Menu with Pricing', 'Contact Form & Map'],
    color: 'from-slate-500/20 to-zinc-500/20',
    borderColor: 'border-slate-500/30',
    badgeColor: 'bg-slate-500/10 text-slate-400',
    image: 'auto-shop',
    popular: false,
  },
  {
    id: 9,
    title: 'Law Firm Website',
    category: 'Professional',
    icon: FileText,
    description: 'Professional law firm website with practice areas, free consultation offer, and contact form',
    services: ['Free Consultation Form', 'Practice Areas Showcase', 'Contact Form & Map'],
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
    badgeColor: 'bg-amber-500/10 text-amber-500',
    image: 'law-firm',
    popular: false,
  },
  {
    id: 10,
    title: 'Hair & Nail Salon',
    category: 'Beauty & Spa',
    icon: Sparkles,
    description: 'Stylish salon website with online booking, service menu, and gift card features',
    services: ['Online Appointment Booking', 'Photo Gallery (Portfolio)', 'Service Menu with Pricing'],
    color: 'from-fuchsia-500/20 to-pink-500/20',
    borderColor: 'border-fuchsia-500/30',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-500',
    image: 'beauty-salon',
    popular: true,
  },
  {
    id: 11,
    title: 'Veterinary Clinic',
    category: 'Healthcare',
    icon: Heart,
    description: 'Vet clinic website with online appointment booking, wellness plans, and pet care resources',
    services: ['Online Appointment Booking', 'Product Sales / E-commerce (Pet Supplies)', 'Contact Form & Map'],
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    badgeColor: 'bg-green-500/10 text-green-500',
    image: 'vet-clinic',
    popular: false,
  },
  {
    id: 12,
    title: 'Cleaning Service',
    category: 'Home & Auto',
    icon: HomeIcon,
    description: 'Residential & commercial cleaning website with instant quotes and online booking',
    services: ['Online Booking & Quotes', 'Service Menu with Pricing', 'Contact Form & Map'],
    color: 'from-teal-500/20 to-green-500/20',
    borderColor: 'border-teal-500/30',
    badgeColor: 'bg-teal-500/10 text-teal-500',
    image: 'cleaning',
    popular: false,
  },
];

// Website features/add-ons per business type (NOT business services - these are WEBSITE features)
const allServices: Record<number, string[]> = {
  1: ['Online Appointment Booking', 'Product Sales / E-commerce', 'Photo Gallery (Before & After)', 'Contact Form & Map', 'Patient Reviews & Testimonials', 'Insurance Info Page', 'Staff / Doctor Profiles', 'FAQ Section', 'Online Payment Integration', 'Emergency Contact Button'],
  2: ['Online Appointment Booking', 'Barber Schedule Management', 'Photo Gallery (Portfolio)', 'Contact Form & Map', 'Customer Reviews & Testimonials', 'Gift Cards / Vouchers', 'Service Menu with Pricing', 'Loyalty / Points Program', 'Staff Profiles', 'Social Media Integration'],
  3: ['Online Table Reservation', 'Food Menu Display', 'Online Ordering & Delivery', 'Contact Form & Map', 'Customer Reviews & Testimonials', 'Photo Gallery (Food & Ambiance)', 'Special Events & Promotions', 'Gift Cards', 'Catering Request Form', 'Loyalty / Rewards Program'],
  4: ['Online Appointment Booking', 'Product Sales / E-commerce', 'Before & After Photo Gallery', 'Contact Form & Map', 'Patient Reviews & Testimonials', 'Treatment Info Pages', 'Staff / Specialist Profiles', 'Online Payment Integration', 'Gift Cards / Vouchers', 'Newsletter / Email Signup'],
  5: ['Product Sales / E-commerce', 'Photo Gallery (Products)', 'Contact Form & Map', 'Customer Reviews & Testimonials', 'Weekly Specials / Promotions', 'Gift Cards', 'Newsletter / Email Signup', 'Social Media Integration', 'Store Locator / Hours', 'Loyalty / Rewards Program'],
  6: ['Property Listings Search', 'Contact Form & Map', 'Mortgage Calculator', 'Photo Gallery / Virtual Tours', 'Agent Profiles', 'Market Reports / Blog', 'Free Home Valuation Form', 'Neighborhood Guide', 'Schedule Viewing Form', 'Newsletter / Email Signup'],
  7: ['Course / Program Catalog', 'Online Registration & Enrollment', 'Contact Form & Map', 'Photo Gallery', 'Student / Parent Testimonials', 'Tutor Schedule & Booking', 'Workshop / Event Calendar', 'Progress Reports Portal', 'Payment Integration', 'FAQ Section'],
  8: ['Online Appointment Booking', 'Service Menu with Pricing', 'Contact Form & Map', 'Customer Reviews & Testimonials', 'Photo Gallery (Work Samples)', 'Service Reminders / Notifications', 'Fleet Service Request Form', 'FAQ Section', 'Staff / Mechanic Profiles', 'Special Offers / Coupons'],
  9: ['Free Consultation Form', 'Practice Areas Showcase', 'Contact Form & Map', 'Client Testimonials', 'Staff / Attorney Profiles', 'Case Evaluation Form', 'Blog / Legal Articles', 'Document Upload Portal', 'FAQ Section', 'Online Payment Integration'],
  10: ['Online Appointment Booking', 'Service Menu with Pricing', 'Photo Gallery (Portfolio)', 'Contact Form & Map', 'Customer Reviews & Testimonials', 'Gift Cards / Vouchers', 'Loyalty / Rewards Program', 'Staff Profiles', 'Social Media Integration', 'Bridal Package Customizer'],
  11: ['Online Appointment Booking', 'Product Sales / E-commerce (Pet Supplies)', 'Contact Form & Map', 'Photo Gallery (Facility & Pets)', 'Client Reviews & Testimonials', 'Staff / Vet Profiles', 'Wellness Plan Info Page', 'Emergency Contact Button', 'Pet Boarding / Daycare Booking', 'FAQ Section'],
  12: ['Online Booking & Quotes', 'Service Menu with Pricing', 'Contact Form & Map', 'Customer Reviews & Testimonials', 'Photo Gallery (Before & After)', 'Special Offers / Coupons', 'FAQ Section', 'Recurring Booking System', 'Service Area Map', 'Referral Program'],
};

const colorPalette = [
  { name: 'Emerald', primary: '#059669', secondary: '#14b8a6' },
  { name: 'Ocean Blue', primary: '#0284c7', secondary: '#38bdf8' },
  { name: 'Royal Purple', primary: '#7c3aed', secondary: '#a78bfa' },
  { name: 'Sunset Orange', primary: '#ea580c', secondary: '#fb923c' },
  { name: 'Rose Pink', primary: '#e11d48', secondary: '#fb7185' },
  { name: 'Midnight', primary: '#1e293b', secondary: '#475569' },
  { name: 'Gold', primary: '#b45309', secondary: '#f59e0b' },
  { name: 'Teal', primary: '#0d9488', secondary: '#2dd4bf' },
  { name: 'Crimson', primary: '#be123c', secondary: '#f43f5e' },
  { name: 'Forest', primary: '#15803d', secondary: '#4ade80' },
  { name: 'Slate', primary: '#475569', secondary: '#94a3b8' },
  { name: 'Indigo', primary: '#4f46e5', secondary: '#818cf8' },
  { name: 'Coral', primary: '#f97316', secondary: '#fdba74' },
  { name: 'Lavender', primary: '#8b5cf6', secondary: '#c4b5fd' },
  { name: 'Sky', primary: '#0ea5e9', secondary: '#7dd3fc' },
  { name: 'Burgundy', primary: '#881337', secondary: '#fda4af' },
  { name: 'Mint', primary: '#34d399', secondary: '#a7f3d0' },
  { name: 'Copper', primary: '#c2410c', secondary: '#f97316' },
  { name: 'Navy', primary: '#1e3a5f', secondary: '#3b82f6' },
  { name: 'Cherry Blossom', primary: '#db2777', secondary: '#f9a8d4' },
  { name: 'Olive', primary: '#65a30d', secondary: '#bef264' },
  { name: 'Charcoal', primary: '#374151', secondary: '#6b7280' },
  { name: 'Turquoise', primary: '#0891b2', secondary: '#67e8f9' },
  { name: 'Amber', primary: '#d97706', secondary: '#fcd34d' },
];

// Pricing Plans
interface PricingPlan {
  id: 'starter' | 'business' | 'premium';
  name: string;
  subtitle: string;
  price: number; // CAD
  originalPrice?: number;
  pages: string;
  includedFeatures: number;
  extraFeaturePrice: number;
  revisions: string;
  delivery: string;
  warranty: string;
  popular: boolean;
  badge: string;
  badgeColor: string;
  includedList: string[];
  highlights: string[];
  icon: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'Essential Launch',
    price: 499,
    pages: '1 Page',
    includedFeatures: 3,
    extraFeaturePrice: 30,
    revisions: '1 Round',
    delivery: '5 Business Days',
    warranty: '3 Months',
    popular: false,
    badge: 'Starter',
    badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    includedList: [
      'Professional 1-page website',
      '3 website features included',
      '.com domain (1 year included)',
      '3-year website hosting & operation',
      'SSL certificate & security',
      'Mobile responsive design',
      '1 revision round',
      '5 business day delivery',
      '3-month technical warranty',
      'Lifetime website ownership',
    ],
    highlights: [
      'Perfect for simple business presence',
      'Great for getting started online quickly',
    ],
    icon: 'rocket',
  },
  {
    id: 'business',
    name: 'Business',
    subtitle: 'Professional Growth',
    price: 899,
    originalPrice: 1099,
    pages: 'Up to 5 Pages',
    includedFeatures: 6,
    extraFeaturePrice: 30,
    revisions: '3 Rounds',
    delivery: '3 Business Days',
    warranty: '6 Months',
    popular: true,
    badge: 'Most Popular',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    includedList: [
      'Professional multi-page website (up to 5 pages)',
      '6 website features included',
      '.com domain (3 years included)',
      '3-year website hosting & operation',
      'SSL certificate & security',
      'Mobile responsive design',
      '3 revision rounds',
      '3 business day delivery (priority)',
      '6-month technical warranty',
      'Lifetime website ownership',
      'Google Maps integration',
      'Contact form & lead capture',
      'Basic SEO optimization',
      'Social media links integration',
    ],
    highlights: [
      'Best value for growing businesses',
      'Includes SEO & Google Maps setup',
    ],
    icon: 'trending-up',
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Enterprise Solution',
    price: 1499,
    originalPrice: 1999,
    pages: 'Up to 10 Pages',
    includedFeatures: 10,
    extraFeaturePrice: 0,
    revisions: 'Unlimited',
    delivery: '2 Business Days',
    warranty: '12 Months',
    popular: false,
    badge: 'Premium',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    includedList: [
      'Full multi-page website (up to 10 pages)',
      'All 10 website features included',
      '.com domain (3 years included)',
      '3-year website hosting & operation',
      'SSL certificate & security',
      'Mobile responsive design',
      'Unlimited revisions',
      '2 business day express delivery',
      '12-month technical warranty',
      'Lifetime website ownership',
      'Google Maps integration',
      'Advanced SEO optimization',
      'Google Analytics setup',
      'Social media integration',
      'Custom email setup (info@yourbusiness.com)',
      'Logo design included',
      'Priority 24/7 support',
    ],
    highlights: [
      'Complete enterprise-grade solution',
      'Maximum features & longest warranty',
    ],
    icon: 'crown',
  },
];

const categories = [
  { id: 'all', label: 'All', icon: Globe },
  { id: 'Healthcare', label: 'Healthcare', icon: Stethoscope },
  { id: 'Beauty & Spa', label: 'Beauty & Spa', icon: Scissors },
  { id: 'Food & Dining', label: 'Food & Dining', icon: Utensils },
  { id: 'Retail', label: 'Retail', icon: ShoppingBag },
  { id: 'Professional', label: 'Professional', icon: Building2 },
  { id: 'Education', label: 'Education', icon: GraduationCap },
  { id: 'Home & Auto', label: 'Home & Auto', icon: Users },
];

const features = [
  {
    icon: Monitor,
    title: 'Professional Website',
    description: 'Modern responsive design that works flawlessly on mobile, tablet, and desktop',
  },
  {
    icon: Server,
    title: '3-Year Website Operation',
    description: 'Your website stays live and running for 3 full years with 99.9% uptime guarantee',
  },
  {
    icon: Globe,
    title: '.com Domain',
    description: 'Your own domain name with your brand identity and free SSL certificate',
  },
  {
    icon: Database,
    title: 'Database',
    description: 'Complete database system for efficient content and data management',
  },
  {
    icon: Crown,
    title: 'Lifetime Ownership',
    description: 'The website is 100% yours — transfer to any hosting provider anytime',
  },
  {
    icon: Clock,
    title: '3-Day Delivery',
    description: 'From approval to delivery in just 3 business days',
  },
  {
    icon: Shield,
    title: 'SSL Certificate',
    description: 'Full encryption for your visitors\' data with the green security lock',
  },
  {
    icon: Zap,
    title: 'Blazing Fast',
    description: 'Performance optimization for exceptional loading speed and better SEO results',
  },
];

// Site preview images using gradient patterns
const sitePreviews: Record<string, string> = {
  'dental-clinic': 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #5eead4 100%)',
  'barbershop': 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fdba74 100%)',
  'restaurant': 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fda4af 100%)',
  'beauty-clinic': 'linear-gradient(135deg, #c026d3 0%, #d946ef 50%, #f0abfc 100%)',
  'ecommerce': 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #c4b5fd 100%)',
  'real-estate': 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #67e8f9 100%)',
  'education': 'linear-gradient(135deg, #ca8a04 0%, #eab308 50%, #fde047 100%)',
  'auto-shop': 'linear-gradient(135deg, #475569 0%, #64748b 50%, #94a3b8 100%)',
  'law-firm': 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fcd34d 100%)',
  'beauty-salon': 'linear-gradient(135deg, #c026d3 0%, #e879f9 50%, #f5d0fe 100%)',
  'vet-clinic': 'linear-gradient(135deg, #059669 0%, #10b981 50%, #6ee7b7 100%)',
  'cleaning': 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 50%, #99f6e4 100%)',
};

// Types
interface OrderItem {
  id: string;
  businessName: string;
  businessType: string;
  city: string;
  address?: string;
  phone: string;
  email: string;
  service1: string;
  service2: string;
  service3: string;
  selectedServices?: string;
  language?: string;
  selectedColor?: string;
  domain1: string;
  domain2?: string;
  domain3?: string;
  notes?: string;
  status: string;
  amount: number;
  createdAt: string;
  stripeSessionId?: string;
  promoCode?: string;
  discountAmount?: number;
  adminNotes?: string;
  paidAt?: string;
  deliveredAt?: string;
}

interface StatsData {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  inProgressOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

interface PromoCode {
  id: string;
  code: string;
  discountPercent: number | null;
  discountAmount: number | null;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  minOrderAmount: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  'pending': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'paid': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'in-progress': 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  'delivered': 'bg-green-500/10 text-green-600 border-green-500/20',
  'expired': 'bg-red-500/10 text-red-600 border-red-500/20',
};

const statusLabels: Record<string, string> = {
  'pending': 'Pending',
  'paid': 'Paid',
  'in-progress': 'In Progress',
  'delivered': 'Delivered',
  'expired': 'Expired',
};

// Currency conversion rates from CAD
const currencyRates: Record<string, { rate: number; symbol: string; code: string }> = {
  'CAD': { rate: 1, symbol: '$', code: 'CAD' },
  'USD': { rate: 0.74, symbol: '$', code: 'USD' },
  'BRL': { rate: 3.72, symbol: 'R$', code: 'BRL' },
  'EUR': { rate: 0.68, symbol: '€', code: 'EUR' },
  'GBP': { rate: 0.58, symbol: '£', code: 'GBP' },
  'MXN': { rate: 12.50, symbol: '$', code: 'MXN' },
  'AUD': { rate: 1.13, symbol: 'A$', code: 'AUD' },
  'INR': { rate: 61.50, symbol: '₹', code: 'INR' },
  'JPY': { rate: 109.00, symbol: '¥', code: 'JPY' },
};

// Domain extensions to check
const domainExtensions = ['.com', '.net', '.org', '.ca', '.co', '.io', '.store', '.online', '.site', '.biz'];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    language: 'English',
    workingHours: '',
    domain1: '',
    domain2: '',
    domain3: '',
    notes: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('Emerald');
  const [expandedColor, setExpandedColor] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imageLinks, setImageLinks] = useState<string[]>(['']);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<typeof products[0] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(pricingPlans[1]); // Default to Business

  // Admin & Payment state
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingOrder, setEditingOrder] = useState(false);
  const [editOrderData, setEditOrderData] = useState<Record<string, string>>({});
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment' | 'success'>('form');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Promo Code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ valid: boolean; code: string; discount: number } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [adminPromos, setAdminPromos] = useState<PromoCode[]>([]);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: '', discountPercent: '', discountAmount: '', maxUses: '100', expiresAt: '', minOrderAmount: '0' });

  // Admin tab state
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'products' | 'promos' | 'payments'>('overview');

  // Currency state
  const [userCurrency, setUserCurrency] = useState('CAD');
  const [currencyOpen, setCurrencyOpen] = useState(false);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string; content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Chat drag state
  const [chatPos, setChatPos] = useState({ x: 0, y: 600 });
  const [isDraggingChat, setIsDraggingChat] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [chatPanelPos, setChatPanelPos] = useState({ x: 0, y: 200 });
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const panelDragOffsetRef = useRef({ x: 0, y: 0 });

  // Initialize chat position to right side on mount
  const chatInitRef = useRef(false);
  useEffect(() => {
    if (!chatInitRef.current) {
      chatInitRef.current = true;
      const rightOffset = 24;
      setChatPos({ x: window.innerWidth - 56 - rightOffset, y: window.innerHeight - 100 });
      setChatPanelPos({ x: window.innerWidth - 380 - rightOffset, y: window.innerHeight - 500 });
    }
  }, []);

  // Chat drag handlers
  const handleChatDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragOffsetRef.current = { x: clientX - chatPos.x, y: clientY - chatPos.y };
    setIsDraggingChat(true);
  }, [chatPos]);

  const handlePanelDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    panelDragOffsetRef.current = { x: clientX - chatPanelPos.x, y: clientY - chatPanelPos.y };
    setIsDraggingPanel(true);
  }, [chatPanelPos]);

  useEffect(() => {
    if (!isDraggingChat && !isDraggingPanel) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      if (isDraggingChat) {
        setChatPos({
          x: Math.max(0, Math.min(window.innerWidth - 56, clientX - dragOffsetRef.current.x)),
          y: Math.max(0, Math.min(window.innerHeight - 56, clientY - dragOffsetRef.current.y)),
        });
      }
      if (isDraggingPanel) {
        setChatPanelPos({
          x: Math.max(0, Math.min(window.innerWidth - 400, clientX - panelDragOffsetRef.current.x)),
          y: Math.max(0, Math.min(window.innerHeight - 100, clientY - panelDragOffsetRef.current.y)),
        });
      }
    };
    const handleUp = () => {
      setIsDraggingChat(false);
      setIsDraggingPanel(false);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDraggingChat, isDraggingPanel]);

  // Auth state - using NextAuth
  const { data: session, status: sessionStatus } = useSession();
  const [signInOpen, setSignInOpen] = useState(false);

  // Domain search state
  const [domainSearch, setDomainSearch] = useState('');
  const [domainResults, setDomainResults] = useState<{domain: string; available: boolean; loading: boolean}[]>([]);
  const [domainSearching, setDomainSearching] = useState(false);

  // Auto-save state
  const [draftSaved, setDraftSaved] = useState(false);

  // Currency formatting function
  const formatPrice = (cadDollars: number): string => {
    const rate = currencyRates[userCurrency]?.rate || 1;
    const symbol = currencyRates[userCurrency]?.symbol || '$';
    const code = currencyRates[userCurrency]?.code || 'CAD';
    const converted = cadDollars * rate;
    if (code === 'JPY') return `${symbol}${Math.round(converted).toLocaleString()} ${code}`;
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${code}`;
  };

  // Detect user currency based on timezone
  useEffect(() => {
    setMounted(true);
    try {
      const savedCurrency = localStorage.getItem('webcraft_currency');
      if (savedCurrency && currencyRates[savedCurrency]) {
        setUserCurrency(savedCurrency);
      } else {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz.startsWith('America/New_York') || tz.startsWith('America/Chicago') || tz.startsWith('America/Denver') || tz.startsWith('America/Los_Angeles') || tz.startsWith('America/Phoenix')) setUserCurrency('USD');
        else if (tz.startsWith('America/Sao_Paulo') || tz.startsWith('America/Manaus')) setUserCurrency('BRL');
        else if (tz.startsWith('Europe/') || tz.startsWith('Atlantic/')) setUserCurrency('EUR');
        else if (tz.startsWith('Europe/London')) setUserCurrency('GBP');
        else if (tz.startsWith('America/Mexico_City') || tz.startsWith('America/Tijuana')) setUserCurrency('MXN');
        else if (tz.startsWith('Australia/')) setUserCurrency('AUD');
        else if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) setUserCurrency('INR');
        else if (tz.startsWith('Asia/Tokyo')) setUserCurrency('JPY');
        else if (tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver') || tz.startsWith('America/Winnipeg') || tz.startsWith('America/Halifax') || tz.startsWith('America/St_Johns') || tz.startsWith('America/Edmonton')) setUserCurrency('CAD');
      }

      // Load saved form data
      const savedFormData = localStorage.getItem('webcraft_form_data');
      if (savedFormData) {
        try { setFormData(JSON.parse(savedFormData)); } catch {}
      }
      const savedServices = localStorage.getItem('webcraft_selected_services');
      if (savedServices) {
        try { setSelectedServices(JSON.parse(savedServices)); } catch {}
      }
      const savedColor = localStorage.getItem('webcraft_selected_color');
      if (savedColor) setSelectedColor(savedColor);
    } catch {}
  }, []);

  // Auto-save form data
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('webcraft_form_data', JSON.stringify(formData));
      localStorage.setItem('webcraft_selected_services', JSON.stringify(selectedServices));
      localStorage.setItem('webcraft_selected_color', selectedColor);
      setDraftSaved(true);
      const timer = setTimeout(() => setDraftSaved(false), 2000);
      return () => clearTimeout(timer);
    } catch {}
  }, [formData, selectedServices, selectedColor, mounted]);

  // Save currency preference
  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem('webcraft_currency', userCurrency); } catch {}
    }
  }, [userCurrency, mounted]);

  // Chat scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Send chat message
  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: chatMessages }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, I could not process your request.' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please email us at info@webcraft.ca for assistance.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Sign-in state
  const [signInStep, setSignInStep] = useState<'choose' | 'signin' | 'signup'>('choose');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInName, setSignInName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setAuthError('Google sign-in failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Password sign-in handler
  const handleEmailSignIn = async () => {
    if (!signInEmail || !signInPassword) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const result = await signIn('credentials', {
        email: signInEmail,
        password: signInPassword,
        redirect: false,
      });
      if (result?.error) {
        setAuthError(result.error);
      } else {
        setSignInOpen(false);
        setSignInEmail('');
        setSignInPassword('');
        setSignInName('');
      }
    } catch {
      setAuthError('Sign-in failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Password sign-up handler
  const handleEmailSignUp = async () => {
    if (!signInName || !signInEmail || !signInPassword) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signInName, email: signInEmail, password: signInPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Registration failed');
        return;
      }
      // Auto sign-in after registration
      const result = await signIn('credentials', {
        email: signInEmail,
        password: signInPassword,
        redirect: false,
      });
      if (result?.error) {
        setAuthError(result.error);
      } else {
        setSignInOpen(false);
        setSignInEmail('');
        setSignInPassword('');
        setSignInName('');
      }
    } catch {
      setAuthError('Registration failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  // Domain availability search
  const searchDomainAvailability = async () => {
    const searchName = domainSearch.trim().replace(/\.[a-zA-Z]+$/, '');
    if (!searchName) return;
    setDomainSearching(true);
    const extensions = domainExtensions;
    const initialResults = extensions.map(ext => ({
      domain: `${searchName}${ext}`,
      available: false,
      loading: true,
    }));
    setDomainResults(initialResults);

    const results = await Promise.all(
      extensions.map(async (ext, i) => {
        const fullDomain = `${searchName}${ext}`;
        try {
          const res = await fetch(`/api/domain-check?domain=${encodeURIComponent(fullDomain)}`);
          const data = await res.json();
          return { domain: fullDomain, available: data.available ?? false, loading: false };
        } catch {
          return { domain: fullDomain, available: false, loading: false };
        }
      })
    );
    setDomainResults(results);
    setDomainSearching(false);
  };

  // Clear saved data after successful order
  const clearSavedFormData = () => {
    try {
      localStorage.removeItem('webcraft_form_data');
      localStorage.removeItem('webcraft_selected_services');
      localStorage.removeItem('webcraft_selected_color');
    } catch {}
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrderClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setPaymentStep('form');
    setSelectedPlan(pricingPlans[1]);
    const productServices = allServices[product.id] || product.services;
    setFormData({
      ...formData,
      businessType: product.category,
      language: 'English',
    });
    setSelectedServices(productServices.slice(0, 3));
    setSelectedColor('Emerald');
    setOrderDialogOpen(true);
  };

  const handlePreview = (product: typeof products[0]) => {
    setPreviewProduct(product);
    setPreviewOpen(true);
  };

  const calculatePrice = () => {
    const plan = selectedPlan;
    const planPrice = plan.price;
    const maxIncluded = plan.includedFeatures;
    const extraServices = Math.max(0, selectedServices.length - maxIncluded);
    const extraCost = extraServices * plan.extraFeaturePrice;
    const baseTotal = planPrice + extraCost;
    const discount = appliedPromo?.valid ? appliedPromo.discount : 0;
    return { basePrice: planPrice, maxIncluded, extraServices, extraCost, discount, totalPrice: Math.max(0, baseTotal - discount) };
  };

  // Restore admin session from localStorage
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const savedAdmin = typeof window !== 'undefined' ? localStorage.getItem('admin_data') : null;
    if (savedToken && savedAdmin) {
      setAdminToken(savedToken);
      setAdminLoggedIn(true);
    }
  }, []);

  // Fetch admin stats
  const fetchStats = useCallback(async () => {
    try {
      const token = adminToken || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null);
      if (!token) return;
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        // Token invalid, logout
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        setAdminToken(null);
        setAdminLoggedIn(false);
      }
    } catch {
      // silently fail
    }
  }, [adminToken]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const token = adminToken || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null);
      if (!token) return;
      const params = new URLSearchParams();
      if (orderStatusFilter !== 'all') params.set('status', orderStatusFilter);
      if (orderSearch) params.set('search', orderSearch);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      params.set('page', String(orderPage));
      params.set('limit', '20');
      const res = await fetch(`/api/orders?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        if (data.pagination) setOrderTotalPages(data.pagination.totalPages || 1);
      }
    } catch {
      // silently fail
    }
  }, [orderStatusFilter, orderSearch, orderPage, dateFrom, dateTo, adminToken]);

  // Fetch promo codes (admin)
  const fetchPromos = useCallback(async () => {
    try {
      const token = adminToken || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null);
      if (!token) return;
      const res = await fetch('/api/admin/promo-codes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminPromos(data.promoCodes || data || []);
      }
    } catch { /* silently */ }
  }, [adminToken]);

  // Validate promo code (customer-facing)
  const handleValidatePromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const { totalPrice } = calculatePrice();
      const res = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput.trim(), orderAmount: totalPrice * 100 }),
      });
      const data = await res.json();
      if (data.valid) {
        const discount = data.discountCalculated / 100;
        setAppliedPromo({ valid: true, code: promoInput.trim(), discount });
      } else {
        setAppliedPromo({ valid: false, code: promoInput.trim(), discount: 0 });
      }
    } catch {
      setAppliedPromo({ valid: false, code: promoInput.trim(), discount: 0 });
    } finally {
      setPromoLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'admin' && adminLoggedIn) {
      fetchOrders();
      fetchStats();
      if (adminTab === 'promos') fetchPromos();
    }
  }, [view, adminLoggedIn, fetchOrders, fetchStats, adminTab, fetchPromos]);

  // Admin login handler
  const handleAdminLogin = async () => {
    setAdminLoginError('');
    setAdminLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (res.ok && data.admin) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_data', JSON.stringify(data.admin));
        setAdminToken(data.token);
        setAdminLoggedIn(true);
        setAdminLoginOpen(false);
        setView('admin');
        setAdminEmail('');
        setAdminPassword('');
      } else {
        setAdminLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setAdminLoginError('Connection error. Please try again.');
    } finally {
      setAdminLoggingIn(false);
    }
  };

  // Admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    setAdminToken(null);
    setAdminLoggedIn(false);
    setOrders([]);
    setStats(null);
    setView('store');
  };

  // Get auth headers helper
  const getAuthHeaders = () => {
    const token = adminToken || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Submit order + proceed to payment (with promo code)
  const handleSubmitOrder = async () => {
    if (!formData.businessName || !formData.city || !formData.phone) return;
    setIsSubmittingOrder(true);
    const { totalPrice } = calculatePrice();
    const amountInCents = totalPrice * 100;
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          selectedServices,
          selectedColor,
          service1: selectedServices[0] || '',
          service2: selectedServices[1] || '',
          service3: selectedServices[2] || '',
          websiteType: selectedProduct?.title || formData.businessType || 'Custom Website',
          amount: amountInCents,
          promoCode: appliedPromo?.valid ? appliedPromo.code : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.url) {
          window.location.href = data.url;
        } else if (data.orderId || data.order?.id) {
          setCreatedOrderId(data.orderId || data.order.id);
          setPaymentStep('payment');
        }
      } else {
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            selectedServices,
            selectedColor,
            service1: selectedServices[0] || '',
            service2: selectedServices[1] || '',
            service3: selectedServices[2] || '',
            websiteType: selectedProduct?.title || formData.businessType || 'Custom Website',
            amount: amountInCents,
            promoCode: appliedPromo?.valid ? appliedPromo.code : undefined,
          }),
        });
        const orderData = await orderRes.json();
        if (orderRes.ok && orderData.order?.id) {
          setCreatedOrderId(orderData.order.id);
          setPaymentStep('payment');
        }
      }
    } catch {
      setCreatedOrderId('demo-' + Date.now());
      setPaymentStep('payment');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Demo payment
  const handleDemoPayment = async () => {
    setIsProcessingPayment(true);
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      if (createdOrderId && !createdOrderId.startsWith('demo-')) {
        await fetch(`/api/orders/${createdOrderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'paid' }),
        });
      }
    } catch {
      // silently fail
    }
    setIsProcessingPayment(false);
    setPaymentStep('success');
  };

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        if (selectedOrder) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        fetchOrders();
        fetchStats();
      }
    } catch {
      // silently fail
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
        setOrderDetailOpen(false);
        setSelectedOrder(null);
        fetchStats();
      }
    } catch { /* silently */ }
  };

  // Bulk status update
  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedOrders.length === 0) return;
    try {
      await Promise.all(selectedOrders.map(id =>
        fetch(`/api/orders/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ status: newStatus }),
        })
      ));
      setSelectedOrders([]);
      fetchOrders();
      fetchStats();
    } catch { /* silently */ }
  };

  // Save edited order
  const handleSaveEditOrder = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(editOrderData),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order || { ...selectedOrder, ...editOrderData });
        setEditingOrder(false);
        fetchOrders();
      }
    } catch { /* silently */ }
  };

  // Create promo code
  const handleCreatePromo = async () => {
    if (!newPromo.code.trim()) return;
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          code: newPromo.code.trim().toUpperCase(),
          discountPercent: newPromo.discountPercent ? parseInt(newPromo.discountPercent) : null,
          discountAmount: newPromo.discountAmount ? parseInt(newPromo.discountAmount) * 100 : null,
          maxUses: parseInt(newPromo.maxUses) || 100,
          expiresAt: newPromo.expiresAt || null,
          minOrderAmount: parseInt(newPromo.minOrderAmount) * 100 || 0,
        }),
      });
      if (res.ok) {
        setNewPromo({ code: '', discountPercent: '', discountAmount: '', maxUses: '100', expiresAt: '', minOrderAmount: '0' });
        fetchPromos();
      }
    } catch { /* silently */ }
  };

  // Delete promo code
  const handleDeletePromo = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/promo-codes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchPromos();
    } catch { /* silently */ }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Business', 'Type', 'City', 'Status', 'Amount', 'Currency', 'Date', 'Email', 'Phone'];
    const rows = orders.map(o => [
      o.id, o.businessName, o.businessType, o.city, o.status,
      (o.amount / 100).toFixed(2), o.currency || 'CAD', o.createdAt, o.email, o.phone
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webcraft-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export order to PDF
  const exportOrderToPDF = async (order: OrderItem) => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const orderServices = order.selectedServices
        ? (JSON.parse(order.selectedServices) as string[])
        : [order.service1, order.service2, order.service3].filter(Boolean);

      // Header
      doc.setFillColor(5, 150, 105);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('WebCraft', 20, 20);
      doc.setFontSize(11);
      doc.text('Order Details', 20, 30);

      // Order ID & Date
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(`Order ID: ${order.id}`, 140, 15);
      doc.text(`Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}`, 140, 22);

      // Status Badge
      const isPaid = order.status === 'paid' || order.status === 'delivered' || order.status === 'in-progress';
      if (isPaid) {
        doc.setFillColor(16, 185, 129);
      } else {
        doc.setFillColor(245, 158, 11);
      }
      doc.roundedRect(140, 26, 50, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(isPaid ? 'PAID' : 'PENDING', 165, 32, { align: 'center' });

      // Business Information
      let y = 55;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.text('Business Information', 20, y);
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const businessInfo = [
        ['Business Name', order.businessName || 'N/A'],
        ['Business Type', order.businessType || 'N/A'],
        ['City', order.city || 'N/A'],
        ['Address', order.address || 'N/A'],
        ['Phone', order.phone || 'N/A'],
        ['Email', order.email || 'N/A'],
        ['Language', order.language || 'English'],
        ['Color Scheme', order.selectedColor || 'N/A'],
      ];
      businessInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(`${label}:`, 25, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(String(value), 80, y);
        y += 7;
      });

      // Website Features
      y += 5;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.text('Website Features', 20, y);
      y += 10;
      doc.setFontSize(10);
      orderServices.forEach((service: string, i: number) => {
        const isIncluded = i < 3;
        doc.setTextColor(isIncluded ? 5 : 180, isIncluded ? 150 : 120, isIncluded ? 105 : 0);
        const marker = isIncluded ? '✓' : '+';
        doc.text(`${marker} ${service}${isIncluded ? ' (Included)' : ' (+$30 CAD)'}`, 25, y);
        y += 7;
      });

      // Domain Choices
      y += 5;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.text('Domain Choices', 20, y);
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const domains = [order.domain1, order.domain2, order.domain3].filter((d): d is string => Boolean(d));
      domains.forEach((d: string, i: number) => {
        doc.text(`${i + 1}. ${d}`, 25, y);
        y += 7;
      });

      // Notes
      if (order.notes || (selectedOrder?.notes)) {
        y += 5;
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(14);
        doc.text('Notes', 20, y);
        y += 10;
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(order.notes || '', 160);
        doc.text(lines, 25, y);
        y += lines.length * 6;
      }

      // Payment Summary
      y += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, 190, y);
      y += 10;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.text('Payment Summary', 20, y);
      y += 10;
      doc.setFontSize(10);
      const amount = (order.amount || 49900) / 100;
      // Dynamic base price based on plan
      const planPrice = order.amount ? Math.min(order.amount, 149900) : 89900;
      const basePrice = planPrice / 100;
      const extraCount = Math.max(0, orderServices.length - 6);
      const extraCost = extraCount * 30;
      doc.setTextColor(80, 80, 80);
      doc.text('Base Package (3 features):', 25, y);
      doc.text(`$${basePrice} CAD`, 160, y, { align: 'right' });
      y += 7;
      if (extraCount > 0) {
        doc.setTextColor(180, 120, 0);
        doc.text(`+${extraCount} extra feature${extraCount > 1 ? 's' : ''}:`, 25, y);
        doc.text(`+$${extraCost} CAD`, 160, y, { align: 'right' });
        y += 7;
      }
      doc.setDrawColor(200, 200, 200);
      doc.line(130, y, 190, y);
      y += 7;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text('Total:', 25, y);
      doc.text(`$${amount.toLocaleString()} CAD`, 160, y, { align: 'right' });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by WebCraft - Professional Websites for Local Businesses', 105, 285, { align: 'center' });

      doc.save(`WebCraft-Order-${order.id.substring(0, 8)}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    }
  };

  // Chart data from orders
  const getChartData = () => {
    const categoryCount: Record<string, number> = {};
    orders.forEach(order => {
      const type = order.businessType || 'Other';
      categoryCount[type] = (categoryCount[type] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
  };

  // Filtered orders for admin
  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const matchesSearch = !orderSearch ||
      order.businessName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.city?.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // ===================== STORE VIEW =====================
  const renderStore = () => (
    <>
      {/* Hero Section — Full-width image with icons overlay */}
      <section id="hero" className="relative w-full min-h-[100vh] md:min-h-[90vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero-image.webp"
            alt="Professional Web Design"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </div>

        {/* Floating action buttons (top-right corner) */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {/* Currency Selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1 h-8 px-2 bg-black/30 backdrop-blur-md text-white/90 hover:bg-black/50 hover:text-white border border-white/10"
              onClick={() => setCurrencyOpen(!currencyOpen)}
            >
              {currencyRates[userCurrency]?.symbol}{currencyRates[userCurrency]?.code}
            </Button>
            {currencyOpen && (
              <div className="absolute right-0 top-full mt-1 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                {Object.entries(currencyRates).map(([code, { symbol }]) => (
                  <button
                    key={code}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-white/10 transition-colors ${userCurrency === code ? 'text-orange-400 font-medium' : 'text-white/80'}`}
                    onClick={() => { setUserCurrency(code); setCurrencyOpen(false); }}
                  >
                    {symbol} {code}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full bg-black/30 backdrop-blur-md text-white/90 hover:bg-black/50 hover:text-white border border-white/10"
          >
            {mounted ? (theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <Sun className="h-4 w-4" />}
          </Button>

          {/* Sign In */}
          {session?.user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors pl-1.5 pr-3 py-1">
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-medium text-white/90 max-w-[80px] truncate">{session.user.name}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-semibold">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
                <div className="p-1">
                  <a href="#products" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                    <ShoppingBag className="h-4 w-4" /> My Orders
                  </a>
                  <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-red-600 dark:text-red-400 w-full">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-8 px-3 text-xs bg-black/30 backdrop-blur-md text-white/90 hover:bg-black/50 hover:text-white border border-white/10"
              onClick={() => { setSignInOpen(true); setSignInStep('choose'); setAuthError(''); }}
              disabled={sessionStatus === 'loading'}
            >
              <UserCircle className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">WebCraft</span>
            </div>
          </motion.div>

          {/* Navigation Links — Floating over image */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: 'Home', href: '#hero', icon: HomeIcon },
                { label: 'Packages', href: '#products', icon: ShoppingBag },
                { label: 'Pricing', href: '#pricing', icon: CreditCard },
                { label: 'Features', href: '#features', icon: Check },
                { label: 'Domains', href: '#domain-search', icon: Globe },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300"
                >
                  <item.icon className="h-4 w-4 text-orange-400" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </motion.nav>

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight max-w-5xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your Professional Website
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              in Just 3 Days
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-white/80 max-w-2xl text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Professional websites for local businesses across North America. Plans starting at {formatPrice(499)}.
            3-year hosting + domain + lifetime ownership included.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <a href="#pricing">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white gap-2 text-lg px-10 h-13 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300">
                Discover Packages
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
          </motion.div>

          {/* Feature Icons — Overlaid on image */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { icon: Monitor, title: 'Professional Website', desc: 'Modern responsive design' },
              { icon: Server, title: '3-Year Operation', desc: '99.9% uptime guaranteed' },
              { icon: Globe, title: '.com Domain', desc: 'Free SSL included' },
              { icon: Clock, title: '3-Day Delivery', desc: 'Fast turnaround' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mb-3 group-hover:from-orange-500/30 group-hover:to-amber-500/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-white/60 text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {[
              { value: '500+', label: 'NA Businesses' },
              { value: '3', label: 'Days Delivery' },
              { value: formatPrice(499).replace(/ [A-Z]+$/, ''), label: `Starting from ${userCurrency}` },
              { value: '100%', label: 'Ownership' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <a href="#pricing" className="text-white/40 hover:text-white/80 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">
              Choose Your Website Type
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Specialized websites for every type of local business. Each package includes 3 services + 3-year website operation + domain + lifetime ownership
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search website type..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`gap-1.5 ${selectedCategory === cat.id ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                >
                  <cat.icon className="h-3.5 w-3.5" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`group overflow-hidden border ${product.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col`}>
                  <div
                    className="relative h-48 overflow-hidden"
                    style={{ background: sitePreviews[product.image] }}
                  >
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <product.icon className="w-12 h-12 mx-auto mb-2 opacity-90" />
                        <div className="text-sm font-medium opacity-80">Website Preview</div>
                      </div>
                    </div>
                    {product.popular && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-amber-500 text-white border-0 gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-white/90 gap-2"
                        onClick={() => handleOrderClick(product)}
                      >
                        <Eye className="h-4 w-4" />
                        Order Now
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{product.title}</h3>
                        <Badge variant="secondary" className={`text-xs ${product.badgeColor}`}>
                          {product.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <Separator />
                      <div className="space-y-1.5">
                        <div className="text-xs font-medium text-muted-foreground">Key Website Features:</div>
                        {product.services.map((service, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0">
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(499)}</div>
                        <div className="text-xs text-muted-foreground">Starting from</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => handlePreview(product)}
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2"
                          onClick={() => handleOrderClick(product)}
                        >
                          <Zap className="h-4 w-4" />
                          Order
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground">Try different keywords or select another category</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What You Get</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for a professional website in one complete package
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow border-border/50">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Search Section */}
      <section id="domain-search" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Search Your Domain</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Check domain availability and find the perfect name for your business
            </p>
          </div>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Search Input */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Enter a name (e.g. mybusiness)"
                  className="pl-12 h-14 text-lg rounded-xl border-emerald-500/20 focus:border-emerald-500"
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') searchDomainAvailability(); }}
                />
              </div>
              <Button
                onClick={searchDomainAvailability}
                disabled={domainSearching || !domainSearch.trim()}
                className="h-14 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-base font-semibold"
              >
                {domainSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span className="ml-2">Search</span>
              </Button>
            </div>

            {/* Domain Results Grid */}
            {domainResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-emerald-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="h-5 w-5 text-emerald-500" />
                      <h3 className="font-bold text-lg">Availability Results</h3>
                      {domainSearching && (
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-500 ml-2" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {domainResults.map((result) => (
                        <div
                          key={result.domain}
                          className={`text-center p-3 rounded-lg border transition-colors ${
                            result.loading
                              ? 'bg-muted/30 border-border/50'
                              : result.available
                                ? 'bg-emerald-500/5 border-emerald-500/30'
                                : 'bg-red-500/5 border-red-500/20'
                          }`}
                        >
                          <div className="font-bold text-sm mb-1">
                            {result.domain.replace(domainSearch.trim().replace(/\.[a-zA-Z]+$/, ''), '')}
                          </div>
                          {result.loading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto" />
                          ) : result.available ? (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Available
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-red-500 dark:text-red-400 flex items-center justify-center gap-1">
                              <X className="h-3.5 w-3.5" /> Taken
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                      <Info className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        Search to check domain availability. We&apos;ll register your chosen domain as part of your package.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Info note when no results */}
            {domainResults.length === 0 && (
              <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                <Info className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Search to check domain availability. We&apos;ll register your chosen domain as part of your package.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 md:p-16 text-white text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Get Your Website?
              </h2>
              <p className="text-lg text-white/80">
                Don&apos;t let customers search for you on Google and not find you. Thousands of local businesses across North America lose customers every day because they have no online presence. Choose a plan that fits your business and get launched in as fast as 2 days.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="#products">
                  <Button size="lg" className="bg-white text-emerald-700 hover:bg-white/90 gap-2 text-lg px-8 h-12">
                    Order Your Website Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-white/70 pt-4">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  <span>3-Year Website Operation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  <span>.com Domain</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  <span>Lifetime Ownership</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              <Crown className="w-3.5 h-3.5 mr-1" />
              Done-For-You Digital Launch Service
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Choose Your Launch Plan</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              One-time payment. No monthly subscriptions. No hidden fees. Your website, fully built and launched — ready for customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className={`relative h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-[1.02] md:scale-105'
                    : 'border-border/50 hover:border-emerald-500/30 hover:shadow-md'
                }`}>
                  {/* Popular Ribbon */}
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
                  )}

                  <CardHeader className="pb-4 text-center">
                    {plan.popular && (
                      <Badge className="bg-emerald-500 text-white border-0 mb-2 gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {plan.badge}
                      </Badge>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-3">
                      {plan.icon === 'crown' ? (
                        <Crown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      ) : plan.icon === 'trending-up' ? (
                        <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
                    <div className="pt-3">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(plan.price)}</span>
                      </div>
                      {plan.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through mt-1">{formatPrice(plan.originalPrice)}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {/* Quick Stats */}
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                        <Monitor className="h-3 w-3 text-muted-foreground" />
                        {plan.pages}
                      </span>
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {plan.delivery}
                      </span>
                      <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        {plan.warranty}
                      </span>
                    </div>

                    <Separator />

                    {/* Included Features */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What&apos;s Included</p>
                      <div className="space-y-2">
                        {plan.includedList.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Highlights */}
                    <div className="space-y-1.5">
                      {plan.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3 text-amber-500 flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0">
                    <Button
                      className={`w-full gap-2 h-11 text-sm font-medium ${
                        plan.popular
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-background border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setSelectedProduct(null);
                        setPaymentStep('form');
                        setFormData({
                          ...formData,
                          businessType: '',
                          language: 'English',
                        });
                        setSelectedServices([]);
                        setSelectedColor('Emerald');
                        setOrderDialogOpen(true);
                      }}
                    >
                      {plan.popular ? (
                        <>
                          <Zap className="h-4 w-4" />
                          Get Started
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4" />
                          Choose Plan
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
            {[
              { icon: Shield, text: 'Secure Payment' },
              { icon: CheckCircle2, text: 'No Hidden Fees' },
              { icon: Clock, text: 'Fast Delivery' },
              { icon: Heart, text: 'Satisfaction Guaranteed' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-emerald-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Contact Us</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have a question or want a free consultation? We&apos;re here to help
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Email Us</h3>
                  <p className="text-muted-foreground">We typically respond within 24 hours</p>
                  <a href="mailto:info@webcraft.ca" className="inline-block">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2">
                      <Mail className="h-4 w-4" />
                      info@webcraft.ca
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-background to-emerald-950/5 border-t border-emerald-500/10 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                WebCraft
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} WebCraft. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Terms & Conditions
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground/40 hover:text-emerald-500 transition-colors"
                onClick={() => setAdminLoginOpen(true)}
                aria-label="Admin Login"
              >
                <Lock className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );

  // ===================== ADMIN DASHBOARD =====================
  const renderAdmin = () => (
    <>
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                WebCraft
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 ml-2">
                Admin
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full">
                {mounted ? (theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <Sun className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleAdminLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          {/* Admin Tabs */}
          <div className="flex gap-1 pb-3 -mt-1 overflow-x-auto">
            {([
              { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
              { id: 'orders' as const, label: 'Orders', icon: Package },
              { id: 'products' as const, label: 'Products', icon: ShoppingBag },
              { id: 'promos' as const, label: 'Promo Codes', icon: Tag },
              { id: 'payments' as const, label: 'Payments', icon: CreditCard },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  adminTab === tab.id
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* ====== OVERVIEW TAB ====== */}
        {adminTab === 'overview' && (
          <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold mt-1">{stats?.totalOrders ?? orders.length}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="text-3xl font-bold mt-1">{stats?.pendingOrders ?? orders.filter(o => o.status === 'pending').length}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-3xl font-bold mt-1">{formatPrice((stats?.totalRevenue ?? orders.filter(o => o.status === 'paid' || o.status === 'delivered').reduce((s, o) => s + (o.amount || 70000), 0)) / 100)}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Paid Orders</p>
                    <p className="text-3xl font-bold mt-1">{stats?.paidOrders ?? orders.filter(o => o.status === 'paid').length}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Orders by Business Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {getChartData().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
                      <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '13px',
                        }}
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
                      <p>No orders yet. Orders will appear here once customers place them.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
          </>
        )}

        {/* ====== ORDERS TAB ====== */}
        {adminTab === 'orders' && (
          <>
        {/* Orders Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  Orders
                </CardTitle>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Select value={orderStatusFilter} onValueChange={(v) => { setOrderStatusFilter(v); setOrderPage(1); }}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      className="pl-9 sm:w-[220px]"
                      value={orderSearch}
                      onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex" onClick={handleExportCSV}>
                    <Download className="h-3.5 w-3.5" /> CSV
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => { fetchOrders(); fetchStats(); }}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                          onCheckedChange={(checked) => {
                            setSelectedOrders(checked ? filteredOrders.map(o => o.id) : []);
                          }}
                        />
                      </TableHead>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden sm:table-cell">City</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Amount</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked) => {
                              setSelectedOrders(checked ? [...selectedOrders, order.id] : selectedOrders.filter(id => id !== order.id));
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs" onClick={() => { setSelectedOrder(order); setOrderDetailOpen(true); }}>
                          {order.id.length > 8 ? order.id.substring(0, 8) + '...' : order.id}
                        </TableCell>
                        <TableCell className="font-medium">{order.businessName || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary" className="text-xs">{order.businessType || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{order.city || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Badge className={`text-xs ${statusColors[order.status] || 'bg-gray-500/10 text-gray-500'}`}>
                              {statusLabels[order.status] || order.status}
                            </Badge>
                            {(order.status === 'paid' || order.status === 'delivered' || order.status === 'in-progress') && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20" title="Payment confirmed">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              </span>
                            )}
                            {order.status === 'pending' && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20" title="Payment pending">
                                <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-medium">
                          <span className={order.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : ''}>
                            {formatPrice((order.amount || 70000) / 100)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
                          <p>No orders found</p>
                          <p className="text-xs mt-1">Orders will appear here when customers place them from the storefront</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {orderTotalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {orderPage} of {orderTotalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={orderPage <= 1} onClick={() => setOrderPage(p => p - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={orderPage >= orderTotalPages} onClick={() => setOrderPage(p => p + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-sm font-medium">{selectedOrders.length} selected</span>
            <Select onValueChange={(v) => handleBulkStatusUpdate(v)}>
              <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="Change status..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Mark as Paid</SelectItem>
                <SelectItem value="in-progress">Mark as In Progress</SelectItem>
                <SelectItem value="delivered">Mark as Delivered</SelectItem>
                <SelectItem value="expired">Mark as Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setSelectedOrders([])}>Clear</Button>
          </motion.div>
        )}
          </>
        )}

        {/* ====== PRODUCTS TAB ====== */}
        {adminTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-border/50 overflow-hidden">
                  {/* Product Preview Image */}
                  <div className={`h-36 bg-gradient-to-br ${sitePreviews[product.image] || 'from-gray-500 to-gray-600'} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                        <product.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    {product.popular && (
                      <Badge className="absolute top-3 right-3 bg-emerald-500 text-white text-xs">Popular</Badge>
                    )}
                    <Badge className="absolute top-3 left-3 bg-black/40 text-white text-xs backdrop-blur-sm">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm">{product.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Included Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.services.slice(0, 3).map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">{s.split(' ').slice(0, 2).join(' ')}</Badge>
                        ))}
                        {product.services.length > 3 && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">+{product.services.length - 3}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">$499+</span>
                        <span className="text-xs text-muted-foreground ml-1">CAD</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                        <Check className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* ====== PROMO CODES TAB ====== */}
        {adminTab === 'promos' && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5 text-emerald-500" />
                Promo Codes
              </h3>
              <Button size="sm" className="gap-1.5" onClick={() => setPromoDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Create Promo
              </Button>
            </div>
            {adminPromos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminPromos.map((promo) => (
                  <Card key={promo.id} className="border-border/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-bold bg-muted px-2 py-1 rounded">{promo.code}</code>
                        <Badge className={promo.isActive ? 'bg-emerald-500/10 text-emerald-600 text-xs' : 'bg-red-500/10 text-red-500 text-xs'}>
                          {promo.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>Discount: <strong>{promo.discountPercent ? `${promo.discountPercent}%` : `${((promo.discountAmount || 0) / 100).toFixed(2)} CAD`}</strong></p>
                        <p className="text-muted-foreground">Used: {promo.usedCount} / {promo.maxUses}</p>
                        {promo.expiresAt && <p className="text-muted-foreground text-xs">Expires: {new Date(promo.expiresAt).toLocaleDateString()}</p>}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <Progress value={(promo.usedCount / promo.maxUses) * 100} className="h-2 flex-1 mr-3" />
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeletePromo(promo.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Tag className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p>No promo codes yet. Create one to offer discounts.</p>
                </CardContent>
              </Card>
            )}

            {/* Create Promo Dialog */}
            <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Promo Code</DialogTitle>
                  <DialogDescription>Create a new discount code for customers</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label>Code</Label>
                    <Input placeholder="e.g. SUMMER2026" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Discount %</Label>
                      <Input type="number" placeholder="e.g. 15" value={newPromo.discountPercent} onChange={e => setNewPromo({...newPromo, discountPercent: e.target.value, discountAmount: ''})} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Discount $</Label>
                      <Input type="number" placeholder="e.g. 50" value={newPromo.discountAmount} onChange={e => setNewPromo({...newPromo, discountAmount: e.target.value, discountPercent: ''})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Max Uses</Label>
                      <Input type="number" value={newPromo.maxUses} onChange={e => setNewPromo({...newPromo, maxUses: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Min Order ($)</Label>
                      <Input type="number" value={newPromo.minOrderAmount} onChange={e => setNewPromo({...newPromo, minOrderAmount: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Expires At (optional)</Label>
                    <Input type="date" value={newPromo.expiresAt} onChange={e => setNewPromo({...newPromo, expiresAt: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPromoDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreatePromo} disabled={!newPromo.code.trim() || (!newPromo.discountPercent && !newPromo.discountAmount)}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* ====== PAYMENTS TAB ====== */}
        {adminTab === 'payments' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-emerald-500" />
                    Payment Transactions
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportCSV}>
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orders.filter(o => o.status === 'paid' || o.status === 'delivered').length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Promo</TableHead>
                        <TableHead>Date Paid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.filter(o => o.status === 'paid' || o.status === 'delivered').map(order => (
                        <TableRow key={order.id} className="cursor-pointer" onClick={() => { setSelectedOrder(order); setOrderDetailOpen(true); }}>
                          <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                          <TableCell className="font-medium">{order.businessName}</TableCell>
                          <TableCell className="font-semibold text-emerald-600">
                            {formatPrice((order.amount - (order.discountAmount || 0)) / 100)}
                            {order.discountAmount && order.discountAmount > 0 && (
                              <span className="text-xs text-muted-foreground ml-1 line-through">{formatPrice(order.amount / 100)}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[order.status] || ''}>{statusLabels[order.status] || order.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {order.promoCode ? (
                              <Badge variant="secondary" className="text-xs">{order.promoCode}</Badge>
                            ) : <span className="text-xs text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p>No paid orders yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

      </main>

      {/* Admin Footer */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">WebCraft Admin Dashboard</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground gap-1.5 hover:text-red-500"
              onClick={handleAdminLogout}
            >
              <LogOut className="h-3 w-3" />
              Logout
            </Button>
          </div>
        </div>
      </footer>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {view === 'store' ? renderStore() : renderAdmin()}

      {/* AI Chatbot - Draggable Floating Button & Panel */}
      {view === 'store' && (
        <>
          {/* Floating Toggle Button - Draggable */}
          {!chatOpen && (
            <motion.div
              className="fixed z-50 cursor-grab active:cursor-grabbing touch-none select-none"
              style={{ left: chatPos.x, top: chatPos.y }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 1 }}
              onMouseDown={handleChatDragStart}
              onTouchStart={handleChatDragStart}
            >
              <button
                onClick={(e) => { if (!isDraggingChat) setChatOpen(true); }}
                className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center transition-all hover:scale-105"
                aria-label="AI Chat"
              >
                <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400/20" />
                <MessageSquare className="h-6 w-6 relative z-10" />
                <span className="absolute -top-1 -right-1 bg-teal-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">AI</span>
              </button>
            </motion.div>
          )}

          {/* Chat Panel - Draggable */}
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                className="fixed z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/20 border border-emerald-500/20"
                style={{ left: chatPanelPos.x, top: chatPanelPos.y }}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Drag Handle + Header */}
                <div
                  className="bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-700 px-4 pt-3 pb-3 cursor-grab active:cursor-grabbing touch-none select-none relative"
                  onMouseDown={handlePanelDragStart}
                  onTouchStart={handlePanelDragStart}
                >
                  {/* Drag indicator dots */}
                  <div className="flex justify-center mb-2">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-white/40" />
                      <div className="w-1 h-1 rounded-full bg-white/40" />
                      <div className="w-1 h-1 rounded-full bg-white/40" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white leading-tight">WebCraft AI</h3>
                        <p className="text-[10px] text-white/70">Ask anything about our services</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">Online</span>
                      <button
                        onClick={() => setChatOpen(false)}
                        className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                      >
                        <X className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="bg-background max-h-[350px] min-h-[250px] overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-8 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                        <Bot className="h-6 w-6 text-emerald-500/60" />
                      </div>
                      <p className="font-medium text-foreground/80">Hi! I&apos;m the WebCraft AI assistant</p>
                      <p className="text-xs">Ask me about our services, pricing, or delivery timeline!</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-br-md'
                          : 'bg-muted border border-border rounded-bl-md'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-muted border border-border rounded-2xl rounded-bl-md px-4 py-2.5">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-background border-t border-border p-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me anything..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      className="flex-1 rounded-xl border-emerald-500/20 focus:border-emerald-500/50 h-10 text-sm"
                    />
                    <button
                      onClick={handleSendChat}
                      disabled={!chatInput.trim() || chatLoading}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-md shadow-emerald-500/20"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Sign-In Dialog */}
      <Dialog open={signInOpen} onOpenChange={(open) => { setSignInOpen(open); if (!open) { setAuthError(''); setSignInEmail(''); setSignInPassword(''); setSignInName(''); } }}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {/* Header Gradient */}
          <div className="relative bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-700 px-6 pt-8 pb-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome to WebCraft</h2>
              <p className="text-sm text-white/80 mt-1">
                {signInStep === 'choose' ? 'Sign in to manage your orders' : signInStep === 'signin' ? 'Sign in with your email' : 'Create your account'}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 -mt-6">
            {/* White card overlapping the gradient */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-5 space-y-4">
              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {authError}
                </div>
              )}

              {signInStep === 'choose' && (
                <>
                  {/* Google Sign In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground">or sign in with email</span>
                    </div>
                  </div>

                  {/* Email Sign In */}
                  <button
                    onClick={() => { setSignInStep('signin'); setAuthError(''); }}
                    className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 transition-all duration-200 text-sm font-medium text-white shadow-sm hover:shadow-md"
                  >
                    <Mail className="h-5 w-5" />
                    Sign In with Email
                  </button>

                  {/* Sign Up Link */}
                  <div className="text-center pt-1">
                    <span className="text-sm text-muted-foreground">Don&apos;t have an account? </span>
                    <button
                      onClick={() => { setSignInStep('signup'); setAuthError(''); }}
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}

              {signInStep === 'signin' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="pl-10 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailSignIn()}
                        className="pl-10 pr-10 h-11 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={handleEmailSignIn}
                    disabled={!signInEmail || !signInPassword || authLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white h-11 rounded-xl"
                  >
                    {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                  </Button>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => { setSignInStep('choose'); setAuthError(''); }}
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back
                    </button>
                    <button
                      onClick={() => { setSignInStep('signup'); setAuthError(''); }}
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Create Account
                    </button>
                  </div>
                </>
              )}

              {signInStep === 'signup' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        placeholder="Your full name"
                        value={signInName}
                        onChange={(e) => setSignInName(e.target.value)}
                        className="pl-10 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="pl-10 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailSignUp()}
                        className="pl-10 pr-10 h-11 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={handleEmailSignUp}
                    disabled={!signInName || !signInEmail || !signInPassword || authLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white h-11 rounded-xl"
                  >
                    {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4 mr-2" /> Create Account</>}
                  </Button>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => { setSignInStep('choose'); setAuthError(''); }}
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back
                    </button>
                    <button
                      onClick={() => { setSignInStep('signin'); setAuthError(''); }}
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Already have an account?
                    </button>
                  </div>
                </>
              )}

              <p className="text-xs text-center text-muted-foreground pt-1">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin Login Dialog */}
      <Dialog open={adminLoginOpen} onOpenChange={setAdminLoginOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-500" />
              Admin Login
            </DialogTitle>
            <DialogDescription>
              Enter your admin credentials to access the dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {adminLoginError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                {adminLoginError}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="adminEmail">Email</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@webcraft.ca"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adminPassword">Password</Label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setAdminLoginOpen(false); setAdminLoginError(''); }}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2"
              onClick={handleAdminLogin}
              disabled={adminLoggingIn}
            >
              {adminLoggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order / Payment Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setPaymentStep('form');
          setCreatedOrderId('');
        }
        setOrderDialogOpen(open);
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {paymentStep === 'form' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  {selectedProduct ? (
                    <>
                      <selectedProduct.icon className="h-5 w-5 text-emerald-500" />
                      Order: {selectedProduct.title}
                    </>
                  ) : (
                    <>
                      <Crown className="h-5 w-5 text-emerald-500" />
                      Order: {selectedPlan.name} Plan — {selectedPlan.subtitle}
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct
                    ? `Customize your ${selectedProduct.title} website and proceed to payment`
                    : 'Fill in your business details, choose features, and proceed to payment'
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Plan Selection */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-1.5">
                    <Crown className="h-4 w-4 text-emerald-500" />
                    Select Your Plan
                  </h4>
                  <p className="text-xs text-muted-foreground">Choose the plan that best fits your business needs</p>
                  <div className="grid grid-cols-3 gap-2">
                    {pricingPlans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(plan);
                          // Auto-adjust services to plan limit
                          if (selectedProduct) {
                            const planServices = allServices[selectedProduct.id] || selectedProduct.services;
                            setSelectedServices(planServices.slice(0, Math.min(plan.includedFeatures, planServices.length)));
                          }
                        }}
                        className={`relative rounded-xl border p-3 text-center transition-all ${
                          selectedPlan.id === plan.id
                            ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20'
                            : 'border-border hover:border-emerald-500/30 hover:bg-muted/50'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                            <Badge className="bg-emerald-500 text-white text-[8px] px-1.5 py-0 border-0">Popular</Badge>
                          </div>
                        )}
                        <p className="font-semibold text-xs">{plan.name}</p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatPrice(plan.price)}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{plan.pages}</p>
                        <p className="text-[10px] text-muted-foreground">{plan.includedFeatures} features included</p>
                      </button>
                    ))}
                  </div>
                </div>

                {!selectedProduct && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Website / Business Type</h4>
                      <p className="text-xs text-muted-foreground">Select your business type so we can tailor the website features for you</p>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {products.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setSelectedProduct(product);
                              const productServices = allServices[product.id] || product.services;
                              setSelectedServices(productServices.slice(0, Math.min(selectedPlan.includedFeatures, productServices.length)));
                              setFormData({ ...formData, businessType: product.category });
                            }}
                            className={`flex items-center gap-2 rounded-lg border p-2.5 text-left transition-colors ${
                              formData.businessType === product.category
                                ? 'border-emerald-500/50 bg-emerald-500/10'
                                : 'border-border hover:border-emerald-500/30 hover:bg-muted/50'
                            }`}
                          >
                            <product.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{product.title}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{product.category}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Business Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Business Information</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="businessName">Business / Clinic / Shop Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="e.g. Smile Dental Clinic"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="e.g. Toronto, ON"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          placeholder="(416) XXX-XXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="info@example.ca"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="language" className="flex items-center gap-1.5">
                        <Languages className="h-3.5 w-3.5" />
                        Website Language
                      </Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => setFormData({ ...formData, language: value })}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="Arabic">Arabic</SelectItem>
                          <SelectItem value="Chinese (Simplified)">Chinese (Simplified)</SelectItem>
                          <SelectItem value="Portuguese">Portuguese</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Services */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Select Website Features {selectedProduct ? `for ${selectedProduct.title}` : ''}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {Math.min(selectedServices.length, selectedPlan.includedFeatures)}/{selectedPlan.includedFeatures} included
                      {selectedServices.length > selectedPlan.includedFeatures && selectedPlan.extraFeaturePrice > 0 && (
                        <span className="text-amber-600 dark:text-amber-400 ml-1">
                          (+{selectedServices.length - selectedPlan.includedFeatures} extra = +{formatPrice((selectedServices.length - selectedPlan.includedFeatures) * selectedPlan.extraFeaturePrice)})
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Choose the website features you need. The first {selectedPlan.includedFeatures} are included in the {selectedPlan.name} plan. {selectedPlan.extraFeaturePrice > 0 ? `Each additional feature adds ${formatPrice(selectedPlan.extraFeaturePrice)}.` : 'All features are included!'}</p>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                    {(selectedProduct
                      ? (allServices[selectedProduct.id] || selectedProduct.services)
                      : formData.businessType
                        ? (() => {
                            const matchingProducts = products.filter(p => p.category === formData.businessType);
                            const baseProduct = matchingProducts[0];
                            return baseProduct ? (allServices[baseProduct.id] || baseProduct.services) : [];
                          })()
                        : []
                    ).map((service) => {
                      const isSelected = selectedServices.includes(service);
                      const serviceIndex = isSelected ? selectedServices.indexOf(service) : -1;
                      const isIncluded = serviceIndex >= 0 && serviceIndex < selectedPlan.includedFeatures;
                      const isExtra = serviceIndex >= selectedPlan.includedFeatures;
                      return (
                        <label
                          key={service}
                          className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                            isIncluded
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : isExtra
                              ? 'bg-amber-500/10 border-amber-500/30'
                              : 'hover:bg-muted/50 border-border'
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedServices([...selectedServices, service]);
                              } else {
                                setSelectedServices(selectedServices.filter((s) => s !== service));
                              }
                            }}
                          />
                          <span className="text-sm flex-1">{service}</span>
                          {isIncluded && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10">Included</span>
                          )}
                          {isExtra && (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium px-2 py-0.5 rounded-full bg-amber-500/10">+{formatPrice(selectedPlan.extraFeaturePrice).replace(/ [A-Z]+$/, '')}</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Color Palette */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5" />
                    Color Palette
                  </h4>
                  <p className="text-xs text-muted-foreground">Choose the primary color scheme for your website. Click to preview details.</p>

                  {/* Color Squares Grid */}
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                    {colorPalette.map((color) => {
                      const isExpanded = expandedColor === color.name;
                      const isSelected = selectedColor === color.name;
                      return (
                        <motion.button
                          key={color.name}
                          type="button"
                          layout
                          className={`relative flex flex-col items-center rounded-xl transition-all overflow-hidden ${
                            isSelected
                              ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-background'
                              : 'hover:ring-1 hover:ring-border'
                          }`}
                          onClick={() => {
                            setSelectedColor(color.name);
                            setExpandedColor(isExpanded ? null : color.name);
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Main Color Square */}
                          <div
                            className={`w-full aspect-square shadow-sm transition-all ${isExpanded ? 'rounded-t-xl' : 'rounded-xl'}`}
                            style={{ background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})` }}
                          />

                          {/* Selected Checkmark */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/90 dark:bg-black/60 flex items-center justify-center shadow">
                              <Check className="h-2.5 w-2.5 text-emerald-600" />
                            </div>
                          )}

                          {/* Color Name Label */}
                          <span className="text-[9px] text-muted-foreground text-center leading-tight pt-1 pb-0.5 w-full">{color.name}</span>

                          {/* Expanded Detail Panel */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full overflow-hidden bg-card border-t border-border rounded-b-xl"
                              >
                                <div className="p-2 space-y-1.5">
                                  {/* Primary Color Swatch */}
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded shadow-sm flex-shrink-0" style={{ backgroundColor: color.primary }} />
                                    <span className="text-[8px] text-muted-foreground font-mono">{color.primary}</span>
                                    <button
                                      type="button"
                                      className="ml-auto p-0.5 rounded hover:bg-muted/50"
                                      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(color.primary); }}
                                    >
                                      <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                                    </button>
                                  </div>
                                  {/* Secondary Color Swatch */}
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded shadow-sm flex-shrink-0" style={{ backgroundColor: color.secondary }} />
                                    <span className="text-[8px] text-muted-foreground font-mono">{color.secondary}</span>
                                    <button
                                      type="button"
                                      className="ml-auto p-0.5 rounded hover:bg-muted/50"
                                      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(color.secondary); }}
                                    >
                                      <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                                    </button>
                                  </div>
                                  {/* Gradient Preview Bar */}
                                  <div
                                    className="w-full h-2 rounded-full shadow-sm"
                                    style={{ background: `linear-gradient(90deg, ${color.primary}, ${color.secondary})` }}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Expanded Color Preview Bar (large view for selected color) */}
                  {selectedColor && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl overflow-hidden border border-border shadow-sm"
                    >
                      {(() => {
                        const sel = colorPalette.find(c => c.name === selectedColor);
                        if (!sel) return null;
                        return (
                          <div className="flex h-10">
                            <div className="flex-1" style={{ backgroundColor: sel.primary }} />
                            <div className="flex-1" style={{ backgroundColor: sel.secondary }} />
                          </div>
                        );
                      })()}
                      <div className="px-3 py-1.5 bg-muted/30 flex items-center justify-between">
                        <span className="text-xs font-medium">{selectedColor}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {(() => {
                            const sel = colorPalette.find(c => c.name === selectedColor);
                            return sel ? `${sel.primary} → ${sel.secondary}` : '';
                          })()}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Separator />

                {/* Domain */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Domain Selection (3 Options)
                  </h4>
                  <p className="text-xs text-muted-foreground">Price includes a .com or .net domain. Other extensions available at additional cost</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="domain1">First Choice *</Label>
                      <Input
                        id="domain1"
                        placeholder="example.com"
                        value={formData.domain1}
                        onChange={(e) => setFormData({ ...formData, domain1: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="domain2">Second Choice</Label>
                      <Input
                        id="domain2"
                        placeholder="example.net"
                        value={formData.domain2}
                        onChange={(e) => setFormData({ ...formData, domain2: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="domain3">Third Choice</Label>
                      <Input
                        id="domain3"
                        placeholder="example-center.com"
                        value={formData.domain3}
                        onChange={(e) => setFormData({ ...formData, domain3: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Logo Upload */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1.5">
                    <ImagePlus className="h-3.5 w-3.5" />
                    Logo Upload
                  </h4>
                  <p className="text-xs text-muted-foreground">Upload your business logo to be used on your website</p>
                  <div className="flex items-center gap-4">
                    {/* Drop Zone */}
                    <label
                      className={`relative flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 ${
                        logoPreview ? 'border-emerald-500/30' : 'border-border'
                      }`}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-full h-full object-contain p-2 rounded-xl"
                        />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground/50 mb-1" />
                          <span className="text-[10px] text-muted-foreground text-center px-1">
                            Click or drag to upload
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogoFile(file);
                            const reader = new FileReader();
                            reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {/* Preview Info & Remove */}
                    <div className="flex-1 space-y-2">
                      {logoPreview ? (
                        <>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-medium">Logo uploaded</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {logoFile?.name} ({logoFile ? (logoFile.size / 1024).toFixed(1) : '0'} KB)
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                            onClick={() => {
                              setLogoPreview(null);
                              setLogoFile(null);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Remove Logo
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Supported formats: PNG, JPG, SVG, WebP
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Recommended: 512x512px, transparent background
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Image Links */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5" />
                    Image Links
                  </h4>
                  <p className="text-xs text-muted-foreground">Add URLs for images you want displayed on your website (gallery, products, portfolio, etc.)</p>
                  <div className="space-y-2">
                    {imageLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={link}
                            onChange={(e) => {
                              const updated = [...imageLinks];
                              updated[idx] = e.target.value;
                              setImageLinks(updated);
                            }}
                            className="pl-8 text-sm"
                          />
                        </div>
                        {imageLinks.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-red-500"
                            onClick={() => setImageLinks(imageLinks.filter((_, i) => i !== idx))}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/50"
                      onClick={() => setImageLinks([...imageLinks, ''])}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Image Link
                    </Button>
                  </div>
                  {/* Image Preview Thumbnails */}
                  {imageLinks.some(l => l.trim()) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imageLinks.filter(l => l.trim()).map((link, idx) => (
                        <div key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border shadow-sm">
                          <img
                            src={link}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.classList.add('bg-muted', 'flex', 'items-center', 'justify-center');
                              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-[8px] text-muted-foreground">Invalid</span>';
                            }}
                          />
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Download className="h-4 w-4 text-white" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Notes */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Additional Notes
                  </h4>
                  <p className="text-xs text-muted-foreground">Any special requests, additional details, or instructions for your website</p>
                  <Textarea
                    placeholder="e.g. I want a dark theme, specific design preferences, additional pages needed, branding guidelines..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1.5">
                      {selectedPlan.name} Plan
                      <Badge className={`text-[9px] px-1.5 py-0 ${selectedPlan.badgeColor}`}>{selectedPlan.badge}</Badge>
                      {selectedProduct && <span className="text-xs text-muted-foreground ml-1">• {selectedProduct.title}</span>}
                    </span>
                    <span className="font-medium">{formatPrice(selectedPlan.price)}</span>
                  </div>
                  {calculatePrice().extraServices > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-amber-600 dark:text-amber-400">
                        +{calculatePrice().extraServices} extra feature{calculatePrice().extraServices > 1 ? 's' : ''}
                      </span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">+{formatPrice(calculatePrice().extraCost)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Includes: 3-year website operation + domain + lifetime ownership</span>
                  </div>
                  <Separator />

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Promo code"
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value); setAppliedPromo(null); }}
                          className="pl-8 h-9 text-sm"
                          disabled={!!appliedPromo?.valid}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9"
                        onClick={appliedPromo?.valid ? () => { setAppliedPromo(null); setPromoInput(''); } : handleValidatePromo}
                        disabled={promoLoading || (!promoInput.trim() && !appliedPromo?.valid)}
                      >
                        {promoLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : appliedPromo?.valid ? <X className="h-3.5 w-3.5" /> : 'Apply'}
                      </Button>
                    </div>
                    {appliedPromo && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${
                          appliedPromo.valid
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {appliedPromo.valid ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Code "{appliedPromo.code}" applied! -{formatPrice(appliedPromo.discount)}
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            Invalid or expired promo code
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Total</span>
                    <span className="text-xl">{formatPrice(calculatePrice().totalPrice)}</span>
                  </div>
                  {draftSaved && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                      <Check className="h-3 w-3 text-emerald-500" />
                      Draft saved
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOrderDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2"
                  onClick={handleSubmitOrder}
                  disabled={isSubmittingOrder || !formData.businessName || !formData.city || !formData.phone || (!selectedProduct && !formData.businessType) || selectedServices.length === 0}
                >
                  {isSubmittingOrder ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  Proceed to Payment
                </Button>
              </DialogFooter>
            </>
          )}

          {paymentStep === 'payment' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                  Demo Payment
                </DialogTitle>
                <DialogDescription>
                  This is a demo checkout. No real charges will be made.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Order Summary */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <h4 className="font-medium text-sm">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Business</span>
                      <span className="font-medium">{formData.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span>{formData.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City</span>
                      <span>{formData.city}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                      <span>Total</span>
                      <span className="text-xl">{formatPrice(calculatePrice().totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Demo Card Form */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Payment Details (Demo)</h4>
                  <div className="space-y-1.5">
                    <Label>Card Number</Label>
                    <Input placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Expiry</Label>
                      <Input placeholder="12/28" defaultValue="12/28" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>CVC</Label>
                      <Input placeholder="123" defaultValue="123" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cardholder Name</Label>
                    <Input placeholder="John Doe" defaultValue="Demo Customer" />
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPaymentStep('form')}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2 min-w-[180px]"
                  onClick={handleDemoPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay {formatPrice(calculatePrice().totalPrice)}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {paymentStep === 'success' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-center flex flex-col items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </motion.div>
                  Payment Successful!
                </DialogTitle>
                <DialogDescription className="text-center">
                  Your order has been confirmed and payment received. We&apos;ll start building your website right away.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm font-medium">{createdOrderId}</p>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(calculatePrice().totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Paid</Badge>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">What happens next?</p>
                  <p className="text-xs text-muted-foreground">
                    1. We&apos;ll review your details within 24 hours<br />
                    2. You&apos;ll receive a confirmation email<br />
                    3. Your website will be ready in 3 business days
                  </p>
                </div>
              </div>

              <DialogFooter className="justify-center">
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2"
                  onClick={() => {
                    setOrderDialogOpen(false);
                    setPaymentStep('form');
                    setCreatedOrderId('');
                    setFormData({
                      businessName: '',
                      businessType: '',
                      city: '',
                      address: '',
                      phone: '',
                      email: '',
                      language: 'English',
                      workingHours: '',
                      domain1: '',
                      domain2: '',
                      domain3: '',
                      notes: '',
                    });
                    setSelectedServices([]);
                    setSelectedColor('Emerald');
                    clearSavedFormData();
                  }}
                >
                  <Globe className="h-4 w-4" />
                  Back to Store
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-500" />
              Website Preview
            </DialogTitle>
            <DialogDescription>
              Preview of your {previewProduct?.title || 'website'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Browser Chrome */}
            <div className="rounded-xl border border-border overflow-hidden shadow-lg">
              <div className="bg-muted/80 border-b border-border px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
                  www.{(formData.businessName || previewProduct?.title || 'yourbusiness').toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                </div>
              </div>

              {/* Website Content */}
              <div className="bg-background">
                {/* Header */}
                <div
                  className="px-6 py-3 flex items-center justify-between text-white"
                  style={{ background: `linear-gradient(135deg, ${colorPalette.find(c => c.name === selectedColor)?.primary || '#059669'}, ${colorPalette.find(c => c.name === selectedColor)?.secondary || '#14b8a6'})` }}
                >
                  <div className="font-bold text-sm">
                    {formData.businessName || previewProduct?.title || 'Your Business'}
                  </div>
                  <div className="flex gap-4 text-xs opacity-80">
                    <span>Home</span>
                    <span>Services</span>
                    <span>About</span>
                    <span>Contact</span>
                  </div>
                </div>

                {/* Hero Section */}
                <div
                  className="px-6 py-12 text-center text-white relative"
                  style={{ background: `linear-gradient(135deg, ${colorPalette.find(c => c.name === selectedColor)?.primary || '#059669'}, ${colorPalette.find(c => c.name === selectedColor)?.secondary || '#14b8a6'})` }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative space-y-3">
                    <h2 className="text-xl font-bold">
                      Welcome to {formData.businessName || previewProduct?.title || 'Your Business'}
                    </h2>
                    <p className="text-xs opacity-80 max-w-xs mx-auto">
                      Providing exceptional {previewProduct?.category?.toLowerCase() || 'business'} services to our community
                    </p>
                    <button
                      className="text-xs bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-md transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>

                {/* Services Section */}
                <div className="px-6 py-6">
                  <h3 className="text-sm font-bold text-center mb-4">Our Services</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedServices.slice(0, 3).map((service, i) => (
                      <div key={i} className="text-center p-3 rounded-lg border border-border">
                        <div
                          className="w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-[10px]"
                          style={{ backgroundColor: colorPalette.find(c => c.name === selectedColor)?.primary || '#059669' }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-xs font-medium">{service}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Section */}
                <div
                  className="px-6 py-4 text-center text-white"
                  style={{ backgroundColor: colorPalette.find(c => c.name === selectedColor)?.primary || '#059669' }}
                >
                  <p className="text-xs font-medium mb-1">Contact Us</p>
                  <p className="text-[10px] opacity-80">
                    {formData.city || 'Your City'} • {formData.phone || '(000) 000-0000'}
                  </p>
                </div>
              </div>
            </div>

            {/* Color & Language Info */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <Palette className="h-3 w-3" />
                {selectedColor}
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <Languages className="h-3 w-3" />
                {formData.language}
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <Check className="h-3 w-3" />
                {selectedServices.length} services
              </Badge>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewOpen(false)}
            >
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2"
              onClick={() => {
                setPreviewOpen(false);
                if (previewProduct) handleOrderClick(previewProduct);
              }}
            >
              <Zap className="h-4 w-4" />
              Order This Website
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog (Admin) */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              Order Details
            </DialogTitle>
            <DialogDescription>
              Order ID: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-4">
              {/* Status & Payment Indicator */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-muted/50 rounded-xl p-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-sm ${statusColors[selectedOrder.status] || 'bg-gray-500/10 text-gray-500'}`}>
                      {statusLabels[selectedOrder.status] || selectedOrder.status}
                    </Badge>
                    {(selectedOrder.status === 'paid' || selectedOrder.status === 'delivered' || selectedOrder.status === 'in-progress') ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Payment Confirmed
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 text-xs gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Not Paid
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value)}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  {updatingStatus && <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />}
                </div>
              </div>

              {/* Business Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Business Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Business Name</p>
                    <p className="font-medium">{selectedOrder.businessName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Business Type</p>
                    <p className="font-medium">{selectedOrder.businessType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">City</p>
                    <p className="font-medium">{selectedOrder.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.phone || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.email || 'N/A'}</p>
                  </div>
                  {selectedOrder.address && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedOrder.address}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Language</p>
                    <p className="font-medium">{selectedOrder.language || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Color Scheme</p>
                    <div className="flex items-center gap-2">
                      {selectedOrder.selectedColor && (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ background: `linear-gradient(135deg, ${colorPalette.find(c => c.name === selectedOrder.selectedColor)?.primary || '#059669'}, ${colorPalette.find(c => c.name === selectedOrder.selectedColor)?.secondary || '#14b8a6'})` }}
                        />
                      )}
                      <p className="font-medium">{selectedOrder.selectedColor || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Website Features */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Website Features</h4>
                <div className="space-y-2">
                  {selectedOrder.selectedServices
                    ? (JSON.parse(selectedOrder.selectedServices) as string[]).map((s: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          {i < 3 ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium px-1.5 py-0.5 rounded bg-amber-500/10">+{formatPrice(30).replace(/ [A-Z]+$/, '')}</span>
                          )}
                          <span>{s}</span>
                          {i < 3 && <span className="text-xs text-muted-foreground ml-auto">Included</span>}
                        </div>
                      ))
                    : [selectedOrder.service1, selectedOrder.service2, selectedOrder.service3].filter(Boolean).map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span>{s}</span>
                          <span className="text-xs text-muted-foreground ml-auto">Included</span>
                        </div>
                      ))
                  }
                </div>
              </div>

              <Separator />

              {/* Domains */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Domain Choices</h4>
                <div className="space-y-2 text-sm">
                  {[selectedOrder.domain1, selectedOrder.domain2, selectedOrder.domain3].filter(Boolean).map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-emerald-500" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Notes
                    </h4>
                    <p className="text-sm bg-muted/50 rounded-lg p-3">{selectedOrder.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Payment */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Payment</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{formatPrice((selectedOrder.amount || 70000) / 100)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOrderDetailOpen(false)}>
              Close
            </Button>
            {selectedOrder && (
              <Button
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white gap-2"
                onClick={() => exportOrderToPDF(selectedOrder)}
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
