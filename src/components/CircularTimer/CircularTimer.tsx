import React, { useState, useLayoutEffect,useEffect, useRef } from 'react';
import { useTimer } from '../../context/TimerContext';
import { FaWalking } from 'react-icons/fa';
import './CircularTimer.css';

interface CircularTimerProps {
    duration: number;
    onComplete: () => void;
    onSpeedUpdate: (speed: number) => void;
}

const CircularTimer: React.FC<CircularTimerProps> = ({
    duration,
    onComplete,
    onSpeedUpdate
}) => {
    const { timeLeft, setTimeLeft, isRunning, setIsRunning } = useTimer();
    const [countdown, setCountdown] = useState(3);
    const [showCountdown, setShowCountdown] = useState(false);
    const [speed, setSpeed] = useState(0);
    const [canStop, setCanStop] = useState(false);
    
    const circleRef = useRef<SVGCircleElement>(null);
    const animationFrameRef = useRef<number>();
    const startTimeRef = useRef<number>();
    const lastStepTimeRef = useRef<number>();
    
    const CIRCLE_RADIUS = 165;
    const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
    
    useLayoutEffect(() => {
        setTimeLeft(duration);
    }, [duration]);
    
    useEffect(() => {
        if (timeLeft <= 0) {
            handleComplete();
        } else {
            requestAnimationFrame(updateSpeed);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (isRunning && timeLeft <= 0) {
            setCanStop(true);
        }
    }, [isRunning, timeLeft]);

    useEffect(() => {
        if (showCountdown && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (showCountdown && countdown === 0) {
            setShowCountdown(false);
            startTimer();
        }
    }, [showCountdown, countdown]);

    const handleStart = () => {
        if (!isRunning) {
            setShowCountdown(true);
            setCountdown(3);
        }
    };

    const startTimer = () => {
        setIsRunning(true);
        startTimeRef.current = Date.now();
    };

    const updateSpeed = () => {
        const randomSpeed = (Math.random() * (4.9 - 4.1) + 4.1).toFixed(1);
        setSpeed(parseFloat(randomSpeed));
        onSpeedUpdate(parseFloat(randomSpeed));
        lastStepTimeRef.current = Date.now();
    };

    const handleComplete = () => {
        setIsRunning(false);
        onComplete();
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const handleStop = () => {
        if (canStop) {
            handleComplete();
        }
    };

    const progress = timeLeft / duration;
    const dashOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

    return (
        <div className="circular-timer">
            <svg width="350" height="350" viewBox="0 0 350 350">
                {/* Gradient definitions */}
                <defs>
                    <radialGradient id="progressGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#7ee8f4" />
                        <stop offset="90%" stopColor="#4dd0e1" />
                        <stop offset="100%" stopColor="#00bcd4" />
                    </radialGradient>
                    <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="rgba(0, 0, 0, 0.9)" />
                        <stop offset="70%" stopColor="rgba(255, 255, 255, 0.05)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.15)" />
                    </radialGradient>
                    <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                        <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
                        <feComposite in="SourceAlpha" in2="offsetBlur" operator="out" result="innerShadow" />
                        <feFlood flood-color="rgba(0,0,0,0.3)" result="color" />
                        <feComposite in="color" in2="innerShadow" operator="in" result="shadow" />
                        <feComposite in="shadow" in2="SourceAlpha" operator="in" result="final" />
                        <feMerge>
                            <feMergeNode in="SourceGraphic" />
                            <feMergeNode in="final" />
                        </feMerge>
                    </filter>
                    <filter id="outerGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feFlood flood-color="#4dd0e1" flood-opacity="0.3" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {/* Background circle */}
                <circle
                    cx="175"
                    cy="175"
                    r={CIRCLE_RADIUS}
                    className="timer-background"
                    stroke="url(#backgroundGradient)"
                    filter="url(#innerShadow)"
                />
                {/* Progress circle */}
                <circle
                    ref={circleRef}
                    cx="175"
                    cy="175"
                    r={CIRCLE_RADIUS}
                    className="timer-progress"
                    style={{
                        strokeDasharray: CIRCLE_CIRCUMFERENCE,
                        strokeDashoffset: dashOffset
                    }}
                    stroke="url(#progressGradient)"
                    filter="url(#outerGlow)"
                    transform="rotate(-90 175 175)"
                />
            </svg>
            
            <div className="timer-content">
                {showCountdown ? (
                    <div className="countdown">{countdown}</div>
                ) : !isRunning ? (
                    <button 
                        className="start-button" 
                        onClick={handleStart}
                        disabled={isRunning}
                    >
                        <FaWalking className="start-button-icon" />
                        <div className="start-button-text">Start</div>
                    </button>
                ) : (
                    <>
                        <div className="speed"><div className="speed-value">{speed}</div>км/ч</div>
                        <div className="time-left">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        {canStop && (
                            <button className="stop-button" onClick={handleStop}>
                                Stop
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CircularTimer;
