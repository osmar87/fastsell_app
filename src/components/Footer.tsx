import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} FastSell. Todos os direitos reservados.</p>

        <div className="flex gap-4 mt-2 md:mt-0">
          
          <Link href="https://fastsell.gomesweb87.xyz/admin" target="_blank"
            rel="noopener noreferrer">
            <span className="hover:underline cursor-pointer">Painel Admin</span>
          </Link>
          <a
            href="https://gomesweb87.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Desenvolvido por GomesWeb
          </a>
        </div>
      </div>
    </footer>
  );
}
