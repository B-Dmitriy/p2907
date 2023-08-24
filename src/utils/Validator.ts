class Validator {
    isNullOrISO (value: string | null): boolean {
        if (typeof value === 'string') {
            if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) return false;
            const d = new Date(value);
            return d instanceof Date && !isNaN(d.getTime()) && d.toISOString() === value;
        }
        if (value === null) {
            return true;
        }
        return false;
    }
}

export const validator = new Validator();
