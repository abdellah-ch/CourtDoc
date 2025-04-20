'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import LanguageWrapper from '@/components/LanguageWrapper';

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const [UserName, setUserName] = useState('');
  const [Password, setPassword] = useState('');
  const [isDisabled,setIsDisabled] = useState(false)
  const [error, setError] = useState('');

  const isArabic = language === 'ar';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserName, Password }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      console.log(data); // Handle successful login response


      if(data.role == 5){
        router.push('/admin');
      }else{
        router.push('/dashboard');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError(isArabic ? 'خطأ في تسجيل الدخول' : 'Erreur de connexion');

    }
    // if (
    //   UserName.toLowerCase() === 'ahmed' &&
    //   Password.toLowerCase() === 'yassine'
    // ) {
    //   router.push('/');
    // } else {
    //   setError(isArabic ? 'الاسم أو النسب غير صحيح' : 'Nom ou prénom incorrect');
    // }
  };

  return (
    <LanguageWrapper lang={language}>
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {isArabic ? 'تسجيل الدخول' : 'Connexion'}
            </h1>
            <button
              className="text-sm text-blue-600"
              onClick={() => setLanguage(isArabic ? 'fr' : 'ar')}
            >
              {isArabic ? 'Français' : 'العربية'}
            </button>
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">
                {isArabic ? 'اسم المستخدم' : 'Nom d\'utilisateur'}
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">
                {isArabic ? 'كلمة المرور' : 'mot de passe'}
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              disabled={isDisabled || UserName === "" || Password === ""}
              onClick={handleLogin}
              
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-bold cursor-pointer disabled:bg-gray-400 
             disabled:cursor-not-allowed 
             disabled:opacity-70"
            >
              {isArabic ? 'دخول' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </LanguageWrapper>
  );
}
