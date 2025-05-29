'use client';

import { useState } from 'react';
import { Menu, X, ShoppingCart, Trash2, Cat } from 'lucide-react';
import Image from 'next/image';
import logo from '../imagens/logo.png';
import { useCart } from '@/contexts/CartContext';
import { useSearch } from "@/contexts/SearchContext";
import { useAuth } from "@/contexts/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



export default function Header() {
  const { logout } = useAuth()
  const { searchTerm, setSearchTerm } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, cartCount, total, removeFromCart, clearCart } = useCart();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");



  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Recibo de Venda", 14, 22);
    doc.setFontSize(12);
    doc.text("Empresa XYZ - Endereço da Empresa", 14, 30);
    doc.text(`Data: ${new Date().toLocaleString()}`, 14, 38);
    doc.text(`Cliente: ${clientName}`, 14, 46);
    doc.text(`Endereço: ${clientAddress}`, 14, 54);
    doc.line(14, 60, 200, 60);

    const tableData = cart.map((item) => [
      item.name,
      item.quantity.toString(),
      `R$ ${Number(item.price).toFixed(2)}`,
      `R$ ${(Number(item.price) * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["Produto", "Qtd", "Preço Unitário", "Subtotal"]],
      body: tableData
    });

    const data = new Date();
    const dataFormatada = `${data.getFullYear()}-${(data.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')}_${data
        .getHours()
        .toString()
        .padStart(2, '0')}-${data.getMinutes().toString().padStart(2, '0')}`;

    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.text(`Total: R$ ${total.toFixed(2)}`, 14, finalY + 10);
    // Salvar o PDF com a data no nome
    doc.save(`recibo-${dataFormatada}.pdf`);
  };


  const handleSendWhatsApp = () => {
    const phone = "5575992073047"; // Coloque seu número com DDD e sem espaços

    const message = `🛒 *Pedido realizado!*\n\n${cart
      .map(
        (item) =>
          `• ${item.name} - ${item.quantity}x - R$ ${(item.price * item.quantity)
            .toFixed(2)
            .replace(".", ",")}`
      )
      .join("\n")}\n\n💰 *Total:* R$ ${total
        .toFixed(2)
        .replace(".", ",")}\n\n Obrigado pelo pedido! 🙌`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

  };



  const handleFinishOrder = () => {
    setCartOpen(false);

    // gerarPDF()
    setIsModalOpen(true);
    // handleSendWhatsApp()
    // ❌ Fecha o modal do carrinho
  };

  const handleConfirm = () => {
    gerarPDF();
    setIsModalOpen(false);
    clearCart();              // 🗑️ Limpa o carrinho
  };



  return (
    <>
      <header className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-4 gap-4">
          {/* Logo */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Image src={logo} alt="Logo" className="w-45 h-auto" />
            {/* <h2 className="text-blue-400 font-bold text-md md:text-base">Logo</h2> */}
            <button
              className="md:hidden text-gray-800"
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Contato e Carrinho */}
          <div className="flex items-center gap-6">
            {/* Telefone */}
            <div className="text-center md:text-right">
              <p className="font-semibold text-sm sm:text-base">Atendimento | Whatsapp</p>
              <p className="font-bold text-sm md:text-base">(11) 99999-9999</p>
            </div>

            {/* Carrinho */}
            <button
              className="relative text-gray-700 hover:text-blue-500"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={28} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav
          className={`bg-gray-700 md:bg-gray-700 ${menuOpen ? 'block' : 'hidden'
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
              <button onClick={() => { logout() }} className="text-white hover:text-blue-400 block text-center">
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Dados do Cliente</h2>

            <label className="block mb-2">
              Nome
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full border rounded p-2 mt-1"
                placeholder="Digite o nome do cliente"
              />
            </label>

            <label className="block mb-4">
              Endereço
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full border rounded p-2 mt-1"
                placeholder="Digite o endereço"
              />
            </label>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 🔥 Modal do Carrinho */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-lg relative">

            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="relative bg-white p-6 rounded shadow max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Seu Carrinho</h2>


                {cart.length === 0 ? (
                  <>
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                      onClick={() => setCartOpen(false)}
                    >
                      <X size={24} />
                    </button>
                    <p>Carrinho vazio</p>
                  </>
                ) : (
                  <div>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between mb-2">
                        <div>
                          {item.name} {(item.price * 1).toFixed(2).replace('.', ',')} x {item.quantity}
                        </div>
                        <div className="flex gap-2">
                          <span>
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <p className="font-bold">
                        Total: R$ {total.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={clearCart}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Limpar
                      </button>


                      <button
                        onClick={() => handleFinishOrder()}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Finalizar
                      </button>

                      <button
                        onClick={() => setCartOpen(false)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
