import { Wallet, ExternalLink, CreditCard, Settings, BarChart3, FileText, CheckCircle, Copy, Link2, Zap, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { adminApi } from '../services/api';

const STRIPE_DASHBOARD = 'https://dashboard.stripe.com';

const products = {
  beta: {
    name: 'Programme Beta',
    productId: 'prod_UGGpBeP4weFUdS',
    priceId: 'price_1THkHmDCOBdlhvWv7a96XUat',
    price: '5,00',
    paymentLink: 'https://buy.stripe.com/7sY6oH7ywajjfci7wK0ZW00',
  },
  pro: {
    name: 'Plan Pro',
    productId: 'prod_UGGxG1PTkJoPRr',
    priceId: 'price_1THkPLDCOBdlhvWvg7CJisO1',
    launchPriceId: 'price_1THkPYDCOBdlhvWvvPEzEOok',
    price: '19,99',
    launchPrice: '9,99',
    paymentLink: 'https://buy.stripe.com/eVq7sLf0Y7777JQeZc0ZW01',
    launchPaymentLink: 'https://buy.stripe.com/eVqbJ18CA2QRggmbN00ZW02',
  },
};

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); toast.success(`${label} copie`); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copie' : 'Copier'}
    </button>
  );
}

function ProductCard({ product, isLaunch }: { product: typeof products.pro; isLaunch?: boolean }) {
  const p = product as any;
  const activeLink = isLaunch && p.launchPaymentLink ? p.launchPaymentLink : p.paymentLink;
  const activePrice = isLaunch && p.launchPrice ? p.launchPrice : p.price;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
        <div className="text-right">
          {isLaunch && p.launchPrice && (
            <span className="text-sm text-gray-400 line-through mr-2">{p.price} EUR</span>
          )}
          <span className="text-xl font-black text-gray-900">{activePrice} EUR</span>
          <span className="text-xs text-gray-400">/mois</span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
          <span className="text-gray-500">Product ID</span>
          <div className="flex items-center gap-1"><code className="text-xs text-gray-400">{p.productId}</code><CopyBtn text={p.productId} label="ID" /></div>
        </div>
        <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
          <span className="text-gray-500">Price ID</span>
          <div className="flex items-center gap-1"><code className="text-xs text-gray-400">{isLaunch && p.launchPriceId ? p.launchPriceId : p.priceId}</code><CopyBtn text={isLaunch && p.launchPriceId ? p.launchPriceId : p.priceId} label="Price" /></div>
        </div>
        <div className="flex justify-between items-center py-1.5">
          <span className="text-gray-500 flex items-center gap-1"><Link2 className="w-3.5 h-3.5 text-green-500" /> Payment Link</span>
          <div className="flex items-center gap-1">
            <CopyBtn text={activeLink} label="Lien" />
            <a href={activeLink} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline flex items-center gap-0.5">Ouvrir <ExternalLink className="w-3 h-3" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StripePage() {
  const [launchMode, setLaunchMode] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getSettings().then(s => setLaunchMode(s.launch_mode || false)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleLaunch = async () => {
    setToggling(true);
    try {
      const updated = await adminApi.updateSettings({ launch_mode: !launchMode });
      setLaunchMode(updated.launch_mode);
      toast.success(updated.launch_mode ? 'Offre de lancement ACTIVEE — Pro a 9,99 EUR' : 'Offre de lancement DESACTIVEE — Pro a 19,99 EUR');
    } catch (err: any) { toast.error(err.message); }
    finally { setToggling(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stripe</h1>
        <p className="text-gray-500 text-sm mt-1">Paiements et abonnements</p>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Wallet className="w-5 h-5" /></div>
          <div>
            <h2 className="font-bold">Stripe connecte</h2>
            <p className="text-white/70 text-xs">Blankonta (acct_1T2h5BDCOBdlhvWv)</p>
          </div>
        </div>
        <a href={STRIPE_DASHBOARD} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium">
          Dashboard <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Launch mode toggle */}
      <div className={`rounded-xl border-2 p-5 flex items-center justify-between transition-colors ${launchMode ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-3">
          <Zap className={`w-6 h-6 ${launchMode ? 'text-orange-500' : 'text-gray-400'}`} />
          <div>
            <h3 className="font-bold text-gray-900">Offre de lancement</h3>
            <p className="text-sm text-gray-500">
              {launchMode
                ? 'ACTIVE — Le Plan Pro est affiche a 9,99 EUR/mois (au lieu de 19,99 EUR) sur le site et les liens de paiement'
                : 'Desactive — Le Plan Pro est au tarif normal de 19,99 EUR/mois'}
            </p>
          </div>
        </div>
        <button onClick={toggleLaunch} disabled={toggling} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${launchMode ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          {toggling ? <Loader2 className="w-4 h-4 animate-spin" /> : launchMode ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          {launchMode ? 'Desactiver' : 'Activer'}
        </button>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 gap-4">
        <ProductCard product={products.beta} />
        <ProductCard product={products.pro} isLaunch={launchMode} />
      </div>

      {/* Flow */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Parcours utilisateur</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { step: '1', label: 'Lead arrive', sub: 'LP ou formulaire' },
            { step: '2', label: 'Invitation', sub: 'bouton dans Leads' },
            { step: '3', label: 'Inscription', sub: 'blankonta.fr/app/signup' },
            { step: '4', label: 'Paiement', sub: 'via lien Stripe' },
            { step: '5', label: 'Plan active', sub: 'webhook Stripe' },
          ].map(({ step, label, sub }, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">{step}</div>
                <p className="text-xs font-semibold text-gray-900 mt-1 text-center">{label}</p>
                <p className="text-[10px] text-gray-400 text-center max-w-24">{sub}</p>
              </div>
              {i < 4 && <div className="w-8 h-px bg-gray-300 mt-[-20px]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { href: `${STRIPE_DASHBOARD}/payments`, icon: CreditCard, label: 'Paiements', sub: 'Tous les paiements' },
          { href: `${STRIPE_DASHBOARD}/subscriptions`, icon: Settings, label: 'Abonnements', sub: 'Abonnements actifs' },
          { href: `${STRIPE_DASHBOARD}/invoices`, icon: FileText, label: 'Factures', sub: 'Factures PDF' },
          { href: `${STRIPE_DASHBOARD}/analytics`, icon: BarChart3, label: 'Analytics', sub: 'MRR, churn, revenus' },
        ].map(({ href, icon: Icon, label, sub }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 transition-colors group">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-5 h-5 text-purple-500" />
              <h4 className="font-bold text-gray-900">{label}</h4>
              <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 ml-auto" />
            </div>
            <p className="text-sm text-gray-500">{sub}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
