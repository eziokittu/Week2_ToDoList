import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoWrapper } from './components/TodoWrapper';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Background from './components/Background';

function App() {
  return (
    <>
      <Background />
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* All routes will hit this */}
          <Route path="*" element={<TodoWrapper />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
