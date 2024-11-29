import axios, { type Axios, type AxiosError } from "axios";
import { useMemo } from "react";
import { useAuth } from "./use-auth";

export const useAxios = (): Axios => {
    const { logout, account: user } = useAuth();

    const axiosClient: Axios = useMemo(() => {
        let _requestsCount = 0;
        let _loadingTimer;
        const axiosInstance = axios.create({
            baseURL: "https://api.gachamoon.xyz/api/v1",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                ...(user && { "Authorization": `Bearer ${user.token}` }),
                post: {
                    "Access-Control-Allow-Origin": "https://api.gachamoon.xyz, https://game.gachamoon.xyz",
                }
            }
        });

        axiosInstance.interceptors.request.use((config) => {
            document.body.classList.add('loading-indicator');
            //document.body.style.overflow = 'hidden';
            document.body.style.pointerEvents = 'none'
            _requestsCount++;
            return config;
        });

        axiosInstance.interceptors.response.use(
            (response) => {
                _requestsCount--;
                _loadingTimer = setTimeout(() => {
                    if (_requestsCount < 1) {
                        document.body.classList.remove('loading-indicator');
                        //document.body.style.overflow = 'auto';
                        document.body.style.pointerEvents = 'auto';
                    }
                }, 100);
                return response
            },
            async (error: AxiosError): Promise<AxiosError> => {
                const statusCode = error.response?.status;
                // @ts-ignore
                const serverErrMsg = error.response?.data?.title?.toLowerCase();
                let clientErrMsg = 'Произошла ошибка';

                if (statusCode !== 404) {

                    // if (serverErrMsg) {
                    //     if (serverErrMsg.includes('login failed')) {
                    //         clientErrMsg = 'Неправильный логин или пароль'
                    //     }

                    //     if (serverErrMsg.includes('Ensersoft.Common.Exceptions.Users.UserAlreadyExistsException'.toLowerCase())) {
                    //         clientErrMsg = 'Указанная почта уже используется в системе'
                    //     }

                    //     if (serverErrMsg.includes('One or more validation errors occurred'.toLowerCase())) {
                    //         clientErrMsg = 'Произошла ошибка, проверьте введенные данные и повторите попытку'
                    //     }
                    // }

                    // addToast({
                    //     title: "Ошибка",
                    //     message: clientErrMsg,
                    //     type: ToastType.Error
                    // });
                }

                console.log(error);

                if (statusCode === 401) {
                    logout();
                }
                _requestsCount--;
                _loadingTimer = setTimeout(() => {
                    if (_requestsCount < 1) {
                        document.body.classList.remove('loading-indicator');
                        document.body.style.overflow = 'auto';
                        document.body.style.pointerEvents = 'auto';
                    }
                }, 100);
                return await Promise.reject(error);
            }
        );

        return axiosInstance;
    }, []);

    return axiosClient;
};
