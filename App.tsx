import React, { useState, useEffect, useCallback, useRef } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ParkingDashboard from './components/ParkingDashboard';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import OperatorPage from './pages/OperatorPage';
import SupervisorPage from './pages/SupervisorPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import TicketPointPage from './pages/TicketPointPage';
import ForcePasswordChange from './components/ForcePasswordChange';
import { User, ParkingSpot, ParkingRecommendation, ActiveParkingSession, ParkingSpotStatus, PendingCashTransaction, UserNotification, Vehicle, Booking } from './types';
import { logout } from './services/authService';
import { updateSpotStatus } from './services/parkingService';
import * as profileService from './services/profileService';
import { createPendingTransaction } from './services/ticketPointService';
import { playNotificationSound } from './utils/notifications';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { generateReceiptPdf, ReceiptTranslations } from './utils/receiptGenerator';
import HelpPage from './pages/HelpPage';
import AdminHelpPage from './pages/admin/AdminHelpPage';
import SupervisorHelpPage from './pages/supervisor/SupervisorHelpPage';
import OperatorHelpPage from './pages/operator/OperatorHelpPage';
import SellerHelpPage from './pages/seller/SellerHelpPage';

const AppContent: React.FC = () => {
    const { t } = useLanguage();
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard' | 'booking' | 'admin' | 'operator' | 'supervisor' | 'profile' | 'subscriptions' | 'ticket_point' | 'forcePasswordChange' | 'terms' | 'privacy' | 'help' | 'admin_help' | 'supervisor_help' | 'operator_help' | 'seller_help'>('login');
    const [bookingDetails, setBookingDetails] = useState<{
        spot: ParkingSpot | ParkingRecommendation | null;
        vehicle: Vehicle | null;
        entryTime?: string;
        exitTime?: string;
        precalculatedCost?: number;
        precalculatedDuration?: number;
    }>({ spot: null, vehicle: null });
    const [activeSessions, setActiveSessions] = useState<ActiveParkingSession[]>([]);
    const [timedAlert, setTimedAlert] = useState<{ message: string, key: number } | null>(null);
    const [creditBalance, setCreditBalance] = useState<number | null>(null);
    
    // Use refs to store latest values without causing re-renders
    const userRef = useRef<User | null>(null);
    const activeSessionsRef = useRef<ActiveParkingSession[]>([]);
    const tRef = useRef(t);
    
    // Keep refs in sync with state
    useEffect(() => {
        userRef.current = user;
    }, [user]);
    
    useEffect(() => {
        activeSessionsRef.current = activeSessions;
    }, [activeSessions]);
    
    useEffect(() => {
        tRef.current = t;
    }, [t]);

    const showTimedAlert = useCallback((message: string, playSound = false) => {
        setTimedAlert({ message, key: Date.now() });
        if (playSound) {
            playNotificationSound();
        }
        setTimeout(() => setTimedAlert(null), 5000);
    }, []);

    const getReceiptTranslations = useCallback((): ReceiptTranslations => ({
        receiptTitle: tRef.current('receiptTitle'),
        receiptId: tRef.current('receiptId'),
        dateIssued: tRef.current('dateIssued'),
        billedTo: tRef.current('billedTo'),
        parkingSpot: tRef.current('parkingSpot'),
        stallNumber: tRef.current('stallNumber'),
        vehiclePlate: tRef.current('vehiclePlate'),
        startTime: tRef.current('startTime'),
        endTime: tRef.current('endTime'),
        receiptPaymentMethod: tRef.current('receiptPaymentMethod'),
        receiptCreditCard: tRef.current('receiptCreditCard'),
        receiptCash: tRef.current('receiptCash'),
        description: tRef.current('description'),
        duration: tRef.current('duration'),
        rate: tRef.current('rate'),
        amountColumn: tRef.current('amountColumn'),
        parkingSession: tRef.current('parkingSession'),
        minutes: tRef.current('minutes'),
        totalPaid: tRef.current('totalPaid'),
        thankYouMessage: tRef.current('thankYouMessage'),
    }), []);
    
    const updateUserCredit = useCallback(async (userId: string | undefined) => {
        if (!userId) {
            setCreditBalance(0); // Reset on logout
            return;
        }
        try {
            const balance = await profileService.getUserCreditBalance(userId);
            setCreditBalance(balance);
        } catch (e) {
            console.error("Failed to update credit balance", e);
        }
    }, []);

    // Clear localStorage app data on startup (keep only authentication data and language preference)
    useEffect(() => {
        console.log('[STARTUP] Clearing localStorage app data, keeping only auth and language...');
        const keysToKeep = ['spotnow_auth_users', 'spotnow_locale']; // Keep authentication and language preference
        const allKeys = Object.keys(localStorage);
        
        allKeys.forEach(key => {
            // Remove all spotnow_ keys except those we want to keep
            if (key.startsWith('spotnow_') && !keysToKeep.includes(key)) {
                console.log(`[CLEANUP] Removing localStorage key: ${key}`);
                localStorage.removeItem(key);
            }
            // Also remove activeSessions (not prefixed but app data)
            if (key === 'activeSessions') {
                console.log(`[CLEANUP] Removing localStorage key: ${key}`);
                localStorage.removeItem(key);
            }
        });
        
        console.log('[STARTUP] localStorage cleanup complete. All app data now in PostgreSQL.');
    }, []); // Run only once on mount

    useEffect(() => {
        if (user?.role === 'user') {
            updateUserCredit(user.id);
        } else {
            updateUserCredit(undefined); // Reset if not a user or logged out
        }
    }, [user, updateUserCredit]);

     useEffect(() => {
        const savedSessionsRaw = localStorage.getItem('activeSessions');
        if (savedSessionsRaw) {
            try {
                const savedSessions: ActiveParkingSession[] = JSON.parse(savedSessionsRaw);
                const now = Date.now();
                const stillActiveSessions: ActiveParkingSession[] = [];
                let needsPersist = false;

                for (const session of savedSessions) {
                    const spotId = 'id' in session.spot ? session.spot.id : session.spot.spotId;
                    if (session.endTime < now) {
                        console.log(`Expired session for spot ${spotId} found and cleared.`);
                        updateSpotStatus(spotId, ParkingSpotStatus.AVAILABLE, undefined);
                        needsPersist = true;
                    } else {
                        stillActiveSessions.push(session);
                    }
                }
                
                setActiveSessions(stillActiveSessions);
                
                if (needsPersist) {
                    localStorage.setItem('activeSessions', JSON.stringify(stillActiveSessions));
                }

            } catch (e) {
                console.error("Failed to parse active sessions from localStorage", e);
                localStorage.removeItem('activeSessions');
            }
        }
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'user') return;

        const checkNotifications = () => {
            const notificationsRaw = localStorage.getItem('spotnow_notifications');
            if (!notificationsRaw) return;

            let notifications: UserNotification[] = JSON.parse(notificationsRaw);
            const userNotifications = notifications.filter(n => n.userId === user.id);

            if (userNotifications.length > 0) {
                userNotifications.forEach(n => {
                    showTimedAlert(n.message, true);
                });

                // Remove shown notifications
                const remainingNotifications = notifications.filter(n => n.userId !== user.id);
                localStorage.setItem('spotnow_notifications', JSON.stringify(remainingNotifications));
            }
        };

        const interval = setInterval(checkNotifications, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);

    }, [user, showTimedAlert]);

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        if (loggedInUser.passwordNeedsReset) {
            setCurrentPage('forcePasswordChange');
        } else if (loggedInUser.role === 'admin') {
            setCurrentPage('admin');
        } else if (loggedInUser.role === 'supervisor') {
            setCurrentPage('supervisor');
        } else if (loggedInUser.role === 'operator') {
            setCurrentPage('operator');
        } else if (loggedInUser.role === 'ticket_point') {
            setCurrentPage('ticket_point');
        } else {
            setCurrentPage('dashboard');
        }
    };
    
    const handlePasswordChanged = () => {
        if (user) {
           setUser({ ...user, passwordNeedsReset: false });
           if (user.role === 'admin') {
                setCurrentPage('admin');
            } else if (user.role === 'supervisor') {
                setCurrentPage('supervisor');
            } else if (user.role === 'operator') {
                setCurrentPage('operator');
            } else if (user.role === 'ticket_point') {
                setCurrentPage('ticket_point');
            } else {
                setCurrentPage('dashboard');
            }
        }
    }

    const handleLogout = useCallback(async () => {
        await logout();
        setUser(null);
        setCurrentPage('login');
    }, []);

    const handleNavigate = useCallback((page: 'login' | 'register' | 'dashboard' | 'profile' | 'admin' | 'subscriptions' | 'terms' | 'privacy' | 'help' | 'admin_help' | 'supervisor_help' | 'operator_help' | 'seller_help') => {
        setCurrentPage(page);
    }, []);

    const handleStartBookingFlow = useCallback((
        spot: ParkingSpot | ParkingRecommendation, 
        vehicle: Vehicle,
        entryTime?: string,
        exitTime?: string
    ) => {
        // Check if parking is covered or uncovered
        const parkingSpot = 'id' in spot ? spot : null;
        const isCoveredParking = parkingSpot?.parkingType === 'covered' || parkingSpot?.parkingType === 'uncovered';
        
        if (isCoveredParking && entryTime && exitTime) {
            // Calculate cost based on entry and exit times
            const entry = new Date(entryTime);
            const exit = new Date(exitTime);
            const durationMs = exit.getTime() - entry.getTime();
            const durationMinutes = durationMs / (1000 * 60);
            const durationHours = durationMinutes / 60;
            const cost = spot.pricePerHour * durationHours;
            
            setBookingDetails({ 
                spot, 
                vehicle, 
                entryTime, 
                exitTime,
                precalculatedCost: cost,
                precalculatedDuration: durationMinutes
            });
        } else {
            setBookingDetails({ spot, vehicle });
        }
        setCurrentPage('booking');
    }, []);
    
    const handleConfirmBooking = (details: {
        duration: number;
        paymentMethod: 'creditCard' | 'credit' | 'mixed-card';
        cost: number;
        creditSpent?: number;
    }) => {
        if (bookingDetails.spot && bookingDetails.vehicle && user) {
            const now = Date.now();
            const spotId = 'id' in bookingDetails.spot ? bookingDetails.spot.id : bookingDetails.spot.spotId;
            const isPostPaid = details.paymentMethod === 'creditCard';
            
            const session: ActiveParkingSession = {
                sessionId: `${spotId}_${now}`,
                spot: bookingDetails.spot,
                startTime: now,
                endTime: now + details.duration * 60 * 1000,
                vehicle: bookingDetails.vehicle,
                duration: details.duration,
                paymentMethod: details.paymentMethod,
                cost: details.cost,
                isPostPaid: isPostPaid,
                creditSpent: details.creditSpent || 0,
                fixedFee: bookingDetails.spot.pricePerHour / 2,
            };
            
            setActiveSessions(prevSessions => {
                const newSessions = [...prevSessions, session];
                localStorage.setItem('activeSessions', JSON.stringify(newSessions));
                return newSessions;
            });
    
            if (details.creditSpent && details.creditSpent > 0) {
                const spotCode = 'code' in bookingDetails.spot ? bookingDetails.spot.code : spotId;
                profileService.addCreditTransaction(user.id, -details.creditSpent, t('creditTxPayment', { spotCode }))
                    .then(() => updateUserCredit(user.id));
            }
    
            updateSpotStatus(spotId, ParkingSpotStatus.OCCUPIED, new Date(session.endTime).toISOString());
    
            setCurrentPage('dashboard');
            setBookingDetails({ spot: null, vehicle: null });
            const spotCode = 'code' in bookingDetails.spot ? bookingDetails.spot.code : spotId;
            showTimedAlert(t('parkingStarted', { spotCode }));
        }
    };

    const handleInitiateCashBooking = async (details: { duration: number; cost: number, creditApplied?: number }): Promise<string> => {
        if (bookingDetails.spot && bookingDetails.vehicle && user) {
            const transactionId = await createPendingTransaction({
                spot: bookingDetails.spot,
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`,
                vehicle: bookingDetails.vehicle,
                ...details
            });

            // The BookingPage will handle showing the QR code.
            // The navigation back to the dashboard will happen when the QR modal is closed.
            showTimedAlert(t('cashBookingInitiated'));
            return transactionId;
        }
        throw new Error("User, Spot, or Vehicle not defined for cash booking.");
    };

    const handleCashBookingConfirmed = () => {
        const savedSessionsRaw = localStorage.getItem('activeSessions');
        if (savedSessionsRaw) {
            try {
                const savedSessions: ActiveParkingSession[] = JSON.parse(savedSessionsRaw);
                setActiveSessions(prevSessions => {
                    const newSession = savedSessions.find(s => !prevSessions.some(old => old.sessionId === s.sessionId));
                    if (newSession) {
                        showTimedAlert(t('parkingActivated', { plate: newSession.vehicle.plate }));
                    }
                    return savedSessions;
                });
            } catch(e) {
                console.error("Failed to parse active sessions after cash booking", e);
            }
        }
        setCurrentPage('dashboard');
        setBookingDetails({ spot: null, vehicle: null });
    };

    const handleStopParking = useCallback(async (sessionId: string) => {
        const sessionToStop = activeSessionsRef.current.find(s => s.sessionId === sessionId);
        const currentUser = userRef.current;
        if (sessionToStop && currentUser) {
            const spotCode = 'code' in sessionToStop.spot ? sessionToStop.spot.code : sessionToStop.spot.spotId;
            
            const actualEndTime = Date.now();
            const actualDurationMs = actualEndTime - sessionToStop.startTime;
            const actualDurationMinutes = Math.max(0, actualDurationMs / (1000 * 60));
    
            const pricePerHour = sessionToStop.spot.pricePerHour;
            const minimumChargeMinutes = 30;
    
            let finalCost: number;
    
            if (actualDurationMinutes < minimumChargeMinutes) {
                finalCost = (pricePerHour / 60) * minimumChargeMinutes;
            } else {
                finalCost = (pricePerHour / 60) * actualDurationMinutes;
            }
    
            const bookingRecord: Booking = {
                id: `booking_${sessionId}`,
                userId: currentUser.id,
                userName: `${currentUser.firstName} ${currentUser.lastName}`,
                vehicleId: sessionToStop.vehicle.id,
                vehiclePlate: sessionToStop.vehicle.plate,
                spotId: 'id' in sessionToStop.spot ? sessionToStop.spot.id : sessionToStop.spot.spotId,
                startTime: new Date(sessionToStop.startTime),
                endTime: new Date(actualEndTime),
                amount: finalCost,
                status: 'completed',
                spotAddress: sessionToStop.spot.address || 'N/A',
                paymentMethod: sessionToStop.paymentMethod,
                stallNumber: 'code' in sessionToStop.spot ? sessionToStop.spot.code : undefined, // Include stall number if available
            };
    
            const receiptUrl = await generateReceiptPdf(bookingRecord, getReceiptTranslations());
            bookingRecord.receiptUrl = receiptUrl;
    
            const historyRaw = localStorage.getItem('spotnow_booking_history');
            const history: Booking[] = historyRaw ? JSON.parse(historyRaw) : [];
            history.unshift(bookingRecord);
            localStorage.setItem('spotnow_booking_history', JSON.stringify(history));
            
            if (sessionToStop.isPostPaid) {
                showTimedAlert(tRef.current('parkingStoppedAndCharged', { spotCode, cost: finalCost.toFixed(2) }));
            } else {
                const prepaidAmount = sessionToStop.cost || 0;
                const residual = prepaidAmount - finalCost;
                
                if (residual > 0.01) {
                    await profileService.addCreditTransaction(currentUser.id, residual, tRef.current('creditTxResidual', { spotCode }));
                    await updateUserCredit(currentUser.id);
                    showTimedAlert(tRef.current('parkingEndedWithCredit', { spotCode, cost: finalCost.toFixed(2), credit: residual.toFixed(2) }));
                } else {
                     showTimedAlert(tRef.current('parkingEnded', { spotCode, cost: finalCost.toFixed(2) }));
                }
            }
            
            setActiveSessions(prevSessions => {
                const newSessions = prevSessions.filter(s => s.sessionId !== sessionId);
                localStorage.setItem('activeSessions', JSON.stringify(newSessions));
                return newSessions;
            });
        }
    }, [showTimedAlert, getReceiptTranslations]);
    
    const handleSessionEnd = useCallback(async (sessionId: string) => {
        const sessionToEnd = activeSessionsRef.current.find(s => s.sessionId === sessionId);
        const currentUser = userRef.current;
        if (sessionToEnd && currentUser) {
            const spotCode = 'code' in sessionToEnd.spot ? sessionToEnd.spot.code : sessionToEnd.spot.spotId;

            const finalCost = sessionToEnd.cost || 0;

            const bookingRecord: Booking = {
                id: `booking_${sessionId}`,
                userId: currentUser.id,
                userName: `${currentUser.firstName} ${currentUser.lastName}`,
                vehicleId: sessionToEnd.vehicle.id,
                vehiclePlate: sessionToEnd.vehicle.plate,
                spotId: 'id' in sessionToEnd.spot ? sessionToEnd.spot.id : sessionToEnd.spot.spotId,
                startTime: new Date(sessionToEnd.startTime),
                endTime: new Date(sessionToEnd.endTime),
                amount: finalCost,
                status: 'completed',
                spotAddress: sessionToEnd.spot.address || 'N/A',
                paymentMethod: sessionToEnd.paymentMethod,
                stallNumber: 'code' in sessionToEnd.spot ? sessionToEnd.spot.code : undefined, // Include stall number if available
            };
            
            const receiptUrl = await generateReceiptPdf(bookingRecord, getReceiptTranslations());
            bookingRecord.receiptUrl = receiptUrl;

            const historyRaw = localStorage.getItem('spotnow_booking_history');
            const history: Booking[] = historyRaw ? JSON.parse(historyRaw) : [];
            history.unshift(bookingRecord);
            localStorage.setItem('spotnow_booking_history', JSON.stringify(history));
            
            if (sessionToEnd.isPostPaid) {
                showTimedAlert(tRef.current('sessionEndedAndCharged', { spotCode, cost: finalCost.toFixed(2) }), true);
            } else {
                const prepaidAmount = sessionToEnd.cost || 0;
                const residual = prepaidAmount - finalCost;
                
                if (residual > 0.01) {
                    await profileService.addCreditTransaction(currentUser.id, residual, tRef.current('creditTxResidual', { spotCode }));
                    await updateUserCredit(currentUser.id);
                    showTimedAlert(tRef.current('sessionExpiredWithCredit', { spotCode, credit: residual.toFixed(2) }), true);
                } else {
                    showTimedAlert(tRef.current('sessionExpired', { spotCode }), true);
                }
            }

            setActiveSessions(prevSessions => {
                const newSessions = prevSessions.filter(s => s.sessionId !== sessionId);
                localStorage.setItem('activeSessions', JSON.stringify(newSessions));
                return newSessions;
            });
        }
    }, [showTimedAlert, getReceiptTranslations]);

    const handleExtendSession = useCallback((sessionId: string, minutesToAdd: number, creditUsed: number) => {
        const sessionToExtend = activeSessionsRef.current.find(s => s.sessionId === sessionId);
        const currentUser = userRef.current;
        if (sessionToExtend && currentUser) {
            const extensionCost = (sessionToExtend.spot.pricePerHour / 60) * minutesToAdd;
            const newSession = {
                ...sessionToExtend,
                endTime: sessionToExtend.endTime + minutesToAdd * 60 * 1000,
                cost: (sessionToExtend.cost || 0) + extensionCost,
            };
            
            if (creditUsed > 0) {
                const spotCode = 'code' in newSession.spot ? newSession.spot.code : newSession.spot.spotId;
                profileService.addCreditTransaction(currentUser.id, -creditUsed, tRef.current('creditTxExtend', { spotCode }))
                    .then(() => updateUserCredit(currentUser.id));
            }

            setActiveSessions(prevSessions => {
                const newSessions = prevSessions.map(s => s.sessionId === sessionId ? newSession : s);
                localStorage.setItem('activeSessions', JSON.stringify(newSessions));
                return newSessions;
            });
            
            const spotId = 'id' in newSession.spot ? newSession.spot.id : newSession.spot.spotId;
            updateSpotStatus(spotId, ParkingSpotStatus.OCCUPIED, new Date(newSession.endTime).toISOString());
            
            showTimedAlert(tRef.current('sessionExtended', { minutes: minutesToAdd }));
        }
    }, [showTimedAlert]);

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
            case 'register':
                return <RegisterPage onNavigate={handleNavigate} onRegisterSuccess={() => setCurrentPage('login')} />;
            case 'forcePasswordChange':
                return user ? <ForcePasswordChange user={user} onSuccess={handlePasswordChanged} /> : <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
            case 'dashboard':
                return <ParkingDashboard 
                            user={user} 
                            onLogout={handleLogout} 
                            onStartBookingFlow={handleStartBookingFlow} 
                            onNavigate={handleNavigate}
                            activeSessions={activeSessions}
                            onStopParking={handleStopParking}
                            onSessionEnd={handleSessionEnd}
                            onShowTimedAlert={showTimedAlert}
                            onExtendSession={handleExtendSession}
                            creditBalance={creditBalance}
                       />;
            case 'booking':
                return bookingDetails.spot && bookingDetails.vehicle && user ? (
                    <BookingPage 
                        spot={bookingDetails.spot} 
                        vehicle={bookingDetails.vehicle}
                        precalculatedCost={bookingDetails.precalculatedCost}
                        precalculatedDuration={bookingDetails.precalculatedDuration}
                        entryTime={bookingDetails.entryTime}
                        exitTime={bookingDetails.exitTime}
                        onConfirmBooking={handleConfirmBooking}
                        onInitiateCashBooking={handleInitiateCashBooking}
                        onCashBookingConfirmed={handleCashBookingConfirmed}
                        onBack={() => {
                            setCurrentPage('dashboard');
                            setBookingDetails({ spot: null, vehicle: null });
                        }} 
                        userId={user.id}
                    />
                ) : <p>Error: No spot or vehicle selected, or user not logged in.</p>;
            case 'admin':
                return <AdminPage user={user} onLogout={handleLogout} onNavigate={() => setCurrentPage('dashboard')} />;
            case 'operator':
                return <OperatorPage user={user} onLogout={handleLogout} showTimedAlert={showTimedAlert} onNavigate={handleNavigate} />;
            case 'supervisor':
                return <SupervisorPage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
            case 'ticket_point':
                return <TicketPointPage user={user} onLogout={handleLogout} />;
            case 'profile':
                return user ? <ProfilePage user={user} onBack={() => setCurrentPage('dashboard')} onNavigate={handleNavigate} /> : null;
            case 'subscriptions':
                return user ? <SubscriptionsPage userId={user.id} onBack={() => setCurrentPage('profile')} /> : null;
            case 'terms':
                return <TermsAndConditionsPage onBack={() => setCurrentPage('profile')} />;
            case 'privacy':
                return <PrivacyPolicyPage onBack={() => setCurrentPage('profile')} />;
            case 'help':
                return <HelpPage onBack={() => setCurrentPage('dashboard')} />;
            case 'admin_help':
                return <AdminHelpPage onBack={() => setCurrentPage('admin')} />;
            case 'supervisor_help':
                return <SupervisorHelpPage onBack={() => setCurrentPage('supervisor')} />;
            case 'operator_help':
                return <OperatorHelpPage onBack={() => setCurrentPage('operator')} />;
            case 'seller_help':
                return <SellerHelpPage onBack={() => setCurrentPage('dashboard')} />;
            default:
                return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        }
    };

    return (
        <>
            {renderPage()}
            {timedAlert && (
                 <div key={timedAlert.key} className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-alert-in">
                    {timedAlert.message}
                </div>
            )}
        </>
    );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);

export default App;