import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";

interface UsernameModalProps {
  onSubmit: (username: string) => void;
  onClose?: () => void; // Optional onClose function
}

function UsernameModal({ onSubmit, onClose }: UsernameModalProps) {
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");

  const isValidUsername = username.trim() !== "";

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidUsername) {
      onSubmit(username);
      setOpen(false);
    } else {
      setError("Username cannot be empty.");
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose || (() => {})}
      >
        {" "}
        {/* onClose handling */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm backdrop-filter transition-opacity" />
        </TransitionChild>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <form onSubmit={onFormSubmit}>
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Enter Username
                  </DialogTitle>
                  <div className="mt-5">
                    <label htmlFor="username-input" className="sr-only">
                      Username
                    </label>{" "}
                    {/* Label untuk aksesibilitas */}
                    <input
                      type="text"
                      id="username-input"
                      className="rounded-lg border border-gray-300 p-3 text-center"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }} // Clear error on input change
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}{" "}
                    {/* Display error message */}
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={!isValidUsername}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default UsernameModal;
