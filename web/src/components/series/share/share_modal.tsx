import { MdClose } from "react-icons/md";

import { Strings } from "@/constants/strings";

interface PropTypes {
  url: string;
  onClose: () => void;
}

function ShareModal({ url, onClose }: PropTypes) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-surface rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-default">
          <span className="font-medium">{Strings.share.modalTitle}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-subtle hover:text-gray-900 dark:hover:text-white"
            aria-label={Strings.share.closeButton}
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          <p className="text-sm text-muted break-all text-center">{url}</p>
        </div>
      </div>
    </div>
  );
}

export { ShareModal };
