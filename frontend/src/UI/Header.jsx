import { NavLink } from "react-router-dom"
import UserMenu from "../components/UserMenu/UserMenu"
import './Header.css'

export const Header = ()=>{

        return (
            
            <div className="container">

             <div className="nav-container">
                  
               <div className="nav-logo">
                <img className="h-img"  src="../../public/vq.png" alt="error" />
                
                </div>
             
               <div className="nav-list">
         <NavLink to={'/home'}>Home</NavLink>
        <NavLink to={'/borrow'}>Buy a Book</NavLink>
         <NavLink to={'/lend'}>Sell a Book</NavLink>
         <NavLink to={'/studymaterials'}>Study Materials</NavLink>
        <NavLink to={'/classschedule'}>Class Schedules</NavLink>
       <NavLink to={'/collegeevents'}>College Events</NavLink>
        <NavLink to={'/contactus'}>Contact Us</NavLink>
        <UserMenu />
                 </div>
             </div>
             </div>
        )
    }