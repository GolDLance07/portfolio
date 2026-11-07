/**
 * The Observatory &mdash; Contact & Signal Configuration
 * Editable structured data for the final contact scene.
 */

export interface ContactMethod {
  id: string;
  label: string;
  displayValue: string;
  href: string;
  isExternal: boolean;
  isPlaceholder: boolean;
  annotation: string;
}

export interface ContactConfig {
  heading: string;
  subheading: string;
  stationTag: string;
  coordinates: string;
  frequency: string;
  leadParagraph: string;
  methods: ContactMethod[];
}

export const CONTACT_CONFIG: ContactConfig = {
  heading: 'Send a Signal',
  subheading: 'TRANSMISSION BUFFER &bull; STATION 06',
  stationTag: 'DEEP-SPACE COMMUNICATIONS ARRAY',
  coordinates: 'AZIMUTH 214° &bull; ELEVATION 48°',
  frequency: '1420.405 MHz (HYDROGEN LINE)',
  leadParagraph:
    "Have an idea, a project, or just want to talk? I'd love to hear from you. Transmissions sent here are monitored continuously.",
  methods: [
    {
      id: 'email',
      label: 'Direct Transmission (Email)',
      displayValue: 'aarushrahulpatel07@gmail.com',
      href: 'mailto:aarushrahulpatel07@gmail.com',
      isExternal: false,
      isPlaceholder: false,
      annotation: 'Primary direct transmission channel',
    },
    {
      id: 'github',
      label: 'GitHub Station',
      displayValue: 'github.com/GolDLance07',
      href: 'https://github.com/GolDLance07',
      isExternal: true,
      isPlaceholder: false,
      annotation: 'Open-source repositories & ML systems',
    },
    {
      id: 'linkedin',
      label: 'Network Relays (LinkedIn)',
      displayValue: 'linkedin.com/in/aarush-rahul-patel',
      href: 'https://www.linkedin.com/in/aarush-rahul-patel-5ba639374',
      isExternal: true,
      isPlaceholder: false,
      annotation: 'Professional profile & connections',
    },
  ],
};

