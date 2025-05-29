const PacmanLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative flex items-center space-x-4">
        {/* Pac-Man */}
        <div className="pacman"></div>

        {/* Bolinhas */}
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>

      {/* CSS Inline */}
      <style jsx>{`
        .pacman {
          width: 40px;
          height: 40px;
          background: #facc15;
          border-radius: 50%;
          position: relative;
          clip-path: polygon(
            50% 50%,
            100% 0%,
            100% 100%,
            50% 50%,
            0% 0%,
            0% 100%,
            50% 50%
          );
          animation: pacman-chomp 0.4s infinite;
        }

        .dot {
          width: 12px;
          height: 12px;
          background-color: #3b82f6;
          border-radius: 9999px;
          animation: dot-bounce 0.6s infinite ease-in-out;
        }

        .dot1 {
          animation-delay: 0s;
        }
        .dot2 {
          animation-delay: 0.2s;
        }
        .dot3 {
          animation-delay: 0.4s;
        }

        @keyframes pacman-chomp {
          0% {
            clip-path: polygon(
              50% 50%,
              100% 0%,
              100% 100%,
              50% 50%,
              0% 0%,
              0% 100%,
              50% 50%
            );
          }
          50% {
            clip-path: polygon(
              50% 50%,
              100% 25%,
              100% 75%,
              50% 50%,
              25% 0%,
              25% 100%,
              50% 50%
            );
          }
          100% {
            clip-path: polygon(
              50% 50%,
              100% 0%,
              100% 100%,
              50% 50%,
              0% 0%,
              0% 100%,
              50% 50%
            );
          }
        }

        @keyframes dot-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default PacmanLoader;
