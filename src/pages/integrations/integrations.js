export function setPrice(isFiat, amount) {
    return {
        fiat: isFiat ? amount : undefined,
        qty: isFiat ? undefined : amount
    };
}
//# sourceMappingURL=integrations.js.map