import { Button, Checkbox, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import apiRequest from "../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function Login({ openModal, setOpenModal }) {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  function onCloseModal() {
    setOpenModal(false);
    setusername('');
    setPassword('');
  }
  const {updateUser} = useContext(AuthContext)
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        setIsLoading(true);
        const res = await apiRequest.post("/auth/login", {
            username,
            password,
        });
        console.log("Login successful:", res);
        updateUser(res.data)
        toast.success("Logged in successfully!");
        navigate("/")
        onCloseModal()
    } catch (err) {
        console.log("Login error:", err);
        toast.error("Failed to log in. Please check your username and password.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    onCloseModal();  
    navigate("/SignUp");  
  };


  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
            <form onSubmit={handleLogin}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="username" value="Your username" />
                </div>
                <TextInput
                  id="username"
                  type="username"
                  name="username"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Your password" />
                </div>
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
                <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                  Lost Password?
                </a>
              </div>
              <div className="w-full">
                <Button type="submit" disabled={isLoading}>
                 Log in to your account
                </Button>
                {isLoading && <><Spinner aria-label="Loading" /><span>Loading</span></>}
              </div>
            </form>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500">
                Create account
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
