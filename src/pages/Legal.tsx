import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function Legal() {
  const [activeTab, setActiveTab] = useState<'tos' | 'privacy'>('tos')

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Informations Légales</h1>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('tos')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'tos' ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
            >
              Conditions d'Utilisation
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'privacy' ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
            >
              Politique de Confidentialité
            </button>
          </div>
        </div>

        <div className="card p-8 md:p-12 prose prose-slate max-w-none">
          {activeTab === 'tos' ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">Conditions Générales d'Utilisation (CGU)</h2>
              <p className="text-slate-500 mb-4">Dernière mise à jour : 28 Avril 2026</p>
              
              <h3 className="text-lg font-bold mt-8 mb-4">1. Acceptation des conditions</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                En accédant et en utilisant la plateforme eJobSmart, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
              </p>

              <h3 className="text-lg font-bold mt-8 mb-4">2. Description des services</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                eJobSmart est une plateforme de mise en relation entre candidats, freelances et recruteurs en Afrique de l'Ouest. Nous proposons des services de dépôt d'offres d'emploi, de gestion de candidatures, de formations professionnelles et de recherche de talents.
              </p>

              <h3 className="text-lg font-bold mt-8 mb-4">3. Comptes utilisateurs</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Pour utiliser certains services, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de vos identifiants de connexion et de toutes les activités effectuées sous votre compte.
              </p>

              <h3 className="text-lg font-bold mt-8 mb-4">4. Propriété intellectuelle</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Tous les contenus présents sur la plateforme (textes, logos, graphismes, logiciels) sont la propriété exclusive d'eJobSmart ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-6">Politique de Confidentialité</h2>
              <p className="text-slate-500 mb-4">Dernière mise à jour : 28 Avril 2026</p>

              <h3 className="text-lg font-bold mt-8 mb-4">1. Collecte des données</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Nous collectons les informations que vous nous fournissez lors de votre inscription (nom, email, CV, etc.) ainsi que des données sur votre utilisation de la plateforme afin d'améliorer nos services.
              </p>

              <h3 className="text-lg font-bold mt-8 mb-4">2. Utilisation des données</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Vos données sont utilisées pour traiter vos candidatures, vous proposer des offres pertinentes, gérer vos abonnements et assurer la sécurité de votre compte.
              </p>

              <h3 className="text-lg font-bold mt-8 mb-4">3. Partage des données</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Vos données de profil et votre CV sont partagés avec les entreprises auxquelles vous postulez ou, si vous avez activé l'option de visibilité, avec les recruteurs premium recherchant des profils comme le vôtre.
              </p>

              <h3 className="text-lg font-bold mt-8 mb-4">4. Vos droits</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Conformément aux réglementations sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez exercer ces droits depuis votre tableau de bord ou en nous contactant.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
