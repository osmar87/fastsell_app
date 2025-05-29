const PacmanLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex items-center space-x-2">
        {/* Dots container */}
        <div className="flex space-x-2">
          {/* Individual dots */}
          <div className="w-4 h-4 rounded-full bg-yellow-400 animate-dot-fade" style={{ animationDelay: '0s' }}></div>
          <div className="w-4 h-4 rounded-full bg-yellow-400 animate-dot-fade" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 rounded-full bg-yellow-400 animate-dot-fade" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-4 h-4 rounded-full bg-yellow-400 animate-dot-fade" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>

      {/* Custom animations. Removed 'jsx' and 'global' attributes from style tag to fix warnings. */}
      <style>{`
        @keyframes pacman-mouth {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(20deg); /* Adjust mouth open angle */
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes pacman-mouth-triangle {
          0% {
            transform: rotate(320deg) scale(1); /* Changed from -360deg to 320deg */
          }
          50% {
            transform: rotate(320deg) scale(0.8); /* Adjust mouth open angle */
          }
          100% {
            transform: rotate(320deg) scale(1);
          }
        }

        @keyframes dot-fade {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          50% {
            opacity: 0;
            transform: translateX(-20px); /* Move dot left as it fades */
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-pacman-mouth {
          animation: pacman-mouth 0.8s infinite alternate;
        }

        .animate-pacman-mouth-triangle {
          animation: pacman-mouth-triangle 0.8s infinite alternate;
        }

        .animate-dot-fade {
          animation: dot-fade 1.2s infinite;
        }
      `}</style>
    </div>
  );
};

export default PacmanLoader;
