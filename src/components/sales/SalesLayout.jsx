// Sales Layout Wrapper
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SalesNav from './SalesNav'
import SalesFooter from './SalesFooter'

export default function SalesLayout({ children }) {
    const { pathname } = useLocation()

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Background gradients */}
            <div className="fixed inset-0 bg-gradient-to-br from-violet-950/50 via-zinc-950 to-fuchsia-950/30 pointer-events-none" />

            {/* Navigation */}
            <SalesNav />

            {/* Main Content */}
            <main className="relative pt-16">
                {children}
            </main>

            {/* Footer */}
            <SalesFooter />
        </div>
    )
}
