import React from 'react';
import { FaCoins } from 'react-icons/fa';
import './StrideCoins.css';

interface StrideCoinProps {
    coins: number;
}

const StrideCoins: React.FC<StrideCoinProps> = ({ coins }) => {
    return (
        <div className="stride-coins">
            <FaCoins className="coins-icon" />
            <span className="coins-amount">{coins}</span>
        </div>
    );
};

export default StrideCoins;