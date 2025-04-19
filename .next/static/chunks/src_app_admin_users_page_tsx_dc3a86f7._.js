(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/admin/users/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const ManageUsers = ()=>{
    _s();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        CodeUtilisateur: '',
        IdRole: '',
        IdCadre: '',
        IdUserFonctionne: '',
        DateEmbauche: '',
        DateAffectation: ''
    });
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ManageUsers.useEffect": ()=>{
            const fetchUsers = {
                "ManageUsers.useEffect.fetchUsers": async ()=>{
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
                }
            }["ManageUsers.useEffect.fetchUsers"];
            fetchUsers();
        }
    }["ManageUsers.useEffect"], []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl font-bold mb-4",
                children: "Manage Users"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/users/page.tsx",
                lineNumber: 98,
                columnNumber: 13
            }, this),
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(ManageUsers, "IoySq5s+gmHl614/Yp+GLpyhedA=");
_c = ManageUsers;
const __TURBOPACK__default__export__ = ManageUsers;
var _c;
__turbopack_context__.k.register(_c, "ManageUsers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_admin_users_page_tsx_dc3a86f7._.js.map