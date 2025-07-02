import axios from "axios";

const isRealEmail = async (email) => {
  try {
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.EMAIL_VALIDATION_API_KEY}&email=${email}`;

    const { data } = await axios.get(url);
    const { is_valid_format, is_smtp_valid, is_disposable_email } = data;

    return (
      is_valid_format.value &&
      is_smtp_valid.value &&
      !is_disposable_email.value
    );
  } catch (error) {
    console.error("Email validation error:", error.message);
    return false;
  }
};

export default isRealEmail;
