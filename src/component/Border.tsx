import type { ReactNode } from "react"

type Props = {
    children: ReactNode
    className?: string
}

export const Border = ({children, className}: Props) => {
    return (
    <div className={`shadow-[0px_0px_10px_0px] shadow-blue-400  flex flex-col justify-center md:justify-start items-center md:w-fit md:h-fit w-full h-full  bg-white rounded-xl py-2 px-4 ${className} `}>
            {children}
        </div>
    )
}