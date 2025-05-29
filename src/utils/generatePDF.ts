import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Product = {
  id: number;
  name: string;
  price: number; // melhor manter como number para evitar conversões
  quantity: number;
};

export const generatePDF = (cartItems: Product[], total: number) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Pedido - Guedes Construções", 14, 20);
  doc.setFontSize(10);
  doc.text("Whatsapp: (75) 99192-0171", 14, 26);
  doc.text("Av Landufo Alves, 704 Centro Paulo Afon - BA", 14, 32);

  autoTable(doc, {
    startY: 40,
    head: [["Produto", "Qtd", "Preço Unit.", "Total"]],
    body: cartItems.map(item => [
      item.name,
      item.quantity.toString(),
      `R$ ${item.price.toFixed(2).replace('.', ',')}`,
      `R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`,
    ]),
  });

  // Cast para 'any' porque lastAutoTable não está tipado no jsPDF oficialmente
  const finalY = (doc as any).lastAutoTable?.finalY || 40;

  doc.setFontSize(12);
  doc.text(`Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}`, 14, finalY + 10);

  doc.setFontSize(10);
  doc.text("Aguarde nosso contato via WhatsApp para confirmação do pedido.", 14, finalY + 20);

  const timestamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
  doc.save(`pedido_${timestamp}.pdf`);
};
