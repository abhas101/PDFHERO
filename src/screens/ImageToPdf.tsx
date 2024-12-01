import PhotoUpload from '@/components/PhotoUpload'
import BlurIn from '@/components/ui/blur-in'
import React from 'react'

const ImageToPdf = () => {
  return (
  <>

  <section>
    <div className="texts mt-24 p-2">

     <BlurIn word='welcome to Free image to pdf generator'/>

    </div>

    <div className="uploadarea flex items-center justify-center mt-10">
      <div className="upload w-1/2">

  <PhotoUpload/>
      </div>

    </div>

  </section>
  
  
  </>
      
      


    
  )
}

export default ImageToPdf