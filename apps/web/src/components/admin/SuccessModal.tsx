import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SuccessModalProps {
  path: string;
  item: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SuccessModal: React.FC<SuccessModalProps> = (props) => {
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
            className="fixed flex flex-col items-center space-y-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md w-[370px] h-[170px] shadow-md z-50"
          >
            <div className="flex font-semibold justify-center items-center bg-[var(--primaryColor)] w-full text-white h-[45px] rounded-t-md">
              Success
            </div>
            <div className="text-lg font-semibold">
              {props.item} Successfully
            </div>
            <Link href={props.path}>
              <button
                className="bg-[var(--primaryColor)] text-white px-5 py-2 border border-[var(--primaryColor)] rounded-md hover:bg-white hover:text-[var(--primaryColor)] duration-200"
                onClick={() => {
                  props.setIsModalOpen(false);
                }}
              >
                Close
              </button>
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
