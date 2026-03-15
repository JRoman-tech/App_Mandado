import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <div>
      <nav style={{
        padding: '16px 24px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <Link to="/">Inicio</Link>
        <Link to="/admin">Administrar recetas</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App