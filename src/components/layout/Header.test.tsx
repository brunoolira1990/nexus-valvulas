import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '@/components/layout/Header'

const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
)

describe('Header Component', () => {
  it('renders navigation links correctly', () => {
    render(<HeaderWithRouter />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(screen.getByText('Sobre Nós')).toBeInTheDocument()
    expect(screen.getByText('Contato')).toBeInTheDocument()
  })

  it('displays contact information', () => {
    render(<HeaderWithRouter />)
    
    expect(screen.getByText('nexus@nexusvalvulas.com.br')).toBeInTheDocument()
    expect(screen.getByText('(11) 4240-8832')).toBeInTheDocument()
  })

  it('has accessible logo', () => {
    render(<HeaderWithRouter />)
    
    const logo = screen.getByAltText('Nexus Logo')
    expect(logo).toBeInTheDocument()
  })
})