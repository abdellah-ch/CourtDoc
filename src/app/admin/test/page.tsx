
const Page = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Admin Test Page</h1>
            <p>This is a test page for admin.</p>
            <p>You should be able to see this only if you are logged in.</p>
            <p>If you are not logged in, you should be redirected to the login page.</p>
        </div>
    );
}

export default Page;
