// import { GooglePayment, GooglePaymentTokenizePayload } from "braintree-web";
import { GooglePayment, GooglePaymentTokenizePayload } from "@/google-payment";
import React, { useEffect, useRef, useState } from "react";

const GooglePayButton = () => {
    const [googlePayInitialized, setGooglePayInitialized] = useState(false);
    const refGoogleButtonPlaceholder = useRef<any>({ current: null });

    const setupGooglePayButton = async () => {
        if (!window.braintree) {
            throw "Braintree client not loaded yet";
        }
        if (googlePayInitialized) {
            return;
        }

        console.log("initializing braintree", window.braintree);
        // Make sure to have https://pay.google.com/gp/p/js/pay.js loaded on your page

        // You will need a button element on your page styled according to Google's brand guidelines
        // https://developers.google.com/pay/api/web/guides/brand-guidelines
        var paymentsClient = await new google.payments.api.PaymentsClient({
            environment: "TEST", // Or 'PRODUCTION'
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

        const isReadyToPay = await paymentsClient.isReadyToPay({
            // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest for all options
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods:
                (await googlePaymentInstance.createPaymentDataRequest()).allowedPaymentMethods,
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

            refGoogleButtonPlaceholder.current?.appendChild(button);
        }

        setGooglePayInitialized(true);
    };

    // Implementation of requesting payment here...
    const requestPaymentGooglePay = async (
        googlePayInstance: GooglePayment,
        paymentsClient: google.payments.api.PaymentsClient
    ) => {
        console.log("requesting payment", googlePayInstance);
        var paymentDataRequest = await googlePayInstance.createPaymentDataRequest({
            transactionInfo: {
                currencyCode: "USD",
                totalPriceStatus: "FINAL",
                totalPrice: "1.00", // Your amount
            },
            merchantInfo: {
                merchantId: "v3rx8zbpkdzts6jw",
                merchantName: "Sample Merchant name (Petcircle)",
            },
        });

        // We recommend collecting billing address information, at minimum
        // billing postal code, and passing that billing postal code with all
        // Google Pay card transactions as a best practice.
        // See all available options at https://developers.google.com/pay/api/web/reference/object
        // NOTE: Billing address may not be required to be gathered for all transactions
        // var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
        // cardPaymentMethod.parameters.billingAddressRequired = true; //note: may not be required
        // cardPaymentMethod.parameters.billingAddressParameters = {
        //     format: "FULL",
        //     phoneNumberRequired: true,
        // };

        console.log("paymentDataRequest", paymentDataRequest);

        try {
            // show the Google Pay payment sheet
            const paymentData = await paymentsClient.loadPaymentData(
                paymentDataRequest
            );

            const parsedResponseWithNonce: GooglePaymentTokenizePayload = await googlePayInstance.parseResponse(
                paymentData
            );

            console.log("paymentData", paymentData);
            console.log("parsedResponse with NONCE", parsedResponseWithNonce);
        } catch (ex) {
            // Handle errors
            console.error("error", ex);
        }
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
            <div ref={refGoogleButtonPlaceholder}></div>
        </div>
    );
};

export default GooglePayButton;
