import Link from "next/link";
import { LayoutDashboard, Code } from 'lucide-react'; // Importando ícones para o footer

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 py-6 shadow-inner font-inter">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Informações de Copyright */}
        <p className="text-sm text-center md:text-left mb-3 md:mb-0">
          &copy; {new Date().getFullYear()} FastSell. Todos os direitos reservados.
        </p>

        {/* Links do Footer */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          {/* Link para Painel Admin */}
          <Link
            href="https://fastsell.gomesweb87.xyz/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 group"
          >
            <LayoutDashboard size={18} className="text-blue-300 group-hover:text-blue-400 transition-colors duration-200" />
            <span className="font-medium">Painel Admin</span>
          </Link>

          {/* Link para Desenvolvedor */}
          <a
            href="https://gomesweb87.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 group"
          >
            <Code size={18} className="text-blue-300 group-hover:text-blue-400 transition-colors duration-200" />
            <span className="font-medium">Desenvolvido por GomesWeb</span>
          </a>
        </div>
      </div>
      {/* Custom CSS for font consistency */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </footer>
  );
}
