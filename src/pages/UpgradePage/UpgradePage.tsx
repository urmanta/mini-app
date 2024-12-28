import React, { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa'
import './UpgradePage.css';

interface Branch {
    name: string;
    level: number;
    description: string;
}

const MAX_LEVEL = 30;
const MAX_BRANCH_LEVEL = 21;

const UpgradePage = () => {
    const [level, setLevel] = useState(1);
    const [availablePoints, setAvailablePoints] = useState(0);
    const [branches, setBranches] = useState<Branch[]>([
        { name: 'Endurance', level: 0, description: 'Reduces energy expenditure when walking' },
        { name: 'Efficiency', level: 0, description: 'Increases the multiplier for earning tokens' },
        { name: 'Luck', level: 0, description: 'Increases chance of successful walk' },
    ]);

    const handleUpgrade = () => {
        if (level < MAX_LEVEL) {
            setLevel(prev => prev + 1);
            setAvailablePoints(prev => prev + 1);
        }
    };

    const handleBranchUpgrade = (branchIndex: number, targetLevel: number) => {
        if (availablePoints > 0 && targetLevel <= MAX_BRANCH_LEVEL && targetLevel > branches[branchIndex].level) {
            setBranches(prev => prev.map((branch, idx) => 
                idx === branchIndex 
                    ? { ...branch, level: targetLevel }
                    : branch
            ));
            setAvailablePoints(prev => prev - 1);
        }
    };

    return (
        <div className="upgrade-page">
            <div className="level-section">
                <div className="level-info">
                    {level === MAX_LEVEL ? (
                        <h2 className="max-level">Maximum Level {level}</h2>
                    ) : (
                        <h2>Level {level}</h2>
                    )}
                    <button 
                        className="upgrade-button"
                        onClick={handleUpgrade}
                        disabled={level >= MAX_LEVEL}
                    >
                        UPGRADE ACCOUNT
                    </button>
                </div>
                {availablePoints > 0 && (
                    <div className="points-available">
                        <FaPlusCircle />
                        {availablePoints} POINT{availablePoints !== 1 ? 'S' : ''} AVAILABLE
                    </div>
                )}
            </div>

            <div className="branches-section">
                {branches.map((branch, index) => (
                    <div key={branch.name} className="branch">
                        <div className="branch-header">
                            <h3 className="branch-name">{branch.name}</h3>
                            <p>{branch.description}</p>
                        </div>
                        <div className="branch-progress">
                            <div className="progress-segments">
                                {[...Array(MAX_BRANCH_LEVEL)].map((_, segmentIndex) => (
                                    <div
                                        key={segmentIndex}
                                        className={`progress-segment ${segmentIndex < branch.level ? 'filled' : ''}`}
                                    />
                                ))}
                            </div>
                            <button
                                className="branch-upgrade-button"
                                onClick={() => handleBranchUpgrade(index, branch.level + 1)}
                                disabled={availablePoints === 0 || branch.level >= MAX_BRANCH_LEVEL}
                            >
                                UPGRADE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpgradePage;
