import React, { useEffect } from 'react'

function Cookies() {

    const [consent, setConsent] = React.useState(true);

    useEffect(() => {
        const hasConsented = localStorage.getItem('hasConsented');
        setConsent(!!hasConsented);
    }, [])

    const handleConsent = () => {
        localStorage.setItem('hasConsented', 'true');
        setConsent(true);
    }

    if (consent) {
        return <></>
    }

  return (
    <div className='modal-outer'>
      <div className=''>
        <h2 className='text-2xl font-bold mb-4'>
            Cookie Thing
        </h2>
        <p className='text-justify'>
            There is that EU cookie law thing or whatever. I need your consent 
            to store any kind of data on your device (browser). There is no
            way in hell I'm going to customize how this website works for some of you
            whiny conspiracy theorists, so just accept all or leave.
        </p>
        <div className='flex gap-4 mt-4'>
            <button onClick={handleConsent}
            className='bg-green-600 grow text-white font-bold py-2 px-4 rounded-md'>
                Accept
            </button>
            <button onClick={() => window.location.href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"} 
            className='bg-neutral-100 grow text-neutral-800 font-bold py-2 px-4 rounded-md'>
                Leave
            </button>
        </div>
      </div>
    </div>
  )
}

export default Cookies

// Give me rickroll link
// https://www.youtube.com/watch?v=dQw4w9WgXcQ
// Thank you. 
