import { NavLink } from 'react-router-dom';
import { FaTasks, FaCrown, FaChartBar, FaWalking, FaInfoCircle } from 'react-icons/fa';
import './Navigation.css';

const Navigation = () => {
    return (
        <nav className="navigation">
            <NavLink to="/tasks" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <div className="nav-item">
                    <FaTasks className="nav-icon" />
                    <span className="nav-text">Tasks</span>
                </div>
            </NavLink>
            <NavLink to="/upgrade" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <div className="nav-item">
                    <FaCrown className="nav-icon" />
                    <span className="nav-text">Upgrade</span>
                </div>
            </NavLink>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <div className="nav-item">
                    <FaWalking className="nav-icon" />
                    <span className="nav-text">Move</span>
                </div>
            </NavLink>
            <NavLink to="/statistics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <div className="nav-item">
                    <FaChartBar className="nav-icon" />
                    <span className="nav-text">Stats</span>
                </div>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <div className="nav-item">
                    <FaInfoCircle className="nav-icon" />
                    <span className="nav-text">About</span>
                </div>
            </NavLink>
        </nav>
    );
};

export default Navigation;
