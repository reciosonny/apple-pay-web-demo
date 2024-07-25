"use client"

import React, { useEffect } from "react";
import dropin from "braintree-web-drop-in";

const BraintreeDropIn = () => {
    useEffect(() => {
        dropin.create(
            {
                authorization: "sandbox_mf5b44gq_v3rx8zbpkdzts6jw",
                container: "#dropin-container",
            },
            function (createErr: any, instance: any) {
                console.log('testing functionalities');
                // button.addEventListener("click", function () {
                //     instance.requestPaymentMethod(function (
                //         requestPaymentMethodErr,
                //         payload
                //     ) {
                //         // Submit payload.nonce to your server
                //     });
                // });
            }
        );
        return () => {};
    }, []);

    return (
        <div>
            <div id="dropin-container"></div>
            <button id="submit-button" style={{ border: '1px solid #fff', borderRadius: '20px', padding: '10px' }}>Request payment method</button>
        </div>
    );
};

export default BraintreeDropIn;
