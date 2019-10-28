const local = {
  LANG_DIR: 'ltr',
  LANG_NAME: 'English',
  ADVANCED_FILTER: 'Advanced Filter',
  RELOAD: 'Reload',
  COLUMNS: 'Columns',
  PDF: 'Pdf',
  XSL: 'Xsl',
  NEW: 'NEW',
  FILTERS_TITLE: 'Filters:',
  FILTERS_SETTINGS_TITLE: 'Filters settings:',
  ERROR_MESSAGE: 'Oops! something went wrong',
  RETRY_BUTTON_TEXT_ON_ERROR: 'Retry',
  NOTIFICATION: {
    UPDATE_SUCCESSFULLY: 'Update successfully',
    UPDATE_FAILED: 'Update failed',
    CREATE_SUCCESSFULLY: 'Create successfully',
    CREATE_FAILED: 'Create failed',
    DELETE_SUCCESSFULLY: 'Delete successfully',
    DELETE_FAILED: 'Delete failed'
  },
  BREADCRUMB: {
    HOME: 'Home',
    NEW: 'New'
  },
  DOC: {
    LOADING_TEXT: 'Loading...',
    NEW_DOC_TITLE: 'New',
    CREATE_BUTTON_TEXT: 'Create',
    UPDATE_BUTTON_TEXT: 'Update',
    RENDER_DELETE_MODAL_TITLE: data => 'Please Confirm Your Request',
    RENDER_DELETE_MODAL_CONTENT: (data, docTitle) => `Are you sure delete ${docTitle}?`,
    DELETE_MODAL_OK_BUTTON: 'Delete',
    DELETE_MODAL_CANCEL_BUTTON: 'Cancel'
  },
  TABLE_TOTAL_DISPLAY: (total, [from, to]) => {
    if (total > 0)`Showing ${from} to ${to} of ${total} entries`;
    return ''
  },
  BUTTONS: {
    RENDER_ADD_BUTTON_TEXT: name => `Add ${name}`
  },
  TABLE_DATE_FIELD_FORMAT: 'MM/DD/YY HH:mm:ss',
  SEARCH_PLACE_HOLDER: "input search text",
  MOMENT_FORMAT_DATE: 'MMMM Do YYYY, h:mm:ss a',
  FILTERS: {
    DATE_INPUT_PLACE_HOLDER: 'Select',
    TYPE_INPUT_PLACE_HOLDER: 'Type...',
    SELECT_PLACE_HOLDER: 'Filter by',
    SELECT_OPERATOR_PLACE_HOLDER: 'Select operator',
    ADD_FILTER_BUTTON_TEXT: 'Add Filter',
    CANCEL_BUTTON_TEXT: 'Cancel',
    FIELD_NAME_LABEL: 'Field Name',
    APPLY_BUTTON_TEXT: 'Apply',
    SELECT_ALL_BUTTON_TEXT: 'Select All',
    OK_BUTTON_TEXT: 'Ok',
    COLUMNS_TO_DISPLAY_MODAL_TITLE: 'Columns to display',
    RESET_BUTTON_TEXT: 'Reset',
    MOMENT_FORMAT_DATE: 'MMMM Do YYYY, h:mm:ss a',
    VALUE: 'Value',
    MODAL_CANCEL_CONFIRM: 'Are you sure you want to cancel your choices?',
    LOGICAL: {
      OR: {
        LABEL: 'Or',
        INFO: 'Joins query clauses with a logical OR returns all documents that match the conditions of either clause.'
      },
      NOR: {
        LABEL: 'Not match',
        INFO: 'Joins query clauses with a logical NOR returns all documents that fail to match both clauses.'
      },
      NOT: {
        LABEL: 'Not',
        INFO: 'Inverts the effect of a query expression and returns documents that do not match the query expression.'
      },
      AND: {
        LABEL: 'And',
        INFO: 'Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.'
      }
    },
    EQUAL: {
      LABEL: 'Equal to',
      INFO: 'Matches values that are equal to a specified value.'
    },
    STRING_EQUAL: {
      LABEL: 'Equal to',
      INFO: 'Matches values that are equal to a specified value.'
    },
    NOT_EQUAL: {
      LABEL: 'Not equal to',
      INFO: 'Matches all values that are not equal to a specified value.'
    },
    STRING_NOT_EQUAL: {
      LABEL: 'Not equal to',
      INFO: 'Matches all values that are not equal to a specified value.'
    },
    GREATER_THAN: {
      LABEL: 'Greater Than',
      INFO: 'Matches values that are greater than a specified value.'
    },
    GREATER_THAN_OR_EQUAL: {
      LABEL: 'Greater Than or Equal To',
      INFO: 'Matches values that are greater than or equal to a specified value.'
    },
    LESS_THAN: {
      LABEL: 'Less Than',
      INFO: 'Matches values that are less than a specified value.'
    },
    LESS_THAN_OR_EQUAL: {
      LABEL: 'Less Than or Equal To',
      INFO: 'Matches values that are less than or equal to a specified value.'
    },
    ALL_IN_ARRAY: {
      LABEL: 'Matches all in an array.',
      INFO: 'Matches all values that are not equal to a specified value.'
    },
    MATCH_IN_ARRAY: {
      LABEL: 'Matches any in an array.',
      INFO: 'Matches any of the values specified in an array.'
    },
    NONE_IN_ARRAY: {
      LABEL: 'Matches any in an array.',
      INFO: 'Matches none of the values specified in an array.'
    },
    DATE_EQUAL: {
      LABEL: 'Equal to specific date.',
      INFO: 'Find by date field after specific date.'
    },
    AFTER: {
      LABEL: 'After specific date.',
      INFO: 'Find by date field after specific date.'
    },
    BEFORE: {
      LABEL: 'Before specific date.',
      INFO: 'Find by date field before specific date.'
    }
  }
}
export default local;