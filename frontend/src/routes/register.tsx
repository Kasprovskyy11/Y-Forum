import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"; // dodaj useNavigate
import CustomButton from "../components/forms/CustomButton";
import CustomInput from "../components/forms/CustomInput";
import YLogo from "../assets/YLogo.png";
import ProfilePhoto from "../assets/profile.png";
import { useState, useRef } from "react";
import axios from "axios"; // dodaj axios
import config from "../config.json";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate(); // dodaj do nawigacji po rejestracji
  const [stage, setStage] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null); // zmień na File zamiast string
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // dla podglądu
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState(""); // zmień na string dla inputa date
  const [name, setName] = useState(""); // to powinno być imię/wyświetlana nazwa
  const [username, setUsername] = useState(""); // to login

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("birth_date", birthDate);
      formData.append("name", name); // wyświetlana nazwa
      formData.append("username", username); // login
      if (photo) formData.append("profilowe", photo);

      const response = await axios.post(
        `http://${config.path}/rejstracja.php`,
        formData,
      );

      if (response.data.success) {
        // 🔥 tutaj zapis do localStorage
        // jeśli backend zwróci ścieżkę do zdjęcia, użyj jej; jeśli nie, fallback

        alert("Registration successful!");
        navigate({ to: "/login" });
      } else {
        alert(response.data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network error - check if server is running");
    }
  };

  return (
    <div className="w-screen max-h-screen bg-black flex justify-center items-center flex-col">
      <div className="h-screen w-screen p-6 flex justify-center items-center flex-col gap-20 lg:w-[30vw] md:w-[50vh]">
        <img src={YLogo} className="scale-50 lg:scale-100" alt="Logo" />
        <h1 className="text-white font-bold text-3xl">Create an account</h1>

        {stage == 0 ? (
          <>
            <div className="w-full flex flex-col justify-center gap-5">
              <CustomInput
                type="email"
                placeholder="Email"
                value={email}
                onChangeFunction={(e) => setEmail(e.target.value)}
              />
              <CustomInput
                type="password"
                placeholder="Password"
                value={password}
                onChangeFunction={(e) => setPassword(e.target.value)}
              />
              <CustomInput
                type="date"
                placeholder="Birth date"
                value={birthDate}
                onChangeFunction={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-5">
              <CustomButton text="Next" onClickFunction={() => setStage(1)} />
              <Link to="/login" className="text-blue-500 hover:text-blue-600">
                I have an account
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-full flex flex-col justify-center gap-5">
              <CustomInput
                type="text"
                placeholder="Display name"
                value={name}
                onChangeFunction={(e) => setName(e.target.value)}
              />
              <CustomInput
                type="text"
                placeholder="Username"
                value={username}
                onChangeFunction={(e) => setUsername(e.target.value)}
              />
              <div className="flex justify-center items-center">
                <img
                  src={photoPreview || ProfilePhoto}
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                  alt="Profile"
                />
              </div>
              <div className="flex justify-center items-center">
                <label className="text-white flex flex-col gap-2">
                  Profile photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    name="profilowe"
                    className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />
                </label>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-5">
              <CustomButton text="Register" onClickFunction={handleRegister} />
              <Link to="/login" className="text-blue-500 hover:text-blue-600">
                I have an account
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
