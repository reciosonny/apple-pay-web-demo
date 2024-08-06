"use client";
import React from "react";
import BraintreeDropIn from "./BraintreeDropIn";
import ApplePayButton from "./ApplePayButton";

const ClientSideRenderPlaceholder = () => {
    return (
        <div>
            <BraintreeDropIn />
            <ApplePayButton />
        </div>
    );
};

export default ClientSideRenderPlaceholder;
