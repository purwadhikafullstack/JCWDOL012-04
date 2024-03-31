import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  item: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleArchive: () => Promise<void>;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  return (
    <AnimatePresence>
      {props.isModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7, y: 0, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-50"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: -100, x: -187 }}
            animate={{ opacity: 1, y: -50, x: -187 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.2 }}
            className="fixed flex flex-col items-center space-y-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md w-[370px] h-[200px] shadow-md z-50"
          >
            <div className="flex font-semibold justify-center items-center bg-red-600 w-full text-white h-[45px] rounded-t-md">
              Warning
            </div>
            <div className="text-lg font-semibold text-center">
              Are you sure you want to delete this {props.item}?
            </div>
            <div className="flex items-center space-x-5">
              <button
                className="bg-[var(--primaryColor)] text-white px-5 py-[5px] border border-[var(--primaryColor)] rounded-md hover:bg-white hover:text-[var(--primaryColor)] duration-200"
                onClick={() => {
                  props.setIsModalOpen(false);
                }}
              >
                No
              </button>
              <button
                className="bg-red-600 text-white px-5 py-[5px] border border-red-600 rounded-md hover:bg-white hover:text-red-600 duration-200"
                onClick={() => {
                  props.handleArchive();
                  props.setIsModalOpen(false);
                }}
              >
                Yes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
