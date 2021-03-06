const initialState = {
  isSubmitInProgress: false,
  isSubmitSuccessful: false,
  isSubmitErroneous: false,
  isFileUploading: false,
  isFilePaused: false,
  isFileUploaded: false,
  isFileUploadError: false,
  isScheduling: false,
  isScheduled: false,
  isScheduleError: false,
  isParsing: null,
  parseAttempted: false,
  parseError: null,
  loaded: false,
  destination: {},
  destinationArr: [],
  source: {},
  sourceArr: [],
  availableSources: [],
  isIngesting: false,
  isIngestError: false,
  status: null,
  ingestId: null,
  form: {
    file: {
      requiredType: 'hard',
      value: null
    },
    mappings: {},
    errors: {
      file: null
    }
  }
};
export function csvReducer(state = initialState, action = {}) {
  switch(action.type) {
    case 'INGEST_REQUESTED': {
      return {
        ...state,
        isIngesting: true,
        isIngestError: false
      }
    }
    case 'INGEST_REJECTED': {
      return {
        ...state,
        isIngesting: false,
        isIngestError: true,
        status: action.result.message
      }
    }
    case 'INGEST_FULFILLED': {
      return {
        ...state,
        isIngesting: false,
        isIngestError: false,
        isIngestSuccess: true
      }
    }
    case 'GET_INITIAL':
      return {
        ...state,
        isLoading: true
      }
    case 'GET_INITIAL_FAILURE':
      return {
        ...state,
        isLoading: false,
        loaded: false,
        loadError: action.error
      }
    case 'GET_INITIAL_SUCCESS':
      const formErrorsMappings = Object.keys(action.payload.data).reduce((obj, field) => {
        obj[field] = null;
        return obj;
      }, {});
      return {
        ...state,
        isLoading: false,
        loaded: true,
        destination: action.payload.data,
        destinationArr: Object.keys(action.payload.data).map((key, index) => {
          return {
            ...action.payload.data[key],
            key: key
          }
        }),
        form: {
          ...state.form,
          mappings: action.payload.data,
          errors: {
            ...state.form.errors,
            ...formErrorsMappings
          }
        }
      }
    case 'PARSE_HEADER_REQUESTED':
     return {
       ...state,
       isParsing: true,
       parseAttempted: false
     }
    case 'PARSE_HEADER_REJECTED':
      return {
        ...state,
        isParsing: false,
        parseError: true,
        parseAttempted: true
      }
    case 'PARSE_HEADER_FULFILLED':
      const sourceArr = action.result.data[0].map( source => {
          return {
            destinationField: null,
            name: source,
            key: source
          }
        });

      return {
        ...state,
        sourceArr: sourceArr,
        source: sourceArr.reduce((obj, source) => {
          obj[source.key] = source
          return obj
        }, {}),
        form: {
          ...state.form,
          file: {
            ...state.form.file,
            value: action.result.file
          },
          errors: {
            ...state.form.errors,
            ...action.errors
          }
        },
        isParsing: false,
        parseError: false,
        parseAttempted: true
      }
    case 'TOGGLE_INPUT': {
      const destinationArr = state.destinationArr.map(dest => {
        if (dest.key === action.result.destKey) {
          return {
            ...dest,
            sourceField: null,
            type: !action.result.value ? 'text' : 'select',
            value: null
          }
        }
        return dest;
      });
      return {
        ...state,
        destinationArr: destinationArr,
        destination: {
          ...state.destination,
          [action.result.destKey]: {
            ...state.destination[action.result.destKey],
            sourceField: null,
            type: !action.result.value ? 'text' : 'select',
            value: null
          }
        },
        form: {
          ...state.form,
          mappings: {
            ...state.form.mappings,
            [action.result.destKey]: {
              ...state.form.mappings[action.result.destKey],
              sourceField: null,
              type: !action.result.value ? 'text' : 'select',
              value: null
            }
          }
        }
      }
    }
    case 'PAIR': {
     const sourceArr = state.sourceArr.map(source => {
       if (source.key === action.result.sourceKey) {
         return {
           ...source,
           destinationField: action.result.destKey
         }
       }
       return source;
     });

     const destinationArr = state.destinationArr.map(dest => {
       if (dest.key === action.result.destKey) {
         return {
           ...dest,
           sourceField: action.result.sourceKey
         }
       }
       return dest;
     });

     return {
       ...state,
       source: {
         ...state.source,
         [action.result.sourceKey]: {
           ...state.source[action.result.sourceKey],
           destinationField: action.result.destKey
         }
       },
       sourceArr: sourceArr,
       destination: {
         ...state.destination,
         [action.result.destKey]: {
           ...state.destination[action.result.destKey],
           sourceField: action.result.sourceKey
         }
       },
       destinationArr: destinationArr,
       form: {
         ...state.form,
         mappings: {
           ...state.form.mappings,
           [action.result.destKey]: {
             ...state.form.mappings[action.result.destKey],
             sourceField: action.result.sourceKey
           }
         },
         errors: {
           ...state.form.errors,
           ...action.errors
         }
       }
     }
    }
    case 'ADD_TEXT': {
      const destinationArr = state.destinationArr.map(dest => {
        if (dest.key === action.result.destKey) {
          return {
            ...dest,
            value: action.result.value
          }
        }
        return dest;
      });

      return {
        ...state,
        destination: {
          ...state.destination,
          [action.result.destKey]: {
            ...state.destination[action.result.destKey],
            value: action.result.value
          }
        },
        destinationArr: destinationArr,
        form: {
          ...state.form,
          mappings: {
            ...state.form.mappings,
            [action.result.destKey]: {
              ...state.form.mappings[action.result.destKey],
              value: action.result.value
            }
          },
          errors: {
            ...state.form.errors,
            ...action.errors
          }
        }
      }
    }
    case 'RECEIVE_CSV_INGEST_UPDATE': {
      return {
        ...state,
        status: action.result.status
      }
    }
    case 'CSV_VALIDATION_ERROR': {
      return {
        ...state,
        form: {
          ...state.form,
          errors: action.errors
        },
        status: null
      }
    }
    case 'CREATE_INGEST_RECORD': {
      return {
        ...state,
        isIngesting: true,
        status: 'Creating ingest record.'
      }
    }
    case 'CREATE_INGEST_RECORD_FAILURE': {
      return {
        ...state,
        isIngesting: false,
        status: 'Problem creating ingest record.'
      }
    }
    case 'CREATE_INGEST_RECORD_SUCCESS': {
      return {
        ...state,
        ingestId: action.payload.data.id,
        isIngesting: true, //carry over for file upload which starts next
        status: 'Created ingest record.'
      }
    }
    case 'SCHEDULE_INGEST': {
      return {
        ...state,
        isSubmitInProgress: true,
        isSubmitErroneous: false,
        isSubmitSuccessful: false,
        isScheduling: true,
        isScheduled: false,
        isScheduleError: false,
        status: 'Scheduling ingest job.'
      }
    }
    case 'SCHEDULE_INGEST_FAILURE': {
      return {
        ...state,
        isSubmitInProgress: false,
        isSubmitErroneous: true,
        isSubmitSuccessful: false,
        isScheduling: false,
        isScheduled: false,
        isScheduleError: true,
        status: 'Problem scheduling ingest job.'
      }
    }
    case 'SCHEDULE_INGEST_SUCCESS': {
      return {
        ...state,
        ingestId: action.payload.data.id,
        isSubmitInProgress: false,
        isSubmitErroneous: false,
        isSubmitSuccessful: true,
        isScheduling: false,
        isScheduled: true,
        isScheduleError: false,
        status: 'Successfully uploaded csv file and scheduled ingest job. Look at left sidebar for status updates regarding the ingest job.'
      }
    }
    case 'FILE_UPLOAD_STARTED': {
      return {
        ...state,
        isSubmitInProgress: true,
        isSubmitErroneous: false,
        isSubmitSuccessful: false,
        isFileUploading: true,
        isFilePaused: false,
        isFileUploaded: false,
        isFileUploadError: false,
        status: 'File uploading.'
      }
    }
    case 'FILE_UPLOAD_SUCCESS': {
      return {
        ...state,
        isSubmitInProgress: true,
        isSubmitErroneous: false,
        isSubmitSuccessful: false,
        isFileUploading: false,
        isFilePaused: false,
        isFileUploaded: true,
        isFileUploadError: false,
        status: 'File uploaded.'
      }
    }
    case 'FILE_UPLOAD_PAUSED': {
      return {
        ...state,
        isSubmitInProgress: true,
        isSubmitErroneous: false,
        isSubmitSuccessful: false,
        isFileUploading: false,
        isFilePaused: true,
        isFileUploaded: false,
        isFileUploadError: false,
        status: 'File upload paused.'
      }
    }
    case 'FILE_UPLOAD_RESUMED': {
      return {
        ...state,
        isSubmitInProgress: true,
        isSubmitErroneous: false,
        isSubmitSuccessful: false,
        isFileUploading: true,
        isFilePaused: false,
        isFileUploaded: false,
        isFileUploadError: false,
        status: 'File uploading.'
      }
    }
    case 'FILE_UPLOAD_CANCELLED': {
      const destination = Object.keys(state.destination).reduce((obj, dest) => {
        obj[dest] = {
          ...state.destination[dest],
          sourceField: null,
          value: null
        };
        return obj;
      }, {});

      const destinationArr = state.destinationArr.map(dest => {
        return {
          ...dest,
          sourceField: null,
          value: null
        }
      });
      return {
        ...state,
        isSubmitInProgress: false,
        isSubmitErroneous: false,
        isSubmitSuccessful: false,
        isFileUploading: false,
        isFilePaused: false,
        isFileUploaded: false,
        isFileUploadError: false,
        status: 'File upload cancelled. Form has been reset.',
        destination: destination,
        destinationArr: destinationArr,
        source: {},
        sourceArr: [],
        ingestId: null,
        isParsing: false,
        parseError: false,
        parseAttempted: false,
        form: {
          file: {
            requiredType: 'hard',
            value: null
          },
          mappings: {},
          errors: {
            file: null
          }
        }
      }
    }
    case 'FILE_UPLOAD_FAILURE': {
      return {
        ...state,
        isSubmitInProgress: false,
        isSubmitErroneous: true, //TODO: could potentially be overwritten if *SCHEDULE_INGEST* is allowed to dispatch, need to stop subsequent dispatch
        isSubmitSuccessful: false,
        isFileUploading: false,
        isFilePaused: false,
        isFileUploaded: false,
        isFileUploadError: true,
        status: 'Problem uploading file.'
      }
    }
    case 'TOGGLE_ADD_CUSTOM_FIELD_MODAL': {
      return {
        ...state,
        addCustomFieldModalActive: action.result.action == 'open' ? true : false
      }
    }
    case 'CREATE_CUSTOM_FIELD': {
      return {
        ...state
      }
    }
    case 'CREATE_CUSTOM_FIELD_SUCCESS': {
      const createdField = action.payload.data;
      const formErrorsMappings = Object.keys(createdField).reduce((obj, field) => {
        obj[field] = null;
        return obj;
      }, {});
      return {
        ...state,
        destination: {
          ...state.destination,
          ...createdField
        },
        destinationArr: [ //immutablely adding item to array
          //ref: https://redux.js.org/recipes/structuringreducers/immutableupdatepatterns
          ...state.destinationArr.slice(0, state.destinationArr.length),
          Object.keys(createdField).reduce((obj, field) => {
            return {
              ...createdField[field],
              key: field
            }
            return obj;
          }, {}),
          ...state.destinationArr.slice(state.destinationArr.length)
        ],
        form: {
          ...state.form,
          mappings: {
            ...state.form.mappings,
            ...createdField
          },
          errors: {
            ...state.form.errors,
            ...formErrorsMappings
          }
        }
      }
    }
    case 'CREATE_CUSTOM_FIELD_FAILURE': {
      return {
        ...state
      }
    }
    case 'DELETE_CUSTOM_FIELD': {
      return {
        ...state
      }
    }
    case 'DELETE_CUSTOM_FIELD_SUCCESS': {
      const { field : deletedField } = action.payload.data;
      const formErrorsMappings = Object.keys(state.form.errors).reduce((obj, field) => {
        if (field === deletedField ) {
          return obj;
        }
        obj[field] = state.form.errors[field];
        return obj;
      }, {});
      const destination = Object.keys(state.destination).reduce((obj, field) => {
        if (field === deletedField) {
          return obj;
        }
        obj[field] = state.destination[field];
        return obj;
      }, {});

      let destArrIndex;
      state.destinationArr.forEach((item, index) => {
        if (item.key === deletedField) {
          return destArrIndex = index;
        }
      });
      return {
        ...state,
        destination: {
          ...destination
        },
        destinationArr: [
          ...state.destinationArr.slice(0, destArrIndex),
          ...state.destinationArr.slice(destArrIndex + 1)
        ],
        form: {
          ...state.form,
          mappings: {
            ...destination
          },
          errors: {
            ...formErrorsMappings
          }
        }
      }
    }
    case 'DELETE_CUSTOM_FIELD_FAILURE': {
      return {
        ...state
      }
    }
    case 'RESET': {
      return {
        ...state,
        isSubmitInProgress: false,
        isSubmitSuccessful: false,
        isSubmitErroneous: false,
        isFileUploading: false,
        isFilePaused: false,
        isFileUploaded: false,
        isFileUploadError: false,
        isScheduling: false,
        isScheduled: false,
        isScheduleError: false,
        isParsing: null,
        parseAttempted: false,
        parseError: null,
        loaded: true,
        source: {},
        sourceArr: [],
        availableSources: [],
        isIngesting: false,
        isIngestError: false,
        // status: null,
        ingestId: null,
        destination: Object.keys(state.destination).reduce((dest, key) => {
          dest[key] = {
            ...state.destination[key],
            value: null,
            sourceField: null
          }
          return dest;
        }, {}),
        destinationArr: state.destinationArr.map((dest) => {
          return {
            ...dest,
            value: null,
            sourceField: null
          }
        }),
        form: {
          ...state.form,
          file: {
            ...state.form.file,
            value: null
          },
          mappings: Object.keys(state.destination).reduce((dest, key) => {
            dest[key] = {
              ...state.destination[key],
              value: null,
              sourceField: null
            }
            return dest;
          }, {})
        }
      }
    }
    default:
      return state;
  }
}
