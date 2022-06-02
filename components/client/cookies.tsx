import { useEffect, useState } from 'react'

function Cookies() {

    const [consent, setConsent] = useState(true);

    useEffect(() => {
        const hasConsented = localStorage.getItem('hasConsented');
        const isVerificationOrReset = RegExp('^/verification/|^/reset/').test(window.location.pathname);
        setConsent(!!hasConsented && !isVerificationOrReset);
    }, [])

    const handleConsent = () => {
        localStorage.setItem('hasConsented', 'true');
        setConsent(true);
    }

    if (consent) return <></>

  return (
    <div className='modal-outer'>
      <div className=''>
        <h2 className='text-2xl font-bold mb-4'>
            Accept Cookies
        </h2>
        <p className='text-justify'>
            There is an EU cookie law that requires me to ask for your consent
            before storing data in your browser. At the moment, this website
            uses cookies only for authentication and it is <strong>not</strong> adjusted
            for those who want to opt out of the use of cookies. If you
            press <em>accept</em> you agree to the use of both frist-party
            and future potential third-party cookies.
        </p>
        <div className='flex gap-4 mt-4'>
            <button onClick={handleConsent}
            className='bg-green-600 grow text-white font-bold py-2 px-4 rounded-md'>
                Accept
            </button>
            <button 
            onClick={() => window.location.href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"} 
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
