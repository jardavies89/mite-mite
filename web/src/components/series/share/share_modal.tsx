import { useEffect, useRef, useState } from "react";

import { Button } from "@material-tailwind/react";
import QRCode from "react-qr-code";
import { MdClose } from "react-icons/md";

import { Strings } from "@/constants/strings";

interface PropTypes {
  url: string;
  onClose: () => void;
}

function ShareModal({ url, onClose }: PropTypes) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-surface rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-default">
          <span className="font-medium">{Strings.share.modalTitle}</span>
          <Button
            variant="text"
            size="sm"
            onClick={onClose}
            className="normal-case text-subtle hover:text-gray-900 dark:hover:text-white p-1"
            aria-label={Strings.share.closeButton}
          >
            <MdClose size={20} />
          </Button>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          <div className="bg-white p-3 rounded">
            <QRCode value={url} size={180} />
          </div>

          <p className="text-sm text-muted break-all text-center">{url}</p>

          <Button
            variant="filled"
            size="sm"
            onClick={handleCopy}
            className="normal-case bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-80"
          >
            {copied ? Strings.share.copiedButton : Strings.share.copyButton}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ShareModal };
