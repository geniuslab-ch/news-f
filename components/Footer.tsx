export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-gradient mb-4">
                            Fitbuddy
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Coaching sport et santé en visio depuis n'importe où. Transformez votre vie avec un accompagnement personnalisé.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <p className="text-sm">
                            Email:{' '}
                            <a href="mailto:contact@fitbuddy.ch" className="text-primary-400 hover:text-primary-300 transition">
                                contact@fitbuddy.ch
                            </a>
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/legal/mentions-legales" className="hover:text-primary-400 transition">
                                    Mentions légales
                                </a>
                            </li>
                            <li>
                                <a href="/legal/privacy-policy" className="hover:text-primary-400 transition">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="/legal/terms" className="hover:text-primary-400 transition">
                                    Terms & Conditions
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Fitbuddy. Tous droits réservés.</p>
                    <p className="mt-2 text-xs text-gray-500">
                        Les programmes Fitbuddy ne remplacent pas un avis médical. Consultez votre médecin avant de commencer tout programme d'exercice.
                    </p>
                </div>
            </div>
        </footer>
    );
}
