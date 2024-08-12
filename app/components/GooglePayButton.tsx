// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";

const GooglePayButton = () => {
    // const [googlePayInstance, setGooglePayInstance] = useState(null);
    const refGoogleButtonPlaceholder = useRef(null);

    const setupGooglePayButton = async () => {
        if (!window.braintree) {
            throw "Braintree client not loaded yet";
        }

        console.log("initializing braintree", window.braintree);

        // Make sure to have https://pay.google.com/gp/p/js/pay.js loaded on your page

        // You will need a button element on your page styled according to Google's brand guidelines
        // https://developers.google.com/pay/api/web/guides/brand-guidelines
        var button = document.querySelector("#google-pay-button");
        var paymentsClient = await new google.payments.api.PaymentsClient({
            environment: "TEST", // Or 'PRODUCTION'
            // paymentDataCallbacks: { //TODO: Implement these callbacks
            //     onPaymentAuthorized: (paymentData) => {
            //         console.log('payment authorized', paymentData);
            //     },
            //     onPaymentDataChanged: (paymentData) => {
            //         console.log('payment data changed', paymentData);
            //     },
            // },
        });

        const clientInstance = await window.braintree.client.create({
            authorization: "sandbox_mf5b44gq_v3rx8zbpkdzts6jw",
        });

        console.log("braintree client instance", clientInstance);
        console.log("google payments client", paymentsClient);

        const googlePaymentInstance =
            await window.braintree.googlePayment.create({
                client: clientInstance, // From braintree.client.create, see below for full example
                googlePayVersion: 2,
                googleMerchantId: "v3rx8zbpkdzts6jw", // Optional in sandbox; if set in sandbox, this value must be a valid production Google Merchant ID
            });

        // setGooglePayInstance(googlePaymentInstance); //set state for google payment instance

        const isReadyToPay = await paymentsClient.isReadyToPay({
            // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest for all options
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods:
                googlePaymentInstance.createPaymentDataRequest()
                    .allowedPaymentMethods,
            existingPaymentMethodRequired: true,
        });

        console.log("isReadyToPay", isReadyToPay);
        if (isReadyToPay.result) {
            // Set up Google Pay button
            // TODO: Another way to initialize the google pay button??
            const button = paymentsClient.createButton({
                onClick: () =>
                    requestPaymentGooglePay(
                        googlePaymentInstance,
                        paymentsClient
                    ),
                allowedPaymentMethods: [],
            }); // same payment methods as for the loadPaymentData() API call

            refGoogleButtonPlaceholder.current.appendChild(button);
        }

        // window.braintree.googlePayment
        //     .create({
        //         client: clientInstance, // From braintree.client.create, see below for full example
        //         googlePayVersion: 2,
        //         googleMerchantId: "v3rx8zbpkdzts6jw", // Optional in sandbox; if set in sandbox, this value must be a valid production Google Merchant ID
        //     })
        //     .then(function (googlePaymentInstance) {
        //         console.log("googlePaymentInstance", googlePaymentInstance);

        //         setGooglePayInstance(googlePaymentInstance);

        //         return paymentsClient.isReadyToPay({
        //             // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest for all options
        //             apiVersion: 2,
        //             apiVersionMinor: 0,
        //             allowedPaymentMethods:
        //                 googlePaymentInstance.createPaymentDataRequest()
        //                     .allowedPaymentMethods,
        //             existingPaymentMethodRequired: true,
        //         });
        //     })
        //     .then(function (isReadyToPay) {
        //         console.log("isReadyToPay", isReadyToPay);
        //         if (isReadyToPay.result) {
        //             // Set up Google Pay button
        //             const button = paymentsClient.createButton({
        //                 onClick: requestPaymentGooglePay,
        //                 allowedPaymentMethods: [],
        //             }); // same payment methods as for the loadPaymentData() API call

        //             refGoogleButtonPlaceholder.current.appendChild(button);
        //         }
        //     });
    };

    // Implementation of requesting payment here...
    const requestPaymentGooglePay = (googlePayInstance, paymentsClient) => {
        console.log("requesting payment", googlePayInstance);
        var paymentDataRequest = googlePayInstance.createPaymentDataRequest({
            transactionInfo: {
                currencyCode: "USD",
                totalPriceStatus: "FINAL",
                totalPrice: "1.00", // Your amount
            },
            merchantInfo: {
                merchantId: 'v3rx8zbpkdzts6jw',
                merchantName: 'Sample Merchant name (Petcircle)',
            }
        });

        // We recommend collecting billing address information, at minimum
        // billing postal code, and passing that billing postal code with all
        // Google Pay card transactions as a best practice.
        // See all available options at https://developers.google.com/pay/api/web/reference/object
        var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
        cardPaymentMethod.parameters.billingAddressRequired = true;
        cardPaymentMethod.parameters.billingAddressParameters = {
            format: "FULL",
            phoneNumberRequired: true,
        };

        // show the Google Pay payment sheet
        paymentsClient
            .loadPaymentData(paymentDataRequest)
            .then(function (paymentData) {
                console.log("paymentData", paymentData);
                return googlePayInstance.parseResponse(paymentData);
            })
            .then(function (result) {
                // TODO: Send result.nonce to your server
                // result.type may be either "AndroidPayCard" or "PayPalAccount", and
                // paymentData will contain the billingAddress for card payments
                console.log("result", result);
            })
            .catch(function (err) {
                // Handle errors

                console.error("error", err);
            });
    };

    useEffect(() => {
        console.log("google pay button mounted");

        setTimeout(() => {
            setupGooglePayButton();
        }, 3000);
    }, []);

    return (
        <div>
            <h3>This is for google pay button</h3>
            <div>
                <span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Deleniti maxime itaque nostrum iure repellat aut, inventore
                    expedita vitae voluptate magni fuga odio aliquid quisquam?
                    Sunt magnam dicta explicabo quibusdam totam.
                </span>
            </div>
            <div ref={refGoogleButtonPlaceholder}></div>
        </div>
    );
};

export default GooglePayButton;
