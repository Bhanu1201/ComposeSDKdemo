import { SisenseContextProvider } from '@sisense/sdk-ui'
import './App.css'
import HomePage from './pages/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EmbedDashboard from './pages/Iframes'
import LoginPage from './authentication/LoginPage'
import SignupPage from './authentication/SignupPage'
import Customtable from './components/tables/Customtable'
import Parabolachart from './components/3dcharts/ParabolaChart'

function App() {

  return (
    <>
      <SisenseContextProvider url='http://192.168.50.48:30845/' token={'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjYyNjQ5MDYyYTUzNDIwMDJkYTU3ZTBiIiwiYXBpU2VjcmV0IjoiYTViZDc1ZWEtZjZkNC1iZWMzLWU2YzItYzgxMjZlMjI5Mjk1Iiwic3NvVG9rZW4iOm51bGwsImFsbG93ZWRUZW5hbnRzIjpbIjY2MThlMGVkMzlmMGI1MDAxYjFmMGQzMyJdLCJ0ZW5hbnRJZCI6IjY2MThlMGVkMzlmMGI1MDAxYjFmMGQzMyJ9.tk0ft6-U8-NI5eNezGWK0GQ89GqGuCTkvZXfQtrBva8'} >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/iframe' element={<EmbedDashboard />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signin' element={<SignupPage />} />
            <Route path='/table' element={<Customtable />} />

          </Routes>
        </BrowserRouter>
      </SisenseContextProvider>
    </>
  )
}

export default App
