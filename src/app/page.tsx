import { protectServer } from "@/features/auth/utils";
import React from "react";

const Home = async () => {
    await protectServer();

    return <div>You Are Logged In</div>;
};

export default Home;
