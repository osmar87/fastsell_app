'use client';

const PacmanLoader = () => {
  return (
    // O contêiner principal para o loader.
    // Ele usa flexbox para centralizar as bolinhas.
    <div className="flex items-center justify-center p-8">
      {/* Contêiner das bolinhas: Contém as "bolinhas" que o Pacman comeria. */}
      <div className="relative w-40 h-4 flex items-center justify-between"> {/* Aumentado o width para as bolinhas se espalharem mais */}
        {/* Bolinhas individuais: Cada bolinha é posicionada absolutamente para animação independente. */}
        <div className="absolute w-4 h-4 rounded-full bg-gray-400 dot" style={{ animationDelay: '0s' }}></div>
        <div className="absolute w-4 h-4 rounded-full bg-gray-400 dot" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute w-4 h-4 rounded-full bg-gray-400 dot" style={{ animationDelay: '0.4s' }}></div>
        <div className="absolute w-4 h-4 rounded-full bg-gray-400 dot" style={{ animationDelay: '0.6s' }}></div>
      </div>

      {/* CSS personalizado para as animações das bolinhas. */}
      <style>{`
        /* Animação das bolinhas:
           As bolinhas se movem da direita para a esquerda e desaparecem,
           simulando que estão sendo "comidas".
        */
        .dot {
          animation: dot-move-fade 1s infinite linear;
          left: 100%; /* Inicia as bolinhas fora da tela à direita */
        }

        /* Keyframes para o movimento e o fade das bolinhas. */
        @keyframes dot-move-fade {
          0% { transform: translateX(0); opacity: 1; } /* Inicia visível na posição original */
          75% { transform: translateX(-160px); opacity: 0; } /* Move para a esquerda e desaparece */
          100% { transform: translateX(0); opacity: 1; } /* Reinicia a posição para o próximo ciclo */
        }
      `}</style>
    </div>
  );
};

export default PacmanLoader;
