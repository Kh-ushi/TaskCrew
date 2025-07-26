
import './NavBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck,faBars,faTimes } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NavBar({isCreateSpace=false}) {
 const [isOpen,setIsOpen]=useState(false);
  const navOptions = isCreateSpace==false?['Home', 'Features', 'Pricing', 'Testimonials']:[];

  const navigate=useNavigate();

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
        {!isCreateSpace && <button className="btn btn--outline" onClick={()=>navigate('/login')} >Log In</button>}
        {!isCreateSpace && <button className="btn btn--primary"  onClick={()=>navigate('/signin')}>Sign Up</button>}
        {isCreateSpace && <button className='btn btn--outline'>Create Space +</button>}
      </div>
    </nav>
  )
}


export default NavBar;