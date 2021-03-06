import { csvValidationError } from '../actions/csv';
import csvValidationErrors    from '../utils/csvValidationErrors';
import csvIsValid             from '../utils/csvIsValid';

const formValidationMiddleware = ({ dispatch, getState}) => next => action => {
  if (action.validate !== "csv") {
    return next(action)
  }
  const { data: csv } = action;

  let errors = csvValidationErrors(csv)

  const inputs = {
    file: {
      ...csv.file
    },
    ...csv.mappings
  };

  const counts = Object.keys(inputs).reduce((counts, key) => {
    // const errors = this.props.csv.form.errors;
    const requiredType = inputs[key].requiredType;
    counts[requiredType] = errors[key] ? counts[requiredType] + 1 : counts[requiredType];
    return counts;
  }, { hard: 0, soft: 0, none: 0});

  // if (!csvIsValid(errors)) {
  if (counts.hard > 0) {
    dispatch(csvValidationError(errors))
    //return promise to chain in calling func.
    return new Promise(function(resolve, reject) {
      reject();
    });
  } else {
    return next(action)
  }
};

export default formValidationMiddleware;
