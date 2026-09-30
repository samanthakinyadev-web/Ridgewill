import { useState, type ChangeEvent, type MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { company } from '../content/company';
import { services } from '../content/services';

type InquiryType = 'quotation' | 'inquiry';

const CARGO_TYPES = [
  { value: 'general', label: 'General cargo' },
  { value: 'perishables', label: 'Fresh produce / perishables' },
  { value: 'dangerous-goods', label: 'Dangerous goods' },
  { value: 'time-sensitive', label: 'Time-sensitive' },
  { value: 'other', label: 'Other' },
] as const;

interface FormErrors {
  [key: string]: string;
}

interface ContactFormProps {
  preselectedService?: string;
}

export function ContactForm({ preselectedService }: ContactFormProps) {
  const [searchParams] = useSearchParams();

  const initialService = preselectedService || searchParams.get('s') || '';

  const [inquiryType, setInquiryType] = useState<InquiryType>('quotation');
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    service: initialService,
    cargoType: '',
    origin: '',
    destination: '',
    weightVolume: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleInquiryTypeChange = (type: InquiryType) => {
    setInquiryType(type);
    if (type === 'inquiry') {
      setFormData((prev) => ({ ...prev, service: '', cargoType: '', origin: '', destination: '', weightVolume: '' }));
    } else {
      setFormData((prev) => ({ ...prev, service: initialService || prev.service, message: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (inquiryType === 'quotation') {
      if (!formData.service) {
        newErrors.service = 'Please select a service';
      }
      if (!formData.cargoType) {
        newErrors.cargoType = 'Please select a cargo type';
      }
      if (!formData.origin.trim()) {
        newErrors.origin = 'Origin is required';
      }
      if (!formData.destination.trim()) {
        newErrors.destination = 'Destination is required';
      }
    }
    if (inquiryType === 'inquiry' && !formData.message.trim()) {
      newErrors.message = 'Message is required for inquiry';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildMessage = (): string => {
    const prefix = inquiryType === 'quotation' ? 'Quotation request' : 'Inquiry';
    const lines: string[] = [
      `${prefix} - ${company.name}`,
      '',
      `Name: ${formData.fullName}`,
      `Company: ${formData.company || 'N/A'}`,
      `Email: ${formData.email}`,
      `Phone/WhatsApp: ${formData.phone || 'N/A'}`,
    ];

    if (inquiryType === 'quotation') {
      const selectedService =
        formData.service && formData.service !== 'Other'
          ? services.find((s) => s.title === formData.service)?.title || formData.service
          : formData.service;
      lines.push(`Service: ${selectedService || 'N/A'}`);
      lines.push(`Cargo type: ${CARGO_TYPES.find((c) => c.value === formData.cargoType)?.label || formData.cargoType || 'N/A'}`);
      lines.push(`Origin: ${formData.origin}`);
      lines.push(`Destination: ${formData.destination}`);
      lines.push(`Approx. weight/volume: ${formData.weightVolume || 'N/A'}`);
    }

    lines.push('');
    lines.push(`Message: ${formData.message || 'N/A'}`);

    return lines.join('\n');
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>, method: 'whatsapp' | 'email') => {
    e.preventDefault();
    if (!validate()) return;

    const message = encodeURIComponent(buildMessage());

    if (method === 'whatsapp') {
      const url = `${company.whatsappLink}?text=${message}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const subject = encodeURIComponent(
        `${inquiryType === 'quotation' ? 'Quotation Request' : 'Inquiry'} - ${company.name}`
      );
      const body = message;
      const url = `mailto:${company.email}?subject=${subject}&body=${body}`;
      window.open(url, '_blank');
    }
  };

  return (
    <form className="contact-form" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className="contact-form__title">
        Send us a message
      </h2>

      <div className="contact-form__toggle">
        <label className="toggle-label">
          <input
            type="radio"
            name="inquiryType"
            value="quotation"
            checked={inquiryType === 'quotation'}
            onChange={() => handleInquiryTypeChange('quotation')}
          />
          <span className="toggle-label__text">Quotation</span>
        </label>
        <label className="toggle-label">
          <input
            type="radio"
            name="inquiryType"
            value="inquiry"
            checked={inquiryType === 'inquiry'}
            onChange={() => handleInquiryTypeChange('inquiry')}
          />
          <span className="toggle-label__text">General inquiry</span>
        </label>
      </div>

      <div className="contact-form__grid">
        <div className="contact-form__field-group">
          <label htmlFor="fullName" className="contact-form__label">
            Full name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className={`contact-form__input ${errors.fullName ? 'error' : ''}`}
            value={formData.fullName}
            onChange={handleInputChange}
            required
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errors.fullName && (
            <span id="fullName-error" className="contact-form__error" role="alert">
              {errors.fullName}
            </span>
          )}
        </div>

        <div className="contact-form__field-group">
          <label htmlFor="company" className="contact-form__label">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="contact-form__input"
            value={formData.company}
            onChange={handleInputChange}
          />
        </div>

        <div className="contact-form__field-group">
          <label htmlFor="email" className="contact-form__label">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`contact-form__input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleInputChange}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="contact-form__error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="contact-form__field-group">
          <label htmlFor="phone" className="contact-form__label">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="contact-form__input"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="e.g. +254 7XX XXX XXX"
          />
        </div>

        {inquiryType === 'quotation' && (
          <>
            <div className="contact-form__field-group">
              <label htmlFor="service" className="contact-form__label">
                Service <span className="required">*</span>
              </label>
              <select
                id="service"
                name="service"
                className={`contact-form__select ${errors.service ? 'error' : ''}`}
                value={formData.service}
                onChange={handleInputChange}
                aria-invalid={!!errors.service}
                aria-describedby={errors.service ? 'service-error' : undefined}
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              {errors.service && (
                <span id="service-error" className="contact-form__error" role="alert">
                  {errors.service}
                </span>
              )}
            </div>

            <div className="contact-form__field-group">
              <label htmlFor="cargoType" className="contact-form__label">
                Cargo type <span className="required">*</span>
              </label>
              <select
                id="cargoType"
                name="cargoType"
                className={`contact-form__select ${errors.cargoType ? 'error' : ''}`}
                value={formData.cargoType}
                onChange={handleInputChange}
                aria-invalid={!!errors.cargoType}
                aria-describedby={errors.cargoType ? 'cargoType-error' : undefined}
              >
                <option value="">Select cargo type</option>
                {CARGO_TYPES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.cargoType && (
                <span id="cargoType-error" className="contact-form__error" role="alert">
                  {errors.cargoType}
                </span>
              )}
            </div>
          </>
        )}

        {inquiryType === 'quotation' && (
          <>
            <div className="contact-form__field-group">
              <label htmlFor="origin" className="contact-form__label">
                Origin <span className="required">*</span>
              </label>
              <input
                type="text"
                id="origin"
                name="origin"
                className={`contact-form__input ${errors.origin ? 'error' : ''}`}
                value={formData.origin}
                onChange={handleInputChange}
                required
                aria-invalid={!!errors.origin}
                aria-describedby={errors.origin ? 'origin-error' : undefined}
              />
              {errors.origin && (
                <span id="origin-error" className="contact-form__error" role="alert">
                  {errors.origin}
                </span>
              )}
            </div>

            <div className="contact-form__field-group">
              <label htmlFor="destination" className="contact-form__label">
                Destination <span className="required">*</span>
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                className={`contact-form__input ${errors.destination ? 'error' : ''}`}
                value={formData.destination}
                onChange={handleInputChange}
                required
                aria-invalid={!!errors.destination}
                aria-describedby={errors.destination ? 'destination-error' : undefined}
              />
              {errors.destination && (
                <span id="destination-error" className="contact-form__error" role="alert">
                  {errors.destination}
                </span>
              )}
            </div>
          </>
        )}

        {inquiryType === 'quotation' && (
          <div className="contact-form__field-group">
            <label htmlFor="weightVolume" className="contact-form__label">
              Approx. weight / volume
            </label>
            <input
              type="text"
              id="weightVolume"
              name="weightVolume"
              className="contact-form__input"
              value={formData.weightVolume}
              onChange={handleInputChange}
              placeholder="e.g. 500kg, 2 CBM"
            />
          </div>
        )}
      </div>

      <div className="contact-form__field-group">
        {inquiryType === 'quotation' ? (
          <label htmlFor="message" className="contact-form__label">
            Additional details (optional)
          </label>
        ) : (
          <label htmlFor="message" className="contact-form__label">
            Message <span className="contact-form__required">*</span>
          </label>
        )}
        <textarea
          id="message"
          name="message"
          className={`contact-form__textarea ${errors.message ? 'error' : ''}`}
          value={formData.message}
          onChange={handleInputChange}
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <span id="message-error" className="contact-form__error" role="alert">
            {errors.message}
          </span>
        )}
      </div>

      <div className="contact-form__actions">
        <button
          type="button"
          className="btn btn-md btn-primary"
          onClick={(e) => handleSubmit(e, 'whatsapp')}
        >
          <span aria-hidden="true">📱</span> Send via WhatsApp
        </button>
        <button
          type="button"
          className="btn btn-md btn-outline"
          onClick={(e) => handleSubmit(e, 'email')}
        >
          <span aria-hidden="true">✉</span> Send via Email
        </button>
      </div>
    </form>
  );
}
