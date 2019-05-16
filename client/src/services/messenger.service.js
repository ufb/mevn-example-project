import Bus from './event.service';

export default function(err, type = 'error') {

  let message;

  if (typeof err === 'string') message = err;

  else if (err.response && err.response.data && err.response.data.message) {
    message = err.response.data.message;
  }
  // else if (err.request && err.request.responseText) {
  //   message = err.request.responseText;
  // }
  else if (err.message) {
    message = err.message;
  }
  else if (err.constructor && err.constructor.name && err.constructor.name.search('Error') !== -1) {
    message = err.toString();
  }
  else {
    try {
      message = err.toString();
    } catch(e) {
      message = 'An error occured.';
    }
  }

  Bus.$emit('message', { type, message });
  return { message };
}
