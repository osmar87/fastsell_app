'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import logo from '../imagens/logoguedes.jpg'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-md">
      {/* Topo */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-4 gap-4">
        {/* Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* <Image
            src={logo}
            alt="Logo"
            className="w-15 h-auto"
          /> */}
          <h2 className="text-blue-400 font-bold text-md md:text-base"> Logo </h2>
          {/* Botão hambúrguer */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Busca */}
        <div className="w-full md:w-[400px]">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Telefone */}
        <div className="text-center md:text-right">
          <p className="font-semibold text-sm sm:text-base">Atendimento | Whatsapp</p>
          <p className="font-bold text-sm md:text-base">(11) 99999-9999</p>
        </div>
      </div>

      {/* Menu */}
      <nav
        className={`bg-gray-700 md:bg-gray-700 ${
          menuOpen ? 'block' : 'hidden'
        } md:block`}
      >
        <ul className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center md:space-x-8 py-3 space-y-2 md:space-y-0">
          <li>
            <a href="#" className="text-white hover:text-blue-400 block text-center">
              Início
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-blue-400 block text-center">
              Produtos
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-blue-400 block text-center">
              Sobre
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-blue-400 block text-center">
              Contato
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
