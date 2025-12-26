// Sales Footer Component
import { Link } from 'react-router-dom'

export default function SalesFooter() {
    return (
        <footer className="py-16 px-6 border-t border-white/5 bg-zinc-950">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/venta" className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">✨</span>
                            <span className="text-white font-bold text-xl">Life OS</span>
                        </Link>
                        <p className="text-white/40 text-sm">
                            El sistema operativo para tu vida.
                            Hecho con obsesión por el detalle.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Producto</h4>
                        <ul className="space-y-2">
                            <li><Link to="/venta/features" className="text-white/50 hover:text-white text-sm transition-colors">Características</Link></li>
                            <li><Link to="/venta/precios" className="text-white/50 hover:text-white text-sm transition-colors">Precios</Link></li>
                            <li><Link to="/demo" className="text-white/50 hover:text-white text-sm transition-colors">Demo</Link></li>
                            <li><Link to="/register" className="text-white/50 hover:text-white text-sm transition-colors">Registrarse</Link></li>
                        </ul>
                    </div>

                    {/* Use Cases */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Casos de Uso</h4>
                        <ul className="space-y-2">
                            <li><Link to="/venta/para-quien" className="text-white/50 hover:text-white text-sm transition-colors">Fitness Enthusiasts</Link></li>
                            <li><Link to="/venta/para-quien" className="text-white/50 hover:text-white text-sm transition-colors">Profesionales</Link></li>
                            <li><Link to="/venta/para-quien" className="text-white/50 hover:text-white text-sm transition-colors">Emprendedores</Link></li>
                            <li><Link to="/venta/para-quien" className="text-white/50 hover:text-white text-sm transition-colors">Mindful Achievers</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Recursos</h4>
                        <ul className="space-y-2">
                            <li><Link to="/venta/recursos" className="text-white/50 hover:text-white text-sm transition-colors">Guía de Inicio</Link></li>
                            <li><Link to="/venta/recursos" className="text-white/50 hover:text-white text-sm transition-colors">Tutoriales</Link></li>
                            <li><Link to="/venta/recursos" className="text-white/50 hover:text-white text-sm transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-sm">
                        © 2024 Life OS. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-white/30 text-sm">Hecho con ❤️ para personas que quieren más</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
