// @ts-nocheck
'use client';
import React, { useEffect, useState } from 'react';

const ApplePayButton = () => {
    const [canMakePayments, setCanMakePayments] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeApplePay = () => {
            if (typeof window !== 'undefined' && window.ApplePaySession) {
                const canMakePayments = ApplePaySession.canMakePayments();
                setCanMakePayments(canMakePayments);
                if (!canMakePayments) {
                    setError('Apple Pay is supported but not set up on this device');
                }
            } else {
                setError('Apple Pay is not supported in this browser');
            }
        };

        initializeApplePay();
    }, []);

    const handleApplePayButtonClick = () => {
        const paymentRequest = {
            countryCode: 'US',
            currencyCode: 'USD',
            supportedNetworks: ['visa', 'masterCard', 'amex'],
            merchantCapabilities: ['supports3DS'],
            total: {
                label: 'Your Total',
                amount: '10.00',
            },
        };

        const session = new ApplePaySession(3, paymentRequest);

        session.onvalidatemerchant = (event) => {
            console.log('Merchant validation would happen here');
            // In a real scenario, you'd validate with your server
            session.completeMerchantValidation({});
        };

        session.onpaymentauthorized = (event) => {
            console.log('Payment authorized:', event.payment);
            // In a real scenario, you'd process the payment on your server
            session.completePayment(ApplePaySession.STATUS_SUCCESS);
        };

        session.begin();
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {canMakePayments ? (
                <apple-pay-button
                    buttonstyle="black"
                    type="buy"
                    locale="en"
                    onClick={handleApplePayButtonClick}
                ></apple-pay-button>
            ) : (
                <p>Apple Pay is not available.</p>
            )}
        </div>
    );
};

export default ApplePayButton;