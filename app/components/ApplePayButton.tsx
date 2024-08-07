// @ts-nocheck
import React, { useEffect, useState } from "react";

const ApplePayButton = () => {
    const [canMakePayments, setCanMakePayments] = useState(false);
    const [applePayInitialized, setApplePayInitialized] = useState(false);
    const [applePayInstance, setApplePayInstance] = useState(null);
    const [error, setError] = useState(null);

    const initializeApplePay = () => {
        console.log("attempting to initialize apple pay...");

        try {
            // Step 1: Check if Apple Pay button is compatible with the device and browser
            if (!window.ApplePaySession) {
                throw "Apple Pay not supported";
            }

            if (!window.ApplePaySession.canMakePayments()) {
                throw "This device is not capable of making Apple Pay payments";
            }

            if (!window.braintree) {
                throw "Braintree client not loaded yet";
            }

            // Step 2: Initialize Braintree client and Apple Pay instance
            window.braintree.client.create(
                {
                    authorization: "sandbox_mf5b44gq_v3rx8zbpkdzts6jw",
                },
                function (clientErr, clientInstance) {
                    if (clientErr) {
                        throw "Error creating Braintree client: " + clientErr;
                    }

                    console.log("Braintree Client created:", clientInstance);

                    window.braintree.applePay.create(
                        {
                            client: clientInstance,
                        },
                        function (applePayErr, applePayInstance) {
                            if (applePayErr) {
                                throw (
                                    "Error creating Apple Pay instance: " +
                                    applePayErr
                                );
                            }

                            console.log(
                                "Apple Pay instance created:",
                                applePayInstance
                            );

                            setApplePayInstance(applePayInstance);
                            setCanMakePayments(true);
                        }
                    );
                }
            );
        } catch (ex) {
            console.error("Error initializing Apple Pay:", ex);
            setError("Error initializing Apple Pay");
        } finally {
            setApplePayInitialized(true);
        }
    };

    useEffect(() => {
        if (!window) {
            console.log("window object not yet initialized");
            return;
        }

        setTimeout(() => {
            //have to wait for braintree to load in this method as Next/Vercel doesn't support window object inside useEffect
            initializeApplePay();
        }, 5000);
    }, []);

    const handleApplePayButtonClick = () => {
        console.log("Apple Pay button clicked");

        var paymentRequest = applePayInstance.createPaymentRequest({
            total: {
                label: "My Store",
                amount: "19.99",
            },

            // We recommend collecting billing address information, at minimum
            // billing postal code, and passing that billing postal code with
            // all Apple Pay transactions as a best practice.
            requiredBillingContactFields: ["postalAddress"],
        });
        console.log(paymentRequest.countryCode);
        console.log(paymentRequest.currencyCode);
        console.log(paymentRequest.merchantCapabilities);
        console.log(paymentRequest.supportedNetworks);

        var session = new ApplePaySession(3, paymentRequest);

        console.log("Payment request:", paymentRequest);
        console.log("Starting apple pay session");

        const session = new ApplePaySession(3, paymentRequest);

        session.onvalidatemerchant = (event) => {
            console.log("Merchant validation would happen here");

            // performs validation
            applePayInstance.performValidation(
                {
                    validationURL: event.validationURL,
                    displayName: "My Store",
                },
                function (err, merchantSession) {
                    if (err) {
                        // You should show an error to the user, e.g. 'Apple Pay failed to load.'
                        return;
                    }
                    session.completeMerchantValidation(merchantSession);
                }
            );

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

    if (!applePayInitialized) {
        return <p>Initializing Apple Pay...</p>;
    }

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
                        className="apple-pay-button apple-pay-button-black"
                        onClick={handleApplePayButtonClick}
                    ></div>

                    <h3 style={{ marginTop: "20px" }}>Button with text</h3>
                    <div
                        className="apple-pay-button-with-text apple-pay-button-white-with-text"
                        onClick={() => alert("testing apple pay button")}
                    >
                        <span className="text">Custom buy with</span>
                        <span className="logo"></span>
                    </div>
                </div>
            ) : (
                <p>Apple Pay is not available.</p>
            )}
        </div>
    );
};

export default ApplePayButton;
