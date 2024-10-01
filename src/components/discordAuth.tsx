import React, { type ReactElement, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAxios } from "../hooks/use-axios";
import { useAuth } from "../hooks/use-auth";
import { LoginData } from "../models/User";
import { AxiosResponse } from "axios";

export const DiscordAuth: React.FC = (): ReactElement => {
    const { isAuthenticated, login } = useAuth();

    const axios = useAxios();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const discordAuthCode = searchParams.get('code');
    useEffect(() => {
        if (isAuthenticated() == null && discordAuthCode != null)
        {
            authDiscord()
        }
        else
        {
            console.log("discord auth error, code null")
        }
    }, []);

    const authDiscord = async(): Promise<void> => {
        axios.post(`/User/auth/discordLogin?code=${discordAuthCode}`).then(
            (response: AxiosResponse<LoginData>) => {
                const { loginData } = response.data;
                console.log("logging in: %i", loginData.accountId);
                login(loginData);
        }).catch((e) => {
            console.log(e);
          }).finally(() => {
            navigate('/');
        });
    }

    return (
        <></>
    )
}
