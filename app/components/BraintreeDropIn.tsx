"use client";

import React, { useEffect } from "react";
// @ts-ignore
import dropin from "braintree-web-drop-in";

const BraintreeDropIn = () => {
    useEffect(() => {
        dropin.create(
            {
                authorization: "sandbox_mf5b44gq_v3rx8zbpkdzts6jw",
                container: "#dropin-container",
            },
            function (createErr: any, instance: any) {
                console.log("testing functionalities");
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
            <h2>Braintree drop-in goes here</h2>
            <div id="dropin-container" style={{ width: '400px' }}></div>
        </div>
    );
};

export default BraintreeDropIn;
