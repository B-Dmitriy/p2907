class Validator {
    isIsoDate(str: string) {
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
        const d = new Date(str);
        return d instanceof Date && !isNaN(d.getTime()) && d.toISOString() === str; // valid date 
    }

    isNotNullOrIsoDate(value: string | null) {
        if (typeof value === 'string') {
            return this.isIsoDate(value);
        }
        if (value === null) {
            return true;
        }
        return false;
    }
}

export const validator = new Validator();