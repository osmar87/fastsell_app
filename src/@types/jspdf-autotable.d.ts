import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
      // Se quiser, pode adicionar outras propriedades do autoTable aqui também
      // head?: any[];
      // body?: any[][];
    };
  }
}
