import React from "react";
import ClientSidePlaceholderGoogle from "../components/ClientSidePlaceholderGoogle";

const GooglePay = () => {
    return (
        <main className="flex min-h-screen flex-col p-24">
            <h2>This is for the google pay</h2>
            <div style={{ marginTop: '6rem' }}>
                <ClientSidePlaceholderGoogle />
            </div>
        </main>
    );
};

export default GooglePay;
