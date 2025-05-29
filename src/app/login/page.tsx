'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import LanguageWrapper from '@/components/LanguageWrapper';
import { toast } from 'sonner';

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

      // Store user ID in localStorage
      localStorage.setItem('userId', data.IdUtilisateur);

      // Store the token (if needed client-side)
      localStorage.setItem('username', data.username);

      if(data.role == 5){
        router.push('/admin');
      }else{
        router.push('/dashboard');
      }
      
    } catch (error) {
      setError(isArabic ? 'خطأ في تسجيل الدخول' : 'Erreur de connexion');
      toast.error('خطأ في تسجيل الدخول')
      setIsDisabled(false)
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
      <div className="min-h-screen flex items-center justify-center  px-4 bg-[url('/bg.png')] bg-repeat bg-[length:160px_160px]">
        <div className="bg-white border-2 border-[#ccc] shadow-md rounded-none p-8 max-w-[350px] w-full space-y-6">
          {/* <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {isArabic ? 'تسجيل الدخول' : 'Connexion'}
            </h1>
            <button
              className="text-sm text-blue-600"
              onClick={() => setLanguage(isArabic ? 'fr' : 'ar')}
            >
              {isArabic ? 'Français' : 'العربية'}
            </button>
          </div> */}

          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4 w-full">
            <div className='flex justify-center'>
              <p className="text-xl w-fit  mb-2 text-gray-400 flex items-center justify-center gap-2 border-b-[1px] border-gray-400">
                <span><img src="/Gavel.png" className='h-5 w-5'/></span> نظام تدبير  المراسلات
              </p>
            </div>
            <div className='w-fit m-auto mb-5 flex justify-center items-center rounded-full border-[1px] border-gray-200'>
              <img src="/logoLogin.png" className='w-20 h-20 '/>
            </div>
            <div>
              {/* <label className="block mb-1 font-semibold">
                {isArabic ? 'اسم المستخدم' : 'Nom d\'utilisateur'}
              </label> */}
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded-xs"
                placeholder='اسم المستخدم'
                value={UserName}
                onChange={(e) => setUserName(e.target.value)}
              />
            {/* </div>
            <div> */}
              {/* <label className="block mb-1 font-semibold">
                {isArabic ? 'كلمة المرور' : 'mot de passe'}
              </label> */}
              <input
                type="password"
                className="w-full border border-gray-300 p-2 rounded-xs"
                placeholder='كلمة المرور'
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='flex justify-center'>
            <button
              type="submit"
              disabled={isDisabled || UserName === "" || Password === ""}
              onClick={handleLogin}
              
                className="w-[350px] m-auto  bg-[#268DC6]  text-white p-2 rounded-sm  cursor-pointer disabled:bg-gray-400 
             disabled:cursor-not-allowed 
             disabled:opacity-70"
            >
              {isArabic ? 'تسجيل الدخول' : 'Se connecter'}
            </button>
            </div>
          </form>
        </div>
      </div>
    </LanguageWrapper>
  );
}
