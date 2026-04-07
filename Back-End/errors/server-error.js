class ServerError extends Error {

    constructor(errorType, message, innerError) {
        // אם לא סופק מסר ספציפי, משתמשים במסר ברירת המחדל של סוג השגיאה
        super(message || (errorType ? errorType.message : "Internal Server Error"));
        this.errorType = errorType;
        this.innerError = innerError;
        this.name = "ServerError";
        
        // תיעוד פנימי בשרת עבור שגיאות קריטיות (לוגים של SIEM)
        if (errorType && errorType.isShowStackTrace) {
            console.error(`[SYSTEM_CRITICAL] ErrorID: ${errorType.id} | Msg: ${this.message}`);
        }
    }

    [Symbol.iterator]() {
        let current = this;
        let done = false;
        const iterator = {
            next() {
                const val = current;
                if (done) {
                    return { value: val, done: true };
                }
                // שימוש ב-innerError או ב-cause כדי לעבור על שרשרת השגיאות
                current = current.innerError || current.cause;
                if (!current) {
                    done = true;
                }
                return { value: val, done: false };
            }
        };
        return iterator;
    }

    get why() {
        let _why = '';
        for (const e of this) {
            _why += `${_why.length ? ' <- ' : ''}${e.name || 'Error'}: ${e.message}`;
        }
        return _why;
    }
}

module.exports = ServerError;