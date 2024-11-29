import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";

export interface IFooterContext {
    element: JSX.Element;
    setElement: (element: JSX.Element) => void;
}

export const FooterContext = createContext<IFooterContext>({
    element: <></>,
    setElement: () => { console.log("setting footer element") },
});

interface FooterContextProviderProps {
    children: React.ReactNode;
}

export const FooterContextProvider: React.FC<FooterContextProviderProps> = ({
    children
}: FooterContextProviderProps): ReactElement => {
    const [element, setElement] = useState<JSX.Element>(<></>);

    const contextValue = {
        element,
        setElement: useCallback((element: JSX.Element) => {
            setElement(element);
        }, []),
    };

    return (
        <FooterContext.Provider value={contextValue}>
            {children}
        </FooterContext.Provider>
    );
};
