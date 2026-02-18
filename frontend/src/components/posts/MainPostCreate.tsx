export default function MainPostCreate() {
  return (
    <div className="w-full h-32 p-6 border-b-2 border-[#D9D9D9] flex flex-col items-end md:hidden">
      <input
        type="text-area"
        className="w-full h-full text-white outline-none"
        placeholder="Co nowego?"
      />
      <button className="h-8 w-18 bg-white rounded-2xl font-semibold">
        Post
      </button>
    </div>
  );
}
