import emailjs from '@emailjs/browser';

export interface SignalTransmissionPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: string;
}

export interface TransmissionResult {
  success: boolean;
  message: string;
  error?: string;
}

export const RECIPIENT_EMAIL = 'aarushrahulpatel07@gmail.com';

/**
 * Sends a celestial contact signal via EmailJS using environment variables.
 */
export async function transmitSignal(
  payload: SignalTransmissionPayload
): Promise<TransmissionResult> {
  const serviceId =
    import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_xocfgre';
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId) {
    return {
      success: false,
      message: 'Transmission aborted: EmailJS Service ID is missing.',
      error: 'MISSING_SERVICE_ID',
    };
  }

  if (!templateId || !publicKey) {
    return {
      success: false,
      message:
        'Transmission failed: EmailJS Template ID or Public Key is not configured in environment variables.',
      error: 'MISSING_CREDENTIALS',
    };
  }

  try {
    const templateParams = {
      name: payload.name,
      from_name: payload.name,
      sender_name: payload.name,
      email: payload.email,
      from_email: payload.email,
      sender_email: payload.email,
      reply_to: payload.email,
      subject: payload.subject,
      message: payload.message,
      to_email: RECIPIENT_EMAIL,
      recipient: RECIPIENT_EMAIL,
      timestamp: payload.timestamp || new Date().toLocaleString(),
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      {
        publicKey: publicKey,
      }
    );

    if (response.status === 200 || response.text === 'OK') {
      return {
        success: true,
        message: 'Signal received. Your message is on its way.',
      };
    } else {
      return {
        success: false,
        message: 'Celestial relay rejected transmission. Please try again or open your mail client.',
        error: `STATUS_${response.status}`,
      };
    }
  } catch (err: unknown) {
    const errorText =
      err instanceof Error ? err.message : 'Unknown communication error';
    return {
      success: false,
      message:
        'Failed to establish link with transmission relay. Please retry or use direct email.',
      error: errorText,
    };
  }
}

