import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConsultationForm from './components/ConsultationForm';
import ProductsPage from './pages/ProductsPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 20px rgba(255, 107, 0, 0.15)',
            padding: '14px 20px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#FF6B00', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#800020', secondary: '#fff' },
          },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ConsultationForm />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
