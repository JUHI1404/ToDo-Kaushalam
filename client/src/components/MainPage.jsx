import React, { useContext, useState } from 'react';
import { NavbarComponent } from './NavbarComponent';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'flowbite-react';
import TaskTable from './TaskTable';

export const MainPage = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <>
            <NavbarComponent />
            {currentUser ? (
              <TaskTable />
            ) : (
                
                <div className="flex flex-col items-center justify-center h-screen p-4">
                    <h1 className="text-4xl font-bold mb-4">Let's Get Started!</h1>
                    <p className="text-xl mb-6">
                        Upscale your productivity by 10x.
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <Button href="/login" className="w-32">
                            Log In
                        </Button>
                        <Button href="/signup" className="w-32" color="primary">
                            Sign Up
                        </Button>
                    </div>
                    <p className="mt-4 text-sm">
                        Create Tasks Right Away!.
                    </p>
                </div>
            )}
        </>
    );
};
