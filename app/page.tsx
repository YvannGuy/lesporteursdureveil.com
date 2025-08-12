
'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Email soumis:', email); // Debug log
    
    // Validation côté client
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.log('Email invalide:', email); // Debug log
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    
    setIsLoading(true);
    setError('');
      
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de l\'envoi');
        }

        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setEmail('');
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.readdy.ai/image/da957b73b52f8479bc0334fc9a75f115/7ab1f371a2fe9061d74310d6b4621da9.jfif')`
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg mx-auto text-center text-white">
          {/* Logo/Title */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="https://static.readdy.ai/image/da957b73b52f8479bc0334fc9a75f115/05bb09dd6544aea5d74e442c0951e0da.png" 
                alt="Logo" 
                className="w-16 h-16 mr-4 animate-pulse"
              />
              <h1 className="font-[`Satoshi`] text-5xl md:text-6xl font-bold text-yellow-300 whitespace-nowrap">
                Porteur de Réveil
              </h1>
            </div>
            <h2 className="text-xl md:text-2xl text-white/90">
              Formation et sortie d'évangélisation
            </h2>
          </div>

          {/* Coming Soon Message */}
          <div className="mb-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <i className="ri-time-line w-5 h-5 flex items-center justify-center mr-2 text-yellow-300"></i>
              <span className="text-lg font-semibold">Bientôt Disponible</span>
            </div>
            
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
              Soyez informé de l'ouverture des inscriptions
            </p>
          </div>

          {/* Email Subscription Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            {!isSubmitted ? (
              <form id="email-signup" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-sm disabled:opacity-50"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-500/20 border border-red-400 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    'M\'informer de l\'ouverture'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="bg-green-500/20 border border-green-400 rounded-lg p-6">
                  <i className="ri-check-line w-8 h-8 flex items-center justify-center mx-auto mb-3 text-green-400 text-2xl"></i>
                  <p className="text-green-400 font-semibold text-lg">Merci !</p>
                  <p className="text-white/80 text-sm mt-2">
                    Votre inscription a été enregistrée (mode test)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
