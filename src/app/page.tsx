import FileUpload from "@/components/FileUpload";
import Link from "next/link";

export default function Home() {
  const openGithub = () =>
    window.open("https://github.com/amjed-ali-k/sbte-refactor", "_blank");
  return (
    <>
      <main className="flex bg-black min-h-screen flex-col items-center justify-between p-9 sm:p-24 relative">
        <div className="absolute top-6 right-6">
          <Link
            type="button"
            href={"https://github.com/amjed-ali-k/sbte-refactor"}
            target="_blank"
            rel="noreferrer"
            className="mb-2 flex space-x-1 rounded px-6 py-2.5 text-xs font-medium leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
            style={{ backgroundColor: "#333" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <p>Github</p>
          </Link>
        </div>
        <div>
          <div>
            <div className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                SBTE Tools
              </h1>
            </div>
          </div>
          <FileUpload />
        </div>
        <div>
          <a
            href="https://github.com/amjed-ali-k"
            target="_blank"
            className="text-center"
            rel="noreferrer"
          >
            Made by <strong>Amjed Ali K</strong>
          </a>
          <p className="text-xs text-center">GPTC Perinthalmanna</p>
        </div>
      </main>
    </>
  );
}
