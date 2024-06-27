import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import HeaderComponent from './components/HeaderComponent'
import ListStatementComponent from './components/ListStatementComponent'

function App() {

  return (
    <>
      <BrowserRouter>
        <HeaderComponent/>
          <Routes>
            <Route path='/' element = {<ListStatementComponent/>}></Route>
            <Route path='/statements' element = {  <ListStatementComponent/> }></Route>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
