'use client';
const Page = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to the dashboard!</p>
            <p>This is a protected route.</p>
            <p>You should be able to see this only if you are logged in.</p>
            <p>If you are not logged in, you should be redirected to the login page.</p>
        </div>
    );
}

export default Page;
