// After paying in the popup tab (VNPay/Momo), the original Billing/Cashier tab has no way to
// know the payment finished. Reload its data whenever the tab regains focus (e.g. the user
// switches back after the popup closes) instead of requiring a manual page refresh.
window.mediconnectFocusReload = {
    handler: null,
    register(dotNetRef) {
        this.unregister();
        this.handler = () => dotNetRef.invokeMethodAsync('OnWindowFocus').catch(() => { });
        window.addEventListener('focus', this.handler);
    },
    unregister() {
        if (this.handler) {
            window.removeEventListener('focus', this.handler);
            this.handler = null;
        }
    }
};
