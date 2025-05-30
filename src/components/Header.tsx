'use client';

import { useState } from 'react';
import { Menu, X, ShoppingCart, Search, BarChart, Package, Info, LogOut, User, MapPin } from 'lucide-react'; // Added more icons
import Image from 'next/image';
// Assuming 'logo' is correctly imported from '../imagens/logo.png'
import logo from '../imagens/logo.png'; // This import needs to be handled externally or replaced with a placeholder
import { useCart } from '@/contexts/CartContext';
import { useSearch } from "@/contexts/SearchContext";
import { useAuth } from "@/contexts/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

export default function Header() {
  const { logout } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();
  const { cart, cartCount, total, removeFromCart, clearCart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');



  // 

  const gerarPDFAprimorado = (codigo: string) => {
    const doc = new jsPDF(); // Inicializa um novo documento PDF

    // --- Seção do Cabeçalho do Recibo ---
    // Você pode adicionar um logo aqui se tiver um. Exemplo:
    // doc.addImage("caminho/para/seu/logo.png", "PNG", 14, 10, 30, 15);
    doc.setFontSize(22);
    doc.setTextColor(30, 144, 255); // Cor azul vibrante para o título
    doc.text("RECIBO DE VENDA", 105, 30, { align: 'center' }); // Centraliza o título

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80); // Cor cinza escuro para detalhes da empresa
    doc.text("Empresa XYZ Ltda. - CNPJ: 00.123.456/0001-99", 14, 40);
    doc.text("Endereço: Rua Comercial, 123 - Centro - Cidade, Estado - CEP 12345-678", 14, 45);
    doc.text("Telefone: (DD) XXXX-XXXX | Email: contato@empresaxyz.com.br", 14, 50);

    // Linha separadora
    doc.setDrawColor(200, 200, 200); // Cor da linha
    doc.setLineWidth(0.5); // Espessura da linha
    doc.line(14, 57, 196, 57);

    // --- Informações do Recibo (Número e Data) ---
    doc.setFontSize(10);
    doc.setTextColor(0); // Volta para preto
    const receiptNumber = `${codigo}`;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR');
    const formattedTime = currentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    doc.text(`Nº do Recibo: ${receiptNumber}`, 14, 65);
    doc.text(`Data e Hora: ${formattedDate} às ${formattedTime}`, 14, 70);

    // --- Informações do Cliente ---
    doc.setFontSize(12);
    doc.setTextColor(30, 144, 255); // Azul para o título da seção do cliente
    doc.text("DADOS DO CLIENTE:", 14, 80);
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Nome: ${clientName}`, 14, 88);
    doc.text(`Endereço: ${clientAddress}`, 14, 93);

    // Linha separadora
    doc.line(14, 98, 196, 98);

    // --- Tabela de Itens ---
    const tableHeaders = [["Produto", "Qtd", "Preço Unitário", "Subtotal"]];
    const tableBody = cart.map(item => [
      item.name,
      item.quantity.toString(),
      `R$ ${Number(item.price).toFixed(2).replace('.', ',')}`,
      `R$ ${(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}`
    ]);

    // Configurações e estilo da tabela
    autoTable(doc, {
      startY: 105, // Posição inicial da tabela
      head: tableHeaders,
      body: tableBody,
      theme: 'striped', // Tema da tabela: 'striped', 'grid', 'plain'
      styles: {
        fontSize: 9,
        cellPadding: 3,
        valign: 'middle',
        halign: 'left',
        textColor: [50, 50, 50] // Cor do texto das células
      },
      headStyles: {
        fillColor: [30, 144, 255], // Azul escuro para o cabeçalho
        textColor: 255, // Texto branco no cabeçalho
        fontStyle: 'bold',
        halign: 'center' // Alinhamento central para o cabeçalho
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248] // Cinza claro para linhas alternadas
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'left' }, // Produto
        1: { cellWidth: 20, halign: 'center' },   // Qtd
        2: { cellWidth: 35, halign: 'right' },    // Preço Unitário
        3: { cellWidth: 40, halign: 'right' }     // Subtotal
      },
      // Adiciona rodapé a cada página (se a tabela for muito longa)

    });

    // --- Seção do Total Geral ---
    const finalY = (doc as any).lastAutoTable.finalY; // Pega a posição Y final da tabela
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold"); // Deixa o total em negrito
    doc.text(`TOTAL GERAL: R$ ${total.toFixed(2).replace('.', ',')}`, doc.internal.pageSize.width - 14, finalY + 15, { align: 'right' });

    // --- Área de Observações / Assinatura ---
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    doc.text("Observações: Este recibo é um comprovante de venda. Não aceitamos devoluções após 7 dias.", 14, finalY + 30);

    doc.line(doc.internal.pageSize.width / 2 - 40, finalY + 50, doc.internal.pageSize.width / 2 + 40, finalY + 50); // Linha para assinatura
    doc.text("Assinatura do Cliente", doc.internal.pageSize.width / 2, finalY + 55, { align: 'center' });


    // --- Salvando o PDF ---
    doc.save(`recibo-${receiptNumber}.pdf`);
  };


  // const handleSendWhatsApp = () => {
  //   const phone = "5575992073047";
  //   const message = `🛒 *Pedido realizado!*\n\n${cart.map(
  //     item => `• ${item.name} - ${item.quantity}x - R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`
  //   ).join("\n")}\n\n💰 *Total:* R$ ${total.toFixed(2).replace(".", ",")}\n\n Obrigado pelo pedido! 🙌`;

  //   const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  //   window.open(url, "_blank");
  // };

  const handleFinishOrder = () => {
    setCartOpen(false);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const token = localStorage.getItem('access');
    
    const codigo = `VENDA${Date.now()}`; // Geração automática
    gerarPDFAprimorado(codigo);

    const payload = {
      codigo: codigo,
      itens: cart.map(item => ({
        codigo: codigo,
        produto: item.name,
        quantidade: item.quantity,
        preco: item.price
      }))
    };

    axios.post("https://fastsell.gomesweb87.xyz/api/pedido/", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('✅ Pedido criado com sucesso:', res.data);
      })
      .catch(err => {
        console.error('❌ Erro ao criar pedido:', err);
      });
    // handleSendWhatsApp();
    setIsModalOpen(false);
    clearCart();
  };

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-50 to-indigo-100 shadow-lg font-inter">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Using a placeholder for the logo. Replace `logoPlaceholder` with `logo` if your `logo` import is correctly handled. */}
            <Image
              src={logo}
              alt="Logo"
              width={160} // Set appropriate width
              height={40}  // Set appropriate height
              className="w-40 h-auto"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/160x40/E0E0E0/333333?text=Logo"; }}
            />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2"
              aria-label={menuOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-[400px] relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full rounded-full px-4 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Limpar busca"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Contact Info + Cart */}
          <div className="flex items-center gap-6">
            <div className="text-center md:text-right">
              <p className="font-semibold text-sm text-gray-700">Atendimento | Whatsapp</p>
              <p className="font-bold text-lg text-blue-700">(75) 99192-0171</p>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-gray-700 hover:text-blue-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2"
              aria-label="Abrir Carrinho"
            >
              <ShoppingCart size={28} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center font-bold border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className={`bg-gray-800 transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-screen opacity-100 py-3' : 'max-h-0 opacity-0 overflow-hidden md:max-h-screen md:opacity-100 md:py-3'}`}>
          <ul className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center md:space-x-8 space-y-2 md:space-y-0 px-4 md:px-0">
            {[
              { name: 'Início', icon: <BarChart size={18} />, href: '/fastsell' },
              { name: 'Produtos', icon: <Package size={18} />, href: '/fastsell/pdv' },
              // { name: 'Sobre', icon: <Info size={18} />, href: '#' },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-white hover:text-blue-400 block text-center py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {item.icon}
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={logout}
                className="text-white hover:text-blue-400 block text-center py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 w-full"
              >
                <LogOut size={18} />
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Modal Dados Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative animate-scale-in">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition-colors duration-200 focus:outline-none"
              onClick={() => setIsModalOpen(false)}
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">Dados do Cliente</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium flex items-center gap-2 mb-1"><User size={18} /> Nome</span>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Digite o nome do cliente"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium flex items-center gap-2 mb-1"><MapPin size={18} /> Endereço</span>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Digite o endereço"
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200 font-semibold shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Carrinho */}
      {cartOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-scale-in">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition-colors duration-200 focus:outline-none"
              onClick={() => setCartOpen(false)}
              aria-label="Fechar Carrinho"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">Seu Carrinho</h2>

            {cart.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">Seu carrinho está vazio.</p>
            ) : (
              <div>
                <div className="max-h-60 overflow-y-auto pr-2 mb-4 custom-scrollbar"> {/* Added custom scrollbar */}
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-2 shadow-sm">
                      <div className="flex-1 text-gray-700">
                        <span className="font-semibold">{item.name}</span> - {item.quantity}x
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-600">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none transform hover:scale-110"
                          aria-label={`Remover ${item.name} do carrinho`}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-bold text-xl text-right text-gray-800">
                    Total: <span className="text-blue-700">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </p>
                </div>
                <div className="flex justify-between mt-6 gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold shadow-md"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={handleFinishOrder}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold shadow-md"
                  >
                    Finalizar
                  </button>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold shadow-md"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom CSS for scrollbar and animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Fade In Animation */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Scale In Animation */
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }

        /* Bounce Animation for Cart Count */
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%) scale(1);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0) scale(1.1);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </>
  );
}
