import { Wallet, ExternalLink, CreditCard, ArrowRight, Settings, BarChart3, Users, FileText } from 'lucide-react';

export function StripePage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stripe</h1>
        <p className="text-gray-500 text-sm mt-1">Gestion des paiements et des abonnements</p>
      </div>

      {/* Status card */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Integration Stripe</h2>
            <p className="text-white/70 text-sm">Pret a etre configure</p>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">
          Connecte ton compte Stripe pour activer la facturation automatique, les abonnements recurrents,
          et le portail client. Les plans definis dans l'onglet "Plans" seront synchronises avec Stripe.
        </p>
      </div>

      {/* Todo list */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <h3 className="px-6 py-4 font-bold text-gray-900">Etapes de configuration</h3>

        <div className="px-6 py-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">1</div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Creer un compte Stripe</p>
            <p className="text-xs text-gray-500">Inscription gratuite, verification d'identite requise</p>
          </div>
          <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg font-medium">
            Ouvrir Stripe <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="px-6 py-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">2</div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Recuperer les cles API</p>
            <p className="text-xs text-gray-500">STRIPE_SECRET_KEY et STRIPE_PUBLISHABLE_KEY depuis le dashboard Stripe</p>
          </div>
          <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg font-medium">
            Cles API <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="px-6 py-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">3</div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Ajouter les cles au .env du backend</p>
            <p className="text-xs text-gray-500 font-mono">STRIPE_SECRET_KEY=sk_live_... et STRIPE_WEBHOOK_SECRET=whsec_...</p>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">4</div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Creer les produits/prix dans Stripe</p>
            <p className="text-xs text-gray-500">Synchroniser les plans Blankonta avec des Products Stripe (recurrent monthly)</p>
          </div>
        </div>

        <div className="px-6 py-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">5</div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Configurer les webhooks</p>
            <p className="text-xs text-gray-500">Endpoint: https://blankonta.fr/api/stripe/webhook pour checkout.session.completed, invoice.paid, customer.subscription.deleted</p>
          </div>
        </div>
      </div>

      {/* Future features preview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold text-gray-900">Checkout</h4>
          </div>
          <p className="text-sm text-gray-500">Page de paiement hebergee par Stripe. L'utilisateur choisit un plan et paie directement.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold text-gray-900">Portail client</h4>
          </div>
          <p className="text-sm text-gray-500">Les utilisateurs gerent leur abonnement (upgrade, downgrade, annulation) via le portail Stripe.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold text-gray-900">Metriques</h4>
          </div>
          <p className="text-sm text-gray-500">MRR, churn rate, LTV, et cohorts directement depuis les donnees Stripe.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold text-gray-900">Factures</h4>
          </div>
          <p className="text-sm text-gray-500">Generation automatique de factures PDF avec TVA, envoyees par email aux clients.</p>
        </div>
      </div>
    </div>
  );
}
