const sendEmailFun = async (to, subject, text, html) => {
  const result = await sendEmail(to, subject, text, html); // Inner sendEmail function is assumed to be imported/available
  
  if (result.success) {
    return true;
    // Removed commented-out res.status(200).json(...) as it makes no sense in a utility function
  } else {
    return false;
    // Removed commented-out res.status(500).json(...)
  }
}

export default sendEmailFun;