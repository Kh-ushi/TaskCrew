
import './Navbar.css';
import { Search ,Bell,ChevronDown} from "lucide-react";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className='search-bar'>
                <span><Search size={25}/></span>
                <input type='text' placeholder='Search'></input>
            </div>
            <div className='admin-details'>
                <div className='bell-icon'><Bell size={30} color='#565555'></Bell></div>
                <div className='user-profile'>
                    <img src='https://image.lexica.art/full_webp/06a52e56-022c-452d-a192-d4025cee2599'></img>
                    <div>
                        <div>
                            <h3>Charles Shelby</h3>
                            <p>Project Manager</p>
                        </div>
                        <ChevronDown size={15}></ChevronDown>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;