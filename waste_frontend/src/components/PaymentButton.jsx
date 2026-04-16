// src/components/PaymentButton.jsx
import API from "../api/api";

export function PaymentButton({ amount, requestId,username,email }) {
    
    const handlePayment = async () => {
        // 1. Create order on the backend
        const res = await API.post('waste/create-order/', { amount, request_id: requestId });
        const order = res.data;

        // 2. Configure Razorpay Options
        const options = {
            key: "YOUR_RAZORPAY_KEY_ID", // Get this from Razorpay Dashboard
            amount: order.amount,
            currency: order.currency,
            name: "KLeen Waste Management",
            description: "Waste Collection Fee",
            order_id: order.id,
            handler: async function (response) {
                // 3. Send payment details to backend for verification
                try {
                    await API.post('waste/verify-payment/', response);
                    alert("Payment Successful!");
                    window.location.reload(); // Refresh to show 'Paid' status
                } catch (err) {
                    alert("Payment verification failed.");
                    console.log(err)
                }
            },
            prefill: {
                name: username, // You can get this from user context
                email: email
            },
            theme: { color: "#034b1b" }, // Your primary blue color
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <button 
            onClick={handlePayment}
            className="bg-blue-600 text-white px-4 py-2 !rounded-lg font-bold hover:bg-blue-700 transition-all"
        >
            Pay ₹{amount}
        </button>
    );
}