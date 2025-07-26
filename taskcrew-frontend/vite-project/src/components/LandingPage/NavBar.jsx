
import './NavBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck,faBars,faTimes } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

function NavBar() {
 const [isOpen,setIsOpen]=useState(false);
  const navOptions = ['Home', 'Features', 'Pricing', 'Testimonials']

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <FontAwesomeIcon icon={faCircleCheck} size="2x" />
        <h1 className="navbar__title">TaskCrew</h1>
      </div>

      <button
      className='navbar__toggle'
      onClick={()=>setIsOpen(open=>!open)}
      aria-label='Toggle-Menu'
      >

      <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
        
      </button>

      <ul className={`navbar__links ${isOpen?'navbar__links--open':''}`}>
        {navOptions.map(label => (
          <li key={label} className="navbar__item">
            <a 
            href={`#${label.toLowerCase()}`} 
            className="navbar__link"
            onClick={() => setIsOpen(false)} 
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="navbar__auth">
        <button className="btn btn--outline">Log In</button>
        <button className="btn btn--primary">Sign Up</button>
      </div>
    </nav>
  )
}


export default NavBar;