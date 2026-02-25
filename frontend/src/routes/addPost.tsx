import { createFileRoute } from "@tanstack/react-router";
import type { AddPostInterface } from "../services/addPost";
import { addPost } from "../services/addPost";
import { useState, useRef } from "react";
import { useUser } from "../contexts/userContext";
import LeftPanel from "../components/UI/DesktopUI/LeftPanel";

export const Route = createFileRoute("/addPost")({
  component: RouteComponent,
});

function RouteComponent() {
  const [postText, setPostText] = useState("");
  const [temat, setTemat] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showTematInput, setShowTematInput] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const name = user?.name;
  const charsLeft = 280 - postText.length;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addPostFunction = () => {
    const trimmedTemat = temat.trim();
    const trimmedText = postText.trim();
    if (!trimmedTemat || !trimmedText) return;

    const PostInterface: AddPostInterface = {
      name,
      photoFile: photo || null,
      text: trimmedText,
      temat: trimmedTemat,
    };
    addPost(PostInterface);
  };

  return (
    <div className="lg:grid lg:grid-cols-[1fr_4fr_0fr] h-screen">
      <LeftPanel />
      <div className="text-white flex flex-col justify-center items-center">
        <div className="flex gap-3 w-[80%]  border border-[#D9D9D9] p-6 rounded-2xl">
          {/* Avatar */}

          <div className="flex-1 flex flex-col">
            {/* Textarea */}
            <textarea
              className="w-full min-h-[120px] resize-none bg-transparent text-white text-xl
                font-normal leading-relaxed placeholder-[#5B7083] outline-none p-0 pt-2"
              placeholder="Co się dzieje?"
              onChange={(e) => setPostText(e.target.value)}
              value={postText}
              maxLength={280}
              rows={4}
            />

            {/* Podgląd zdjęcia */}
            {photoPreview && (
              <div className="relative mt-3 rounded-2xl overflow-hidden border border-[#2F3336]">
                <img
                  src={photoPreview}
                  alt="preview"
                  className="w-full max-h-80 object-cover"
                />
                <button
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white
                    rounded-full w-8 h-8 flex items-center justify-center text-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Input tematu */}
            {showTematInput && (
              <div
                className="mt-3 flex items-center gap-2 bg-[#16181C] border border-[#2F3336]
                rounded-full px-4 py-2"
              >
                <span className="text-[#1D9BF0] text-sm">🏷️</span>
                <input
                  type="text"
                  placeholder="Dodaj temat..."
                  value={temat}
                  onChange={(e) => setTemat(e.target.value)}
                  className="bg-transparent text-white text-sm placeholder-[#5B7083]
                    outline-none flex-1"
                  maxLength={50}
                />
                {temat && (
                  <button
                    onClick={() => setTemat("")}
                    className="text-[#5B7083] hover:text-white text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-[#2F3336] my-3" />

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 text-[#1D9BF0]">
                {/* Zdjęcie */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition-colors text-lg"
                  title="Dodaj zdjęcie"
                >
                  🖼️
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="hidden"
                />

                {/* Temat */}
                <button
                  onClick={() => setShowTematInput((v) => !v)}
                  className={`p-2 hover:bg-[#1D9BF0]/10 rounded-full transition-colors text-lg
                    ${showTematInput ? "bg-[#1D9BF0]/20" : ""}`}
                  title="Dodaj temat"
                >
                  🏷️
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${
                    charsLeft <= 20
                      ? "text-red-500"
                      : charsLeft <= 50
                        ? "text-yellow-400"
                        : "text-[#5B7083]"
                  }`}
                >
                  {charsLeft}
                </span>
                <button
                  onClick={addPostFunction}
                  disabled={!temat.trim() || !postText.trim()}
                  className="bg-[#1D9BF0] hover:bg-[#1A8CD8] active:bg-[#1570A6]
                    disabled:opacity-40 disabled:cursor-not-allowed
                    text-white font-bold text-sm px-4 py-1.5 rounded-full
                    transition-colors duration-200 cursor-pointer"
                >
                  Opublikuj
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
