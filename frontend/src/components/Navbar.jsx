import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Settings } from 'lucide-react';
import '../index.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container">
        {/* Logo or brand name */}
        <div className="item">
          {/* Logo Button */}
          <div className="button-nav">
            <Zap className="button-zap" />
            <div className="ping-dot">

            </div>
          </div>
          <span className='brand-name'>
            TaskFlow
          </span>
        </div>

        {/* right side of the navbar */}
        <div className="right-nav">
          <button className='button-r' onClick={() => navigate('/profile')}>
             <Settings className="button-settings" /> 

          </button>

        </div>


      </div>
    </header>
  );
};

export default Navbar;
