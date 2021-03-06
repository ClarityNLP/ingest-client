const initialState = {
  coreName: null,
  numDocs: null,
  isNumDocsLoading: true
};
export function solrReducer(state = initialState, action = {}) {
  switch(action.type) {
    case 'GET_CORE_NAME': {
      return {
        ...state,
        isCoreNameLoading: true
      }
    }
    case 'GET_CORE_NAME_FAILURE': {
      return {
        ...state,
        isCoreNameLoading: false,
        isCoreNameError: true
      }
    }
    case 'GET_CORE_NAME_SUCCESS': {
      const { coreName } = action.payload.data;

      return {
        ...state,
        coreName: coreName,
        isCoreNameLoading: false,
        isCoreNameError: false
      }
    }
    case 'GET_NUM_DOCS': {
      return {
        ...state,
        isNumDocsLoading: true
      }
    }
    case 'GET_NUM_DOCS_FAILURE': {
      return {
        ...state,
        isNumDocsLoading: false,
        isNumDocsError: true
      }
    }
    case 'GET_NUM_DOCS_SUCCESS': {
      const { numDocs } = action.payload.data;

      return {
        ...state,
        numDocs: numDocs,
        isNumDocsLoading: false,
        isNumDocsError: false
      }
    }
    case 'RECEIVE_NUM_DOCS': {
      return {
        ...state,
        numDocs: action.result.numDocs
      }
    }
    default:
      return state;
  }
}
