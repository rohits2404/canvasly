import { protectServer } from "@/features/auth/utils";
import React from "react";

const Home = async () => {
    const session = await protectServer();

    return <div>{JSON.stringify(session)}</div>;
};

export default Home;
