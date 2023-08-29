import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import styles from './RichTextEditor.module.css';
import classnames from 'classnames';

// Importing this client side as it mounts on the document object
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const registerQuill = async () => {
  const { Quill } = await (await import('react-quill')).default;

  const Link = Quill.import('formats/link');
  // Override the existing property on the Quill global object and add custom protocols
  Link.PROTOCOL_WHITELIST = [
    'http',
    'https',
    'mailto',
    'tel',
    'radar',
    'rdar',
    'smb',
    'sms',
  ];

  class CustomLinkSanitizer extends Link {
    static sanitize(url: string) {
      // Run default sanitize method from Quill
      const sanitizedUrl = super.sanitize(url);

      // Not whitelisted URL based on protocol so, let's return `blank`
      if (!sanitizedUrl || sanitizedUrl === 'about:blank') return sanitizedUrl;

      // Verify if the URL already have a whitelisted protocol
      const hasWhitelistedProtocol = this.PROTOCOL_WHITELIST.some(
        (protocol: string) => {
          return sanitizedUrl.startsWith(protocol);
        }
      );

      if (hasWhitelistedProtocol) return sanitizedUrl;

      // if not, then append only 'http' to not to be a relative URL
      return `https://${sanitizedUrl}`;
    }
  }

  Quill.register(CustomLinkSanitizer, true);
};

registerQuill();

interface RichTextEditorProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  isError?: boolean;
}

const RichTextEditor = ({
  value,
  setValue,
  placeholder,
  isError,
}: RichTextEditorProps) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      className={classnames(styles.container, isError && styles.error)}
      placeholder={placeholder}
    />
  );
};

export default RichTextEditor;
