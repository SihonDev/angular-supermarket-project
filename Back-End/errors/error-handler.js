let errorHandler = (e, request, response, next) => {
    // בדיקה אם זו שגיאה מוגדרת מראש (ServerError)
    if (e.errorType !== undefined) {

        // לוג שגיאה מנוהלת - עוזר לזהות בעיות לוגיות או חסמי אבטחה
        if (e.errorType.isShowStackTrace) {
            console.error(`[SYSTEM_ERROR] StackTrace:`, e); 
        } else {
            console.warn(`[APP_WARN] ErrorType: ${e.errorType.message} | HTTP: ${e.errorType.httpCode}`);
        }

        response.status(e.errorType.httpCode).json({ error: e.errorType.message });
        return;
    }

    // לוג שגיאה כללית/לא צפויה - קריטי לניטור יציבות המערכת (Critical)
    console.error(`[CRITICAL_ERROR] Unhandled Exception:`, e);
    
    // שליחת סטטוס שגיאה כללית ללקוח
    response.status(700).json({ error: "General error" });
}

module.exports = errorHandler;