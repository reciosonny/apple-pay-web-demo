// import { GooglePayment } from "braintree-web";

import { GooglePayment } from "./google-payment";

interface Window {
    GooglePay: GooglePayment;
    braintree: {
        googlePayment: GooglePayment;
    }
}
