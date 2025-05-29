import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Product = {
  id: number;
  name: string;
  price: number | string;
  quantity: number;
};

export const generatePDF = (cartItems: Product[], total: number) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Pedido - Guedes Costruções", 14, 20);
  doc.setFontSize(10);
  doc.text("Whatsapp: (75) 99192-0171", 14, 26);
  doc.text("Av Landufo Alves, 704 Centro Paulo Afon - BA", 14, 32);

  autoTable(doc, {
    startY: 40,
    head: [["Produto", "Qtd", "Preço Unit.", "Total"]],
    body: cartItems.map(item => {
      const price = Number(item.price); // ✅ converte para número
      return [
        item.name,
        item.quantity.toString(),
        `R$ ${price.toFixed(2).replace('.', ',')}`,
        `R$ ${(price * item.quantity).toFixed(2).replace('.', ',')}`,
      ];
    }),
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 40;
  doc.setFontSize(12);
  doc.text(`Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}`, 14, finalY + 10);

  doc.setFontSize(10);
  doc.text("Aguarde nosso contato via WhatsApp para confirmação do pedido.", 14, finalY + 20);

  doc.save(`pedido_${new Date().getTime()}.pdf`);
};
