import './App.css'
import HeaderComponent from './components/HeaderComponent'
import ListStatementComponent from './components/ListStatementComponent'

function App() {
  const adminIN = "Admin Name";

  return (
    <>
      <HeaderComponent adminIN={adminIN} />
      <ListStatementComponent/>
    </>
  )
}

export default App
