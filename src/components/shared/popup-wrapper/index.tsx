'use client'

import Image from 'next/image'
import { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'

import iconCloseSquare from '@/icons/close-square.svg'

type PopupWrapperProps = {
    isOpen: boolean
    onClose: () => void
    children?: ReactNode
    title?: string
}

const PopupWrapper = (props: PopupWrapperProps) => {
    const variant = {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.5, opacity: 0 },
    }

    if (typeof window !== 'undefined' && props.isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = 'auto'
    }

    return createPortal(
        <AnimatePresence>
            {props.isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`bg-blur fixed inset-0 z-[100] flex h-[100dvh] justify-center overflow-auto backdrop-blur-sm`}
                >
                    <div className='flex h-fit min-h-[100dvh] w-full items-center justify-center p-5' onClick={props.onClose}>
                        <motion.div
                            {...variant}
                            transition={{ duration: 0.1 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`relative p-5 border border-black rounded-2xl bg-white text-black shadow-[0_4px_32px_0px_rgba(11,33,64,0.06)]`}
                        >
                            <div className={`flex flex-row items-center justify-between gap-8 w-full`}>
                                {props.title && (
                                    <span className='text-2xl font-bold'>{props.title}</span>
                                )}
                                <button onClick={props.onClose} className='p-[1.5px] rounded-[4px] border-[1.5px] border-black'>
                                    <Image src={iconCloseSquare} alt='' />
                                </button>
                            </div>
                            <div className=''>
                                {props.children}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default PopupWrapper