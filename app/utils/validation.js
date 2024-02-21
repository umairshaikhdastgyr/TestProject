export const checkEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

export const checkPass = (phrase) => {
  const passRe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{7,}$/;
  return passRe.test(phrase);
};


export const validateFileTypeAndSize = ({ fileName, fileSize }) => {
  // const filetypes = ['jpeg', 'jpg', 'png', 'docx', 'doc', 'xls', 'xlsx', 'pdf'];
  const filetypes = ['jpeg', 'jpg', 'png', 'gif', 'docx', 'doc', 'pdf'];
  const ext = fileName.split('.').pop();
  const validateType = filetypes.includes(ext);
  const validateSize = fileSize <= 10000000;

  const result = {
    validateType,
    validateSize,
  };
  return result;
};
