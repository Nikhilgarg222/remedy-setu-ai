function Footer() {
  return (
    <footer className="border-t border-primary-100/50 bg-white/60 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-lg">🙏</span>
            <span>
              <span className="font-semibold text-gradient">Remedy Setu</span>{' '}
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            AI-powered astrological remedy recommendations. For guidance purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
