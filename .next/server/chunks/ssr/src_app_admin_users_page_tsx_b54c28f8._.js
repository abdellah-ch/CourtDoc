module.exports = {

"[project]/src/app/admin/users/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const ManageUsers = ()=>{
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        CodeUtilisateur: '',
        IdRole: '',
        IdCadre: '',
        IdUserFonctionne: '',
        DateEmbauche: '',
        DateAffectation: ''
    });
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchUsers = async ()=>{
            setIsLoading(true);
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally{
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    CodeUtilisateur: parseInt(formData.CodeUtilisateur),
                    IdRole: parseInt(formData.IdRole),
                    IdCadre: parseInt(formData.IdCadre),
                    IdUserFonctionne: parseInt(formData.IdUserFonctionne),
                    DateEmbauche: new Date(formData.DateEmbauche),
                    DateAffectation: new Date(formData.DateAffectation)
                })
            });
            if (!response.ok) throw new Error('Failed to create user');
            const newUser = await response.json();
            setUsers([
                ...users,
                newUser
            ]);
            // Reset form
            setFormData({
                CodeUtilisateur: '',
                IdRole: '',
                IdCadre: '',
                IdUserFonctionne: '',
                DateEmbauche: '',
                DateAffectation: '',
                9: <invalid>
            });
        } catch (error) {
            console.error('Error creating user:', error);
        } finally{
            setIsLoading(false);
        }
    };
    // ...keep your existing render logic, but add loading states
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl font-bold mb-4",
                children: "Manage Users"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/users/page.tsx",
                lineNumber: 98,
                columnNumber: 13
            }, this),
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/users/page.tsx",
                lineNumber: 100,
                columnNumber: 27
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/users/page.tsx",
        lineNumber: 97,
        columnNumber: 9
    }, this);
};
const __TURBOPACK__default__export__ = ManageUsers;
}}),

};

//# sourceMappingURL=src_app_admin_users_page_tsx_b54c28f8._.js.map