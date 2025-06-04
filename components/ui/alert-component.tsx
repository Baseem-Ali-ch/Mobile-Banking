"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

// Alert types
type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Alert {
    id: string;
    type: AlertType;
    title: string;
    description?: string;
    duration?: number;
}

interface AlertContextType {
    showAlert: (alert: Omit<Alert, 'id'>) => void;
}

// Create context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Custom hook to use alert
export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return context;
};

// Alert component
const AlertComponent: React.FC<{
    alert: Alert;
    onClose: (id: string) => void;
}> = ({ alert, onClose }) => {
    const [progress, setProgress] = useState(100);
    const [isVisible, setIsVisible] = useState(false);
    const duration = alert.duration || 3000;

    useEffect(() => {
        // Slide in animation
        setTimeout(() => setIsVisible(true), 100);

        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const decrement = 100 / (duration / 100);
                return Math.max(0, prev - decrement);
            });
        }, 100);

        // Auto close
        const closeTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(alert.id), 300);
        }, duration);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(closeTimer);
        };
    }, [alert.id, duration, onClose]);

    const getAlertStyles = () => {
        const baseStyles = "border-l-4 shadow-lg backdrop-blur-sm";

        switch (alert.type) {
            case 'success':
                return `${baseStyles} bg-green-50/90 border-green-500 text-green-800`;
            case 'error':
                return `${baseStyles} bg-red-50/90 border-red-500 text-red-800`;
            case 'warning':
                return `${baseStyles} bg-yellow-50/90 border-yellow-500 text-yellow-800`;
            case 'info':
                return `${baseStyles} bg-blue-50/90 border-blue-500 text-blue-800`;
            default:
                return `${baseStyles} bg-gray-50/90 border-gray-500 text-gray-800`;
        }
    };

    const getProgressBarColor = () => {
        switch (alert.type) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            case 'info': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getIcon = () => {
        const iconProps = { size: 20, className: "flex-shrink-0" };

        switch (alert.type) {
            case 'success': return <CheckCircle {...iconProps} className="text-green-600" />;
            case 'error': return <XCircle {...iconProps} className="text-red-600" />;
            case 'warning': return <AlertCircle {...iconProps} className="text-yellow-600" />;
            case 'info': return <Info {...iconProps} className="text-blue-600" />;
            default: return <Info {...iconProps} className="text-gray-600" />;
        }
    };

    return (
        <div
            className={`
        fixed top-4 right-4 z-50 w-80 max-w-sm rounded-lg overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getAlertStyles()}
      `}
            style={{ maxWidth: 'calc(100vw - 2rem)' }}
        >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 h-1 bg-black/10 w-full">
                <div
                    className={`h-full transition-all duration-100 ease-linear ${getProgressBarColor()}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Alert content */}
            <div className="p-4 pt-6">
                <div className="flex items-start space-x-3">
                    {getIcon()}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                        {alert.description && (
                            <p className="text-sm opacity-90">{alert.description}</p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => onClose(alert.id), 300);
                        }}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    const showAlert = (alertData: Omit<Alert, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newAlert: Alert = { ...alertData, id };

        setAlerts((prev) => [...prev, newAlert]);
    };

    const removeAlert = (id: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {/* Render alerts */}
            <div className="fixed top-4 right-4 z-50 w-80 max-w-sm space-y-4">
                {alerts.map((alert, index) => (
                    <div
                        key={alert.id}
                        className="pointer-events-auto"
                        style={{
                            transform: `translateY(${index * 10}px)`,
                            transition: 'transform 0.3s ease-in-out',
                            opacity: 1,
                            animation: 'slideIn 0.3s ease-out'
                        }}
                    >
                        <AlertComponent alert={alert} onClose={removeAlert} />
                    </div>
                ))}
            </div>
        </AlertContext.Provider>
    );
};

// Add CSS animation
const AlertProviderWithStyles = () => {
    return (
        <>
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            <AlertProvider />
        </>
    );
};

export default AlertProviderWithStyles;