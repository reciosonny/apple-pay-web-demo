// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";

const ApplePayButton = () => {
    const [canMakePayments, setCanMakePayments] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeApplePay = () => {
            if (typeof window !== "undefined" && window.ApplePaySession) {
                const canMakePayments = ApplePaySession.canMakePayments();
                setCanMakePayments(canMakePayments);
                if (!canMakePayments) {
                    setError(
                        "Apple Pay is supported but not set up on this device"
                    );
                }
            } else {
                setError("Apple Pay is not supported in this browser");
            }
        };

        initializeApplePay();
    }, []);

    const handleApplePayButtonClick = () => {
        console.log("Apple Pay button clicked");
        const paymentRequest = {
            countryCode: "US",
            currencyCode: "USD",
            supportedNetworks: ["visa", "masterCard", "amex"],
            merchantCapabilities: ["supports3DS"],
            total: {
                label: "Your Total",
                amount: "10.00",
            },
        };

        console.log("Payment request:", paymentRequest);
        console.log("Starting apple pay session");

        const session = new ApplePaySession(3, paymentRequest);

        session.onvalidatemerchant = (event) => {
            console.log("Merchant validation would happen here");
            // In a real scenario, you'd validate with your server
            session.completeMerchantValidation({});
        };

        session.onpaymentauthorized = (event) => {
            console.log("Payment authorized:", event.payment);
            // In a real scenario, you'd process the payment on your server
            session.completePayment(ApplePaySession.STATUS_SUCCESS);
        };

        session.begin();
    };

    return (
        <div style={{ marginTop: "40px" }}>
            <h2>Apple Pay Button goes here</h2>
            {canMakePayments ? (
                <div>
                    <h3 style={{ marginTop: "20px" }}>{"apple-pay-button"} JS component</h3>
                    <apple-pay-button
                        id="apple-pay-button"
                        buttonstyle="black"
                        type="buy"
                        locale="en"
                        onClick={handleApplePayButtonClick}
                    ></apple-pay-button>

                    <h3 style={{ marginTop: "20px" }}>Simple apple button</h3>
                    <div class="apple-pay-button apple-pay-button-black" onClick={() => alert('testing apple pay button')}></div>

                    <h3 style={{ marginTop: "20px" }}>Button with text</h3>
                    <div class="apple-pay-button-with-text apple-pay-button-white-with-text" onClick={() => alert('testing apple pay button')}>
                        <span class="text">Buy with</span>
                        <span class="logo"></span>
                    </div>
                </div>
            ) : (
                <p>Apple Pay is not available.</p>
            )}
        </div>
    );
};

export default ApplePayButton;
