import img01 from "../imagens/boleto-com-desconto-1744719261.webp"
import img02 from "../imagens/desconto-no-pix-1744719145.webp"
import img03 from "../imagens/frete-gratis-1744718709.webp"
import Image from "next/image";

export default function Banner() {
  return (
    <div className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="overflow-hidden rounded-lg shadow-md">
          <Image
            src={img01}
            alt="Banner 1"
            className="w-full h-30 object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <Image
            src={img02}
            alt="Banner 2"
            className="w-full h-30 object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="overflow-hidden rounded-lg shadow-md">
          <Image
            src={img03}
            alt="Banner 3"
            className="w-full h-30 object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
}
