// useEmail.js
import { ref } from 'vue';
import emailjs from 'emailjs-com';

export function useEmailService() {
  const sendInvoiceEmail = async (recipient,sender, subject,message, discountedTotal, pdfData) => {
    const templateParams = {
      to_email: recipient,
      subject: subject,
      message: message,
      from_email:sender,
      discountedTotal:discountedTotal
    };

    const attachment = {
      name: 'invoice.pdf',
      data: pdfData,
    };

    try {
      const response = await emailjs.send(
        'service_virjw37',
        'template_dei0gtp',
        templateParams,
        'vQ5bP7R48Ex2uK_F5',    
        attachment
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    sendInvoiceEmail,
  };
}
