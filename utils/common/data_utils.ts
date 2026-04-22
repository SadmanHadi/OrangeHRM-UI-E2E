export function randomString(length = 8): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i += 1) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function uniqueSuffix(prefix: string): string {
    return `${prefix}_${Date.now().toString(36)}`;
}
