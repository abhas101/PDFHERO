import Navbar from "./components/Navbar";
import TopTape from "./components/TopTape";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import ImageToPdf from "./screens/ImageToPdf";
import PDF from "./screens/PDF";



export default function App() {
  const router = createBrowserRouter([
    {
      path :'/',
      element:<><Navbar/><ImageToPdf/></>
    },
    {
      path:'/pdftoimage',
      element:<><Navbar/><PDF/> </>
    }
  ])
  return (
    <>
    
      <TopTape/>
      <RouterProvider router={router}/>
      </>

      
    
  )
}