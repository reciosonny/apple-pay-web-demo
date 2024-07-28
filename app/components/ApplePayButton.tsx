// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";

const ApplePayButton = () => {
    const [canMakePayments, setCanMakePayments] = useState(false);
    const [error, setError] = useState(null);

    const initializeApplePay = () => {
        console.log('attempting to initialize apple pay...');

        // Step 1: Check if Apple Pay button is compatible with the device and browser
        if (!window.ApplePaySession) {
            console.error("This device does not support Apple Pay");
            setError("This device does not support Apple Pay");

            return;
        }

        if (!window.ApplePaySession.canMakePayments()) {
            console.error(
                "This device is not capable of making Apple Pay payments"
            );
            setError("Apple Pay is supported but not set up on this device");

            return;
        }

        if (!window.braintree.client) {
            console.error("Braintree client not loaded yet");
            return;
        }

        // Step 2: Initialize Braintree client and Apple Pay instance
        window.braintree.client.create(
            {
                authorization: "sandbox_mf5b44gq_v3rx8zbpkdzts6jw",
            },
            function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error("Error creating client:", clientErr);
                    return;
                }

                console.log("Braintree Client created:", clientInstance);

                window.braintree.applePay.create(
                    {
                        client: clientInstance,
                    },
                    function (applePayErr, applePayInstance) {
                        if (applePayErr) {
                            console.error(
                                "Error creating applePayInstance:",
                                applePayErr
                            );
                            return;
                        }

                        console.log("Apple Pay instance created:", applePayInstance);

                        // Set up your Apple Pay button here (such as showing it in the UI)
                        console.log("TODO: Set up Apple Pay button");
                    }
                );
            }
        );
    };

    useEffect(() => {
        initializeApplePay();
    }, [window.braintree]);

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
                    <h3 style={{ marginTop: "20px" }}>
                        {"apple-pay-button"} JS component
                    </h3>
                    <apple-pay-button
                        id="apple-pay-button"
                        buttonstyle="black"
                        type="buy"
                        locale="en"
                        onClick={handleApplePayButtonClick}
                    ></apple-pay-button>

                    <h3 style={{ marginTop: "20px" }}>Simple apple button</h3>
                    <div
                        class="apple-pay-button apple-pay-button-black"
                        onClick={() => alert("testing apple pay button")}
                    ></div>

                    <h3 style={{ marginTop: "20px" }}>Button with text</h3>
                    <div
                        class="apple-pay-button-with-text apple-pay-button-white-with-text"
                        onClick={() => alert("testing apple pay button")}
                    >
                        <span class="text">Custom buy with</span>
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
