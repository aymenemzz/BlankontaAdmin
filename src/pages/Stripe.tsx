import { Wallet, ExternalLink, CreditCard, Settings, BarChart3, FileText, CheckCircle, Copy, Link2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const STRIPE_DASHBOARD = 'https://dashboard.stripe.com';
const BETA_PAYMENT_LINK = 'https://buy.stripe.com/7sY6oH7ywajjfci7wK0ZW00';
const STRIPE_PRODUCT_ID = 'prod_UGGpBeP4weFUdS';
const STRIPE_PRICE_ID = 'price_1THkHmDCOBdlhvWv7a96XUat';

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copie`);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copie !' : 'Copier'}
    </button>
  );
}

export function StripePage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stripe</h1>
        <p className="text-gray-500 text-sm mt-1">Paiements et abonnements</p>
      </div>

      {/* Status card */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Stripe connecte</h2>
              <p className="text-white/70 text-sm">Compte : Blankonta (acct_1T2h5BDCOBdlhvWv)</p>
            </div>
          </div>
          <a href={STRIPE_DASHBOARD} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            Dashboard Stripe <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Produit + Prix + Payment Link */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <h3 className="px-6 py-4 font-bold text-gray-900">Produit Programme Beta</h3>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Produit Stripe</p>
              <p className="text-xs font-mono text-gray-400 mt-0.5">{STRIPE_PRODUCT_ID}</p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text={STRIPE_PRODUCT_ID} label="Product ID" />
              <a href={`${STRIPE_DASHBOARD}/products/${STRIPE_PRODUCT_ID}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-purple-600 hover:underline flex items-center gap-1">Voir <ExternalLink className="w-3 h-3" /></a>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Prix : <strong>5,00 EUR/mois</strong> (recurrent)</p>
              <p className="text-xs font-mono text-gray-400 mt-0.5">{STRIPE_PRICE_ID}</p>
            </div>
            <CopyButton text={STRIPE_PRICE_ID} label="Price ID" />
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-green-500" /> Lien de paiement
              </p>
              <p className="text-xs text-blue-600 mt-0.5 break-all">{BETA_PAYMENT_LINK}</p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text={BETA_PAYMENT_LINK} label="Payment link" />
              <a href={BETA_PAYMENT_LINK} target="_blank" rel="noopener noreferrer"
                className="text-xs text-purple-600 hover:underline flex items-center gap-1">Ouvrir <ExternalLink className="w-3 h-3" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Flow */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Parcours utilisateur</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { step: '1', label: 'Lead arrive', sub: 'via LP ou formulaire Beta' },
            { step: '2', label: 'Tu cliques "Inviter"', sub: 'dans l\'onglet Leads' },
            { step: '3', label: 'Email envoye', sub: 'avec lien inscription + paiement' },
            { step: '4', label: 'Lead s\'inscrit', sub: 'sur blankonta.fr/app/signup' },
            { step: '5', label: 'Lead paye', sub: 'via le lien Stripe' },
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
        <a href={`${STRIPE_DASHBOARD}/payments`} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold text-gray-900">Paiements</h4>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 ml-auto" />
          </div>
          <p className="text-sm text-gray-500">Voir tous les paiements recus</p>
        </a>
        <a href={`${STRIPE_DASHBOARD}/subscriptions`} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold text-gray-900">Abonnements</h4>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 ml-auto" />
          </div>
          <p className="text-sm text-gray-500">Gerer les abonnements actifs</p>
        </a>
        <a href={`${STRIPE_DASHBOARD}/invoices`} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold text-gray-900">Factures</h4>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 ml-auto" />
          </div>
          <p className="text-sm text-gray-500">Factures generees automatiquement</p>
        </a>
        <a href={`${STRIPE_DASHBOARD}/analytics`} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold text-gray-900">Analytics</h4>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 ml-auto" />
          </div>
          <p className="text-sm text-gray-500">MRR, churn, revenus en temps reel</p>
        </a>
      </div>
    </div>
  );
}
