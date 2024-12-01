import { Heart } from 'lucide-react'
import React from 'react'
import { Link, Links } from 'react-router-dom'
import ShinyButton from './ui/shiny-button'


const Navbar = () => {
  return (
    <>

    <header className='flex items-center justify-center '>

      <nav className='flex items-center justify-between w-full md:w-1/2 p-2 md:p-5 rounded-lg mt-5 shadow-md bg-gradient-to-r from-teal-400 to-yellow-200'>
        <div className="logo">

          <p className='flex items-center gap-2 md:text-xl text-white font-bold '><Link to={'/'}>PDF HERO </Link><span className='text-pink-600'><Heart/></span></p>

        </div>

        <div className="links">

          <ul className='flex gap-5 '>
            <li className=''>
              <Link to={'/'}><ShinyButton>Image to PDF</ShinyButton></Link>
            </li>
            <li className=' '>
            <Link to={'/pdftoimage'}><ShinyButton>Pdf to image</ShinyButton></Link>
            </li>
          </ul>

        </div>



      </nav>
    </header>
    
    </>
  )
}

export default Navbar