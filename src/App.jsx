import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout.jsx';
import Landing from './pages/Landing.jsx';
import Create from './pages/Create.jsx';
import Activities from './pages/Activities.jsx';
import BookBuilder from './pages/BookBuilder.jsx';
import Projects from './pages/Projects.jsx';
import Checkout from './pages/Checkout.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/create" element={<Create />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/build" element={<BookBuilder />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<Landing />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
