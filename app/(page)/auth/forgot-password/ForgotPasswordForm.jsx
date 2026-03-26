"use client";

import React from 'react'
import OtpInput from 'react-otp-input';
import { Eye, EyeClosed } from 'lucide-react';

const ForgotPasswordForm = () => {
    const [otp, setOtp] = React.useState('');
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    return (
        <>
            <div className="grid grid-cols-2 gap-4 mt-10 z-10">

                {/* EMAIL */}
                <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-xs text-white/50">EMAIL</label>
                    <input
                        placeholder="you@example.com"
                        className="bg-[#0c2a2e] border border-white/20 px-4 py-3 rounded-xl outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition"
                    />
                </div>

                <div className='col-span-2 mx-auto my-3'>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        renderSeparator={<span className="mx-2">-</span>}
                        inputMode="numeric"
                        inputStyle={{ border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: '#0c2a2e', borderRadius: '8px', width: '60px', height: '60px', fontSize: '24px' }}
                        renderInput={(props) => <input {...props} />}
                    />
                </div>

                {otp.length === 4 && (
                    <>
                        <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-xs text-white/50">New PASSWORD</label>
                            <div className="relative">
                                <input
                                    type='text'
                                    placeholder="••••••••"
                                    className="bg-[#0c2a2e] border border-white/20 px-4 py-3 rounded-xl outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition w-full"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-xs text-white/50">Confirm New PASSWORD</label>
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="bg-[#0c2a2e] border border-white/20 px-4 py-3 rounded-xl outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition w-full"
                                />

                                <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    {
                                        isPasswordVisible ?
                                            <Eye color='#9fbcc7' />
                                            :
                                            <EyeClosed color='#9fbcc7' />
                                    }
                                </span>
                            </div>
                        </div>
                    </>
                )}


                {/* CTA */}
                <button className="col-span-2 mt-3 bg-[#9fbcc7] text-black font-bold py-3 rounded-xl 
             hover:shadow-none mx-auto w-full px-4 transition-all duration-300"
                >
                    SEND RESET LINK
                </button>

                {/* FOOT NOTE */}
                <p className="col-span-2 text-xs text-white/40 text-center mt-2">
                    We'll send you a link to reset your password.
                </p>
            </div>
        </>
    )
}

export default ForgotPasswordForm