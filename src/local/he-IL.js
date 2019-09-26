const local = {
  LANG_DIR: 'rtl',
  LANG_NAME: 'Hebrew',
  ADVANCED_FILTER: 'פילטרים מתקדמים',
  RELOAD: 'טען מחדש',
  COLUMNS: 'עמודות',
  PDF: 'Pdf',
  XSL: 'Xsl',
  NEW: 'חדש',
  FILTERS_TITLE: 'פילטרים:',
  FILTERS_SETTINGS_TITLE: 'הגדרות פילטר:',
  ERROR_MESSAGE: 'אופס, משהו מוזר קרה',
  RETRY_BUTTON_TEXT_ON_ERROR: 'נסה שנית',
  NOTIFICATION: {
    UPDATE_SUCCESSFULLY: 'עודכן בהצלחה',
    UPDATE_FAILED: 'עדכון נכשל',
    CREATE_SUCCESSFULLY: 'נוצר בהצלחה',
    CREATE_FAILED: 'יצירה נכשלה',
    DELETE_SUCCESSFULLY: 'נמחק בהצלחה',
    DELETE_FAILED: 'מחיקה נכשלה'
  },
  BREADCRUMB: {
    HOME: 'בית',
    NEW: 'חדש'
  },
  DOC: {
    RENDER_BACK_TO_BTN_TEXT: (target) => `חזרה ל ${target}`,
    LOADING_TEXT: 'טוען...',
    NEW_DOC_TITLE: 'חדש',
    CREATE_BUTTON_TEXT: 'צור',
    UPDATE_BUTTON_TEXT: 'עדכון',
    RENDER_DELETE_MODAL_TITLE: data => 'אנא אשר בקשתך',
    RENDER_DELETE_MODAL_CONTENT: (data, docTitle) => `אתה בטוח שברצוך למחוק את  ${docTitle} ?`,
    DELETE_MODAL_OK_BUTTON: 'מחק',
    DELETE_MODAL_CANCEL_BUTTON: 'בטל'
  },
  TABLE_TOTAL_DISPLAY: (total, [from, to]) => {
    if (total > 0)`${total} רשומות`;
    return ''
  },
  BUTTONS: {
    RENDER_ADD_BUTTON_TEXT: name => `הוסף ${name}`
  },
  TABLE_DATE_FIELD_FORMAT: 'MM/DD/YY HH:mm:ss',
  SEARCH_PLACE_HOLDER: "הכנס ערך לחיפוש",
  MOMENT_FORMAT_DATE: 'MMMM Do YYYY, h:mm:ss a',
  FILTERS: {
    DATE_INPUT_PLACE_HOLDER: 'בחר תאריך',
    TYPE_INPUT_PLACE_HOLDER: 'הכנס...',
    SELECT_PLACE_HOLDER: 'סנן לפי',
    SELECT_OPERATOR_PLACE_HOLDER: 'בחר תנאי',
    ADD_FILTER_BUTTON_TEXT: 'הוסף פילטר',
    CANCEL_BUTTON_TEXT: 'בטל',
    FIELD_NAME_LABEL: 'שם השדה',
    APPLY_BUTTON_TEXT: 'החל',
    SELECT_ALL_BUTTON_TEXT: 'בחר הכל',
    OK_BUTTON_TEXT: 'אישור',
    COLUMNS_TO_DISPLAY_MODAL_TITLE: 'שדות להצגה',
    RESET_BUTTON_TEXT: 'איפוס',
    MOMENT_FORMAT_DATE: 'MMMM Do YYYY, h:mm:ss a',
    VALUE: 'ערך',
    MODAL_CANCEL_CONFIRM: 'האם אתה בטוח שברצונך לבטל את הבחירות שלך?',
    LOGICAL: {
      OR: {
        LABEL: 'או',
        INFO: 'שלב מספר תנאים אפשריים'
      },
      NOR: {
        LABEL: 'לא תואם',
        INFO: 'מצא רשומות שלא תואמות אף אחת מהאפשרויות'
      },
      NOT: {
        LABEL: 'לא',
        INFO: 'מצא רשומות שלא תואמות את ערך החיפוש'
      },
      AND: {
        LABEL: 'גם',
        INFO: 'מצא רשומות שעונות על מספר תנאים במקביל'
      }
    },
    EQUAL: {
      LABEL: 'שווה ל',
      INFO: 'מצה על פי שדה השווה לערך'
    },
    STRING_EQUAL: {
      LABEL: 'שווה ל',
      INFO: 'מצא על פי שדה השווה לערך'
    },
    NOT_EQUAL: {
      LABEL: 'לא שווה ל',
      INFO: 'מצא על פי שדה שאינו שווה לערך'
    },
    STRING_NOT_EQUAL: {
      LABEL: 'לא שווה ל',
      INFO: 'מצא על פי שדה שאינו שווה לערך'
    },
    GREATER_THAN: {
      LABEL: 'גדול מ',
      INFO: 'מצא על פי שדה שגדול מהערך'
    },
    GREATER_THAN_OR_EQUAL: {
      LABEL: 'גדול מ או שווה ל',
      INFO: 'מצא על פי שדה שגדול או שווה לערך'
    },
    LESS_THAN: {
      LABEL: 'קטן מ',
      INFO: 'מצא על פי שדה שקטן מהערך'
    },
    LESS_THAN_OR_EQUAL: {
      LABEL: 'קטן מ או שווה ל',
      INFO: 'מצא על פי שדה שקטן או שווה לערך'
    },
    ALL_IN_ARRAY: {
      LABEL: 'כל הערכים ברשימה',
      INFO: 'מצא על פי שדה רשימה שכל ערכיו שווים לערך'
    },
    MATCH_IN_ARRAY: {
      LABEL: 'ערך זהה ברשימה',
      INFO: 'מצא על פי שדה רשימה שאחד מערכיו זהה לערך'
    },
    NONE_IN_ARRAY: {
      LABEL: 'ערך לא זהה ברשימה',
      INFO: 'מצא על פי שדה רשימה שאף אחד מערכיו אינו זהה לערך'
    },
    DATE_EQUAL: {
      LABEL: 'תאריך זהה',
      INFO: 'מצא על פי שדה תאריך שזהה לרשימה'
    },
    AFTER: {
      LABEL: 'אחרי תאריך',
      INFO: 'מצא על פי שדה תאריך אחרי תאריך מסוים'
    },
    BEFORE: {
      LABEL: 'לפני תאריך',
      INFO: 'מצא על פי שדה תאריך הקודם לתאריך מסוים'
    }
  }
}
export default local;