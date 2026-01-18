import Link from 'next/link';

export default function Home() {
  const programs = [
    {
      slug: 'declic-durable',
      title: 'Déclic Durable',
      description: 'Pour retrouver votre énergie et votre santé en douceur',
      color: 'from-green-500 to-emerald-600',
    },
    {
      slug: 'systeme-apex',
      title: 'Le Système Apex',
      description: 'Performance maximale pour professionnels exigeants',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      slug: 'elan-senior',
      title: 'Élan Senior',
      description: 'Restez actif, autonome et en forme',
      color: 'from-amber-500 to-orange-600',
    },
    {
      slug: 'renaissance',
      title: 'Renaissance',
      description: 'Reprise post-partum en toute sécurité',
      color: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header with Login Button */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Fitbuddy
          </Link>
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
          >
            Mon Espace
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Bienvenue chez{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Fitbuddy
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Coaching sport et santé en visio, depuis n'importe où. Choisissez le programme qui correspond à vos besoins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((program) => (
            <Link
              key={program.slug}
              href={`/${program.slug}`}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${program.color} rounded-xl mb-6 group-hover:scale-110 transition-transform`}></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{program.description}</p>
              <span className="inline-flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-4 transition-all">
                En savoir plus
                <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
